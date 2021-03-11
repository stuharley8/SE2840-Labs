// Class: SE2840 - Lab 7 - MongoDB Bus Speed Checker
// Name: Stuart Harley
// Class Section: 021

// Tell the code inspection tool that we're writing ES6 compliant code:
// jshint esversion: 6
// Tell the code inspection tool that we're using "developer" classes (console, alert, etc)
// jshint devel:true
// See https://jshint.com/docs/ for more JSHint directives
// jshint unused:false

const mapquest_key = "1oGKRPCK87SyCI0bcYAqhGrbVRgF9kDI";

class BusSpeedChecker {
    constructor() {
        let map = null;         // reference to the MapQuest map object
        let layerGroup = null;  // reference to the layer group for removing markers
        let speed; // reference to whatever speed value is currently

        // The onLoad member function is called when the document loads and is used to perform initialization.
        this.onLoad = () => {
            createMap();  // Initialize the MapQuest map

            // initialize button event handlers
            $("#submit").click(doDisplay);
        };  // end onLoad function

        // Create a MapQuest
        // Note: You must set a finite size for the #map element using CSS; otherwise it won't appear!
        const createMap = () => {
            L.mapquest.key = mapquest_key;
            // 'map' refers to a <div> element with the ID map
            map = L.mapquest.map('map', {
                center: [43.044240, -87.906446],   // GPS lat/long location of MSOE athletic field
                layers: L.mapquest.tileLayer('map'),
                zoom: 13 // Zoom level to display downtown Milwaukee
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
        const doAjaxRequest = (request, spd) => {
            let requestData = null;
            if(spd !== undefined) {
                requestData = `spd=${spd}`;
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

        // This function executes the click action on the submit button
        const doDisplay = () => {
            const spd = $("#speed").val();
            if(validIntegerInput(spd)) {
                doAjaxRequest("BusSpeed", spd);
            } else {
                displayErrorMessage("Speed value must be an integer > 0.");
            }
        };// end inner function doDisplay

        // This function is called if the Ajax request succeeds.
        // The response from the server is a JavaScript object!
        // Note that the Ajax request can succeed, but the response may indicate an error
        const handleSuccess = (response, textStatus, jqXHR) => {
            clearDisplay();
            clearTable();
            clearMap();

            // Check to ensure that the response does not indicate an error!
            if(response.status === undefined) {
                displayErrorMessage("Bad response from server");
                return;
            }
            if(response.status === "error") {
                displayErrorMessage(`Error: ${response.message}`);
                return;
            }
            if(response.length === 0) {
                displayBusCountMessage(response.speed, 0);
                return;
            }

            // Iterate through the response to create the table and markers for the map
            let innerhtml = "";
            response.values.forEach((element) => {
                // Get the vehicle id, latitude, longitude, speed, and route of each bus
                const vid = `${element.vid}`;
                const lat = `${element.lat}`;
                const lon = `${element.lon}`;
                const spd = `${element.spd}`;
                const rt = `${element.rt}`;
                innerhtml += `<tr><td>${vid}</td><td>${lat}</td><td>${lon}</td><td>${spd}</td></tr>`;

                // Add a marker to the map representing the updated position of each bus, along with information about the bus
                addMarker(map, [lat, lon], `${vid}:${spd}`, rt);
            });
            $("#tbody").html(innerhtml);
            displayBusCountMessage(response.speed, response.length);
        }; // end inner function handleSuccess

        // This function is called if the Ajax request fails (e.g. network error, bad url, server timeout, etc)
        const handleError = (jqXHR, textStatus, errorThrown) => {
            console.log("Error processing Ajax request!");
            clearTable();
            clearMap();
            displayErrorMessage(`Ajax Request Failed: ${textStatus}`);
        }; // end inner function handleError

        // Clear the map of all old markers
        const clearMap = () => {
            layerGroup.clearLayers();  // clear old markers
        }

        // Clear the table of all data, except for the table header
        const clearTable = () => {
            $("#tbody").empty();
        }

        // Clear the error message display area
        const clearDisplay = () => {
            $("#messages").hide();
        }

        const displayBusCountMessage = (speed, count) => {
            $("#messages").css("color", "black").html(`Speeding buses >= ${speed} mph: ${count}`).show();
        }

        // Display the given error message in the error display area
        const displayErrorMessage = (message) => {
            $("#messages").css("color", "red").html(message).show();
        }

        // Checks if a value is a valid integer and > 0. Returns true/false.
        const validIntegerInput = (value) => {
            if(isNaN(value)) {
                return false;
            }
            const num = parseFloat(value);
            return Number.isInteger(num) && num > 0;
        }
    }; // end constructor
} // end class BusSpeedChecker

// when document loads, do some initialization
$(document).ready(() => {
    const busSpeedChecker = new BusSpeedChecker();
    busSpeedChecker.onLoad();
});