// Class: SE2840 - Lab 4 - Coin Flip Charter
// Name: Stuart Harley
// Class Section: 021

// Tell the code inspection tool that we're writing ES6 compliant code:
// jshint esversion: 6
// Tell the code inspection tool that we're using "developer" classes (console, alert, etc)
// jshint devel:true
// See https://jshint.com/docs/ for more JSHint directives
// jshint unused:false

class CoinFlipCharter {
    constructor() {
        // Constructor with private and public functions as needed
        let context; // the graphics context of the canvas; similar to a swing ContentPane
        let canvas; // the canvas element; similar to a java swing JFrame

        let chart; // the chartjs object
        let chartData; // data object to be supplied to the chart

        $(document).ready(() => {
            onLoad();
        });

        /**
         * onLoad 
         * Invoked when the document has finished loading - initialize the Chart and set other events
         */
        const onLoad = () => {
            // Add additional variables if needed, but be sure to document them.
            
            // Get the DOM canvas element and context
            let jqCanvas = $("#chart1"); // note: jqCanvas is a jQuery object "wrapping" the underlying DOM canvas element
            canvas = jqCanvas.get(0); // get the DOM canvas element from the jQuery result
            context = canvas.getContext("2d"); // get the context from the canvas
            
            chart = null; // initialize the chart
            Chart.defaults.global.responsive = true; // make the chart responsive

            // Setup the button handler to call a function that updates the page
            $("#update").click(updateDisplay);

            // Call the below function that creates the "default" page that displays the full table and chart for the entire result set
            createDefaultDisplay();
        } // end onLoad()

        /**
         * createDefaultDisplay 
         * Create the "default" page - display all data with no filters
         */
        const createDefaultDisplay = () => {
            // Initialize the "chartData" object used by the Chartjs chart
            // Iterate through the result set, insert the appropriate values into the "chartData" object
            // that will be used by the Chartjs object.
            let labels = [];
            let data = [];
            for(let i=0; i<results.length; i++) {
                labels.push(i);
                data.push(results[i].time);
            }
            // Convert the provided results object elements to the data format supported by chartjs
            updateChartData(labels, data);
            // Display the chart. If an old chart exists, destroy it before creating a new one
            drawChart();
            // Initialize the html of the table
            // Iterate through the result set, adding table rows and table data
            for(let i=0; i<results.length; i++) {
                const row = document.createElement("tr");
                row.id = "row" + i;
                const indexCell = document.createElement("td");
                indexCell.innerHTML = i;
                const idCell = document.createElement("td");
                idCell.innerHTML = results[i].id;
                const coinsCell = document.createElement("td");
                coinsCell.innerHTML = results[i].coins;
                const flipsCell = document.createElement("td");
                flipsCell.innerHTML = results[i].flips;
                const browserCell = document.createElement("td");
                browserCell.innerHTML = results[i].browser;
                const timeCell = document.createElement("td");
                timeCell.innerHTML = results[i].time;
                row.appendChild(indexCell);
                row.appendChild(idCell);
                row.appendChild(coinsCell);
                row.appendChild(flipsCell);
                row.appendChild(browserCell);
                row.appendChild(timeCell);
                $("#tbody1").append(row);
            }
        } // end createDefaultDisplay()

        /**
         * updateDisplay 
         * Invoked when the Apply/Update button is pressed
         *    When it is called, it applies the specified filter expression to the result set, and
         *    redraws the table and chart with only the filtered results.
         */
        const updateDisplay = ()  => {
            // Determine which radio button is currently selected.
            let dataFilter;
            if($("#id1").get(0).checked) {
                dataFilter = "id";
            } else if($("#coins1").get(0).checked) {
                dataFilter = "coins";
            } else if($("#flips1").get(0).checked) {
                dataFilter = "flips";
            } else {
                dataFilter = "browser";
            }
            // Retrieve the filter expression to determine what rows of the result set to show and hide.
            const filter = $("#filter").val();
            // If the filter is empty, then display all the data
            if(filter === "") {
                let labels = [];
                let data = [];
                for(let i=0; i<results.length; i++) {
                    labels.push(i);
                    data.push(results[i].time);
                    $('#row' + i).show();
                }
                updateChartData(labels, data);
                drawChart();
                return;
            }
            // Iterate through the results data filtering based on filter value and type
            // Adding all indexes of the records that match the filter value and type
            let selectedIndexes = [];
            switch(dataFilter) {
                case "id":
                    for(let i=0; i<results.length; i++) {
                        if(results[i].id.includes(filter)) {
                            selectedIndexes.push(i);
                        }
                    }
                    break;
                case "coins":
                    for(let i=0; i<results.length; i++) {
                        if(results[i].coins === parseInt(filter)) {
                            selectedIndexes.push(i);
                        }
                    }
                    break;
                case "flips":
                    for(let i=0; i<results.length; i++) {
                        if(results[i].flips === parseInt(filter)) {
                            selectedIndexes.push(i);
                        }
                    }
                    break;
                case "browser":
                    for(let i=0; i<results.length; i++) {
                        if(results[i].browser.includes(filter)) {
                            selectedIndexes.push(i);
                        }
                    }
                    break;
            }
            // Convert the provided results object elements to the data format supported by chartjs
            // Re-initialize the "data" object used by the Chartjs chart based on the filter value
            // i.e. repopulate it with only the data that the filter does not remove
            // also within the same loop shows/hides the appropriate rows in the table based on the filter value
            let labels = [];
            let data = [];
            for(let i=0; i<results.length; i++) {
                if(selectedIndexes.includes(i)) {
                    labels.push(i);
                    data.push(results[i].time);
                    $('#row' + i).show();
                } else {
                    $('#row' + i).hide();
                }
            }
            updateChartData(labels, data);
            // Display the chart. If an old chart exists, destroy it before creating a new one
            drawChart();
        } // end updateDisplay()
        
        // Add more functions as necessary, but be sure to fully document them.
        /**
         * Convert the provided results object elements to the data format supported by chartjs
         * @param labels the labels for the chart
         * @param data the data for the chart
         */
        const updateChartData = (labels, data) => {
            chartData = {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Coin Flipper Execution Time",
                            backgroundColor: "deepskyblue",
                            data: data
                        }
                    ]
                }
            };
        }

        /**
         * Display the chart. If an old chart exists, destroy it before creating a new one
         */
        const drawChart = () => {
            if(chart !== null) {
                chart.destroy();
            }
            chart = new Chart(context, chartData);
        }
        
        // Set the event to call onLoad when the document is ready
    } // end constructor

    // Note: this method must be static because it is called to create the object instance.
    static create() {
        new CoinFlipCharter(); // create an instance of this class
    }

} // end CoinFlipCharter class