// Class: SE2840 - Lab 7 - MongoDB Bus Speed Checker Server
// Name: Stuart Harley
// Class Section: 021

const webpagedir = `${__dirname}/srv`;
const express = require("express");
const mongoose = require("mongoose");

const app = new express();
app.use(express.static(webpagedir, { index: "BusSpeedChecker.html" }));

const connection = mongoose.connect('mongodb://localhost/bustracker', {useNewUrlParser: true, useUnifiedTopology: true});

// A schema describes the format/structure of the documents in a collection
const busSchema = new mongoose.Schema({
    'rt': String,
    'vid': String,
    'spd': Number,
    'tmstmp': String,
    'lat': String,
    'lon': String
});

// A model represents a document in a database collection
const BusModel = mongoose.model('Bus', busSchema);

// Handles an ajax request for /BusSpeed, queries the MongoDB buses collection
app.get("/BusSpeed", (request, response) => {
    // Assumes speed is a valid integer since error checking was done before the ajax request was sent
    const speed = parseFloat(request.query.spd);

    // Find all documents in the collection with a spd value >= speed
    BusModel.find({spd: {$gte: speed}}, (error, records) => {
        if(error !== null) {
            response.json({status: "error", message: "Error retrieving files from database."});
            return;
        }
        response.json({status: "success", speed: speed, length: records.length, values: records});
    });
});

app.listen(3000);
console.log("Running on http://localhost:3000");