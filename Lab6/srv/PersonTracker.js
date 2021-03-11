// Class: SE2840 - Lab 6 - Person Tracker Node.js Server
// Name: Stuart Harley
// Class Section: 021

// Tell the code inspection tool that we're writing ES6 compliant code:
// jshint esversion: 6
// Tell the code inspection tool that we're using "developer" classes (console, alert, etc)
// jshint devel:true
// See https://jshint.com/docs/ for more JSHint directives
// jshint unused:false

const mapquest_key = "1oGKRPCK87SyCI0bcYAqhGrbVRgF9kDI";  // Replace with your MapQuest Key

class PersonTracker {
	constructor() {		
		// Note: Any "private" variables you create via "let x=..." will be visible to all functions below
        let map = null;         // reference to the MapQuest map object
        let layerGroup = null;  // reference to the layer group for removing markers

        // The onLoad member function is called when the document loads and is used to perform initialization.
        this.onLoad = () => {

            // Set the actions for the radio buttons
            $("[type=radio]").click(() => {
                if($("#allRadio").is(":checked")) {
                    $("#filterText").attr("disabled", true);
                } else {
                    $("#filterText").attr("disabled", false);
                }
            });

            createMap();  // Initialize the MapQuest map

            // initialize button event handlers
            $("#displayButton").click(doDisplay);
            $("#sortButton").click(sortTable);
        };  // end onLoad function

        // NOTE: Remaining helper functions are all inner functions of the constructor; thus, they have
        // access to all variables declared within the constructor.

        // Create a MapQuest
        // Note: You must set a finite size for the #map element using CSS; otherwise it won't appear!
        const createMap = () => {
            L.mapquest.key = mapquest_key;
            // 'map' refers to a <div> element with the ID map
            map = L.mapquest.map('map', {
                center: [39.8283, -98.5795],  // center of the US
                layers: L.mapquest.tileLayer('map'),
                zoom: 4 // Zoom level to display all of US
            });
            map.addControl(L.mapquest.control()); // use alternate map control
            layerGroup = L.layerGroup().addTo(map);
        }; // end inner function createMap

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

        // This function executes an Ajax request to the server
        const doAjaxRequest = (request, filterValue) => {
            let requestData = null;
            if(filterValue !== undefined) {
                requestData = `filtervalue=${filterValue}`;
            }
            $.ajax({
                type: "GET",        // Issue a GET request
                url : `http://localhost:3000/${request}`, // Resource to request
                data : requestData, // Data for the request
                async: true,        // Make the request in the background
                dataType: "json",   // Format results in JSON
                success: handleSuccess,
                error: handleError,
            });
        }; // end inner function doAjaxRequest

        // This function executes the click action on the display button
        const doDisplay = () => {
            // Filter based on the selected radio button
            const filterValue = $("#filterText").val();
            if($("#allRadio").is(":checked")) {
                doAjaxRequest("all");
            } else if($("#fnRadio").is(":checked")) {
                doAjaxRequest("firstname", filterValue);
            } else if($("#lnRadio").is(":checked")) {
                doAjaxRequest("lastname", filterValue);
            } else if($("#ageRadio").is(":checked")) {
                doAjaxRequest("age", filterValue);
            } else if($("#homeRadio").is(":checked")) {
                doAjaxRequest("hometown", filterValue);
            }
        };// end inner function doDisplay

        // This function is called if the Ajax request succeeds.
        // The response from the server is a JavaScript object!
        // Note that the Ajax request can succeed, but the response may indicate an error
        const handleSuccess = (response, textStatus, jqXHR) => {
            clearDisplay();
            clearTable();
            clearMap();

            let innerhtml = `<thead><tr><th>Name</th><th>Age</th><th>Hometown</th></tr></thead>`;

            // Check to ensure that the response does not indicate an error!
            if(response.status === undefined) {
                displayErrorMessage("Bad response from server");
                return;
            }
            if(response.status === "error") {
                displayErrorMessage(`Error response: ${response.message}`);
                return;
            }
            if(response.length === 0) {
                displayErrorMessage("No results");
                return;
            }

            // Iterate through the response to create the table and markers for the map
            innerhtml += "<tbody>";
            response.values.forEach((element) => {
                // Get the name, age, hometown and location of each person
                const name = `${element.firstname} ${element.lastname}`;
                const age = element.age;
                const hometown = element.hometown;
                const position = [element.location.lat, element.location.lon];
                innerhtml += `<tr data-lat=${element.location.lat} data-lon=${element.location.lon}><td>${name}</td><td>${age}</td><td>${hometown}</td></tr>`;

                // Add a marker to the map representing the updated position of each bus, along with information about the bus
                addMarker(map, position, name, hometown);
            });
            innerhtml += "</tbody>";

            $("#sortcontrol").removeClass("visually-hidden");
            $("#table").html(innerhtml);
            $("tbody > tr").click((event) => { // Centers the map on the person when clicking on their corresponding row in the table
                const eventTarget = event.currentTarget;
                const position = [parseFloat(eventTarget.dataset.lat), parseFloat(eventTarget.dataset.lon)]
                map.panTo(position);
            });
        }; // end inner function handleSuccess

        // This function is called if the Ajax request fails (e.g. network error, bad url, server timeout, etc)
        const handleError = (jqXHR, textStatus, errorThrown) => {
            console.log("Error processing Ajax request!");
            clearTable();
            clearMap();
            displayErrorMessage("Request to retrieve data failed: " + textStatus);
        }; // end inner function handleError

        // Clear the map of all old markers
        const clearMap = () => {
            layerGroup.clearLayers();  // clear old markers
        }

        // Clear the table of all data
        const clearTable = () => {
            $("#table").empty();
            $("#sortcontrol").addClass("visually-hidden");
        }

        // Clear the error message display area
        const clearDisplay = () => {
            $("#messages").css("color", "black").html("").hide();
        }

        // Display the given error messgae in the error display area
        const displayErrorMessage = (message) => {
            $("#messages").css("color", "red").html(message).show();
        }

        // Sorts the table according to the sort by and direction selections
        const sortTable = () => {
            let rows, i, x, y, colIndex, shouldSwitch;
            let table = $("#table").get(0);
            let switching = true;
            const direction = $("#sortDirection").val(); // returns either inc or dec
            const sortBy = $("#sortType").val(); // returns either name, age, or hometown
            switch(sortBy) {
                case "name":
                    colIndex = 0;
                    break;
                case "age":
                    colIndex = 1;
                    break;
                case "hometown":
                    colIndex = 2;
                    break;
            }
            while(switching) {
                switching = false;
                rows = table.rows;
                for(i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    x = rows[i].getElementsByTagName("TD")[colIndex];
                    y = rows[i+1].getElementsByTagName("TD")[colIndex];
                    if(direction === "inc") {
                        if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if(direction === "dec") {
                        if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                if(shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                    switching = true;
                }
            }
        }
    }; // end constructor
	
} // end class PersonTracker

// when document loads, do some initialization
$(document).ready(() => {
    const personTracker = new PersonTracker();
    personTracker.onLoad();
});
