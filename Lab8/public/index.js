// Class: SE2840 - Lab 8 - React Bus Tracker
// Name: Stuart Harley
// Class Section: 021

// Tell the code inspection tool that we're writing ES6 compliant code:
// jshint esversion: 6
// Tell the code inspection tool that we're using "developer" classes (console, alert, etc)
// jshint devel:true
// See https://jshint.com/docs/ for more JSHint directives
// jshint unused:false

const mcts_key = "SEH4ZDtSssezFpmr8XDhUBRUM"; // Your MCTS key here
const mapquest_key = "1oGKRPCK87SyCI0bcYAqhGrbVRgF9kDI"; // Your MapQuest key here

class BusTracker {
    constructor() {
        // Note: Any "private" variables you create via "let x=..." will be visible to all functions below
        let timer = null; // an interval timer
        let update = 0; // update counter
        let map = null; // reference to the MapQuest map object
        let route = ""; // route value that is entered in the route input element
        let layerGroup = null; // Layer that bus markers will be placed on
        const startPoint = [43.044240, -87.906446]; // GPS lat/long location of MSOE athletic field

        // The onLoad member function is called when the document loads and is used to perform initialization.
        this.onLoad = () => {
            map = createMap(startPoint); // map this starting location (see code below) using MapQuest
            addMSOEMarker();
            // initialize button event handlers
            $("#start").click(start);
            $("#stop").click(stopTimer);
        }; // end onLoad function

        // Creates the MSOE marker on the map
        const addMSOEMarker = () => {
            addMarker(map, startPoint, "MSOE Athletic Field", "The place to be!"); // add a push-pin to the map
        };

        // NOTE: Remaining helper functions are all inner functions of the constructor; thus, they have
        // access to all variables declared within the constructor.

        // Create a MapQuest map centered on the specified position. If the map already exists, update the center point of the map per the specified position
        // param position - a GPS array of [lat,long] containing the coordinates to center the map around.
        // Note: You must set a finite size for the #map element using CSS; otherwise it won't appear!
        const createMap = position => {
            L.mapquest.key = mapquest_key;
            // 'map' refers to a <div> element with the ID map
            const map = L.mapquest.map('map', {
                center: position,
                layers: L.mapquest.tileLayer('map'),
                zoom: 14
            });
            map.addControl(L.mapquest.control()); // use alternate map control
            layerGroup = L.layerGroup().addTo(map); // Adding the layer to be used for the markers. This can be cleared easily.
            return map;
        }; // end inner function displayMap

        // This function adds a "push-pin" marker to the existing map
        // param map - map object (returned from createMap method
        // param position - the [lat, long] position of the marker on the map
        // param description - text that appears next to the marker
        // param popup - the text that appears when a user hovers over the marker
        const addMarker = (map, position, description, popup) => {
            L.mapquest.textMarker(position, {
                text: description,
                title: popup,
                position: 'right',
                type: 'marker',
                icon: {
                    primaryColor: '#FF0000',
                    secondaryColor: '#00FF00',
                    size: 'sm'
                }
            }).addTo(layerGroup);
        }; // end inner function addMarker

        // This function starts the ajax requests after the start button is pushed
        const start = () => {
            if (timer !== null) {
                stopTimer();
            }
            update = 0;
            layerGroup.clearLayers(); // Clears all the markers from the map
            addMSOEMarker();
            // When started, it should cause doAjaxRequest to be called every 5 seconds
            doAjaxRequest();
            timer = setInterval(doAjaxRequest, 5000);
        };

        // This function executes an Ajax request to the server
        const doAjaxRequest = () => {
            route = $("#route").val();
            $.ajax({
                type: "GET",
                url: "https://msoe-web-apps.appspot.com/BusInfo", // the url of the MSOE proxy server returning the Ajax response
                data: "key=" + mcts_key + "&rt=" + route, // key and route, for example "key=ABCDEF123456789&rt=31"
                crossDomain: true,
                async: true,
                dataType: "json",
                success: handleSuccess,
                error: handleError
            });
        }; // end inner function doAjaxRequest

        // This function stops the timer and nulls the reference
        const stopTimer = () => {
            clearInterval(timer);
            timer = null;
            // layerGroup.clearLayers(); // These two lines of code would clear the map on a stop. (EXTRA CREDIT). But I don't like how that looks.
            // addMSOEMarker();
            $("#update").empty();
        }; // end inner function stopTimer

        // This function is called if the Ajax request succeeds.
        // The response from the server is a JavaScript object!
        // Note that the Ajax request can succeed, but the response may indicate an error (e.g. if a bad route was specified)
        const handleSuccess = (response, textStatus, jqXHR) => {
            $("#errorLabel").hide();
            $("#update").empty();
            // Check to ensure that the response does not indicate an error such as a bad route number, missing key, or invalid key!
            if (response.status !== undefined) {
                // Handles route error number's 1000 and 1002
                $("#errorLabel").empty().append(response.status).show();
                return;
            } else if (response["bustime-response"].error !== undefined) {
                // Handles route error number 1003
                $("#errorLabel").empty().append(response["bustime-response"].error[0].msg).show();
                return;
            }
            update++;
            $("#update").append(`Update: ${update}`);

            // Otherwise, render the table using React and the values from the response
            // Table shows the bus number, destination, latitude, longitude, speed, and distance of each bus
            ReactDOM.render(React.createElement(BusTrackerTable, { items: response["bustime-response"].vehicle, route: route }), document.getElementById("tablediv"));

            // Add a marker to the map representing the updated position of each bus, along with information about the bus
            response["bustime-response"].vehicle.forEach(vehicle => {
                addMarker(map, [vehicle.lat, vehicle.lon], vehicle.vid, `Route ${route}`);
            });
        }; // end inner function handleSuccess

        // This function is called if the Ajax request fails (e.g. network error, bad url, server timeout, etc)
        const handleError = (jqXHR, textStatus, errorThrown) => {
            console.log("Error processing Ajax request!");
            // Display some type of message to the web page;
            $("#errorLabel").empty().append("Error processing Ajax request!").show();
        }; // end inner function handleError
    }
} // end class BusTracker

// when document loads, do some initialization
$(document).ready(() => {
    const myTracker = new BusTracker();
    myTracker.onLoad();
});
// Class: SE2840 - Lab 8 - React Bus Tracker
// Name: Stuart Harley
// Class Section: 021

// Tell the code inspection tool that we're writing ES6 compliant code:
// jshint esversion: 6
// Tell the code inspection tool that we're using "developer" classes (console, alert, etc)
// jshint devel:true
// See https://jshint.com/docs/ for more JSHint directives
// jshint unused:false

const FT_IN_MILE = 5280;

// Class handles rendering a row of a BusTrackerTable using React
class BusTrackerTableRow extends React.Component {
    render() {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                null,
                this.props.vid
            ),
            React.createElement(
                "td",
                null,
                this.props.des
            ),
            React.createElement(
                "td",
                null,
                this.props.lat
            ),
            React.createElement(
                "td",
                null,
                this.props.lon
            ),
            React.createElement(
                "td",
                null,
                this.props.spd
            ),
            React.createElement(
                "td",
                null,
                this.props.dist
            )
        );
    }
}

// Class handles rendering the Bus Tracker table using React
// Table shows the bus number, destination, latitude, longitude, speed, and distance of each bus
class BusTrackerTable extends React.Component {
    render() {
        const tableRows = this.props.items.map(entry => React.createElement(BusTrackerTableRow, {
            vid: entry.vid,
            des: entry.des,
            lat: entry.lat,
            lon: entry.lon,
            spd: entry.spd,
            dist: entry.pdist / FT_IN_MILE
        }));
        return React.createElement(
            "table",
            { className: "table table-striped" },
            React.createElement(
                "thead",
                { className: "table-dark" },
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Bus"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Route ",
                        this.props.route
                    ),
                    React.createElement(
                        "th",
                        null,
                        "latitude"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "longitude"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "speed(MPH)"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "dist(mi)"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                tableRows
            )
        );
    }
}
