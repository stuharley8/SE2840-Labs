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
        return (
            <tr>
                <td>{this.props.vid}</td>
                <td>{this.props.des}</td>
                <td>{this.props.lat}</td>
                <td>{this.props.lon}</td>
                <td>{this.props.spd}</td>
                <td>{this.props.dist}</td>
            </tr>
        )
    }
}

// Class handles rendering the Bus Tracker table using React
// Table shows the bus number, destination, latitude, longitude, speed, and distance of each bus
class BusTrackerTable extends React.Component {
    render() {
        const tableRows = this.props.items.map((entry) =>
            (<BusTrackerTableRow
                vid = {entry.vid}
                des = {entry.des}
                lat = {entry.lat}
                lon = {entry.lon}
                spd = {entry.spd}
                dist = {entry.pdist / FT_IN_MILE}
            />)
        );
        return (
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Bus</th>
                        <th>Route {this.props.route}</th>
                        <th>latitude</th>
                        <th>longitude</th>
                        <th>speed(MPH)</th>
                        <th>dist(mi)</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        )
    }
}