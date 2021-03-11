// Class: SE2840 - Lab 6 - Person Tracker Node.js Server
// Name: Stuart Harley
// Class Section: 021

const personData = require('./PersonData.js');
const webpagedir = `${__dirname}/srv`;
const express = require("express");

const app = new express();
app.use(express.static(webpagedir, { index: "PersonTracker.html" }));

app.get("/all", (request, response) => {
    response.json({status: "success", length: personData.length, values: personData});
});

app.get("/firstname", (request, response) => {
    let firstname = request.query.filtervalue;
    if(!validStringInput(firstname)) {
        response.json({status: "error", message: "Firstname value must not be blank."})
        return;
    }
    firstname = firstname.toLowerCase().trim();
    let filteredPersonData = [];
    for(let i=0; i<personData.length; i++) {
        if(personData[i].firstname.toLowerCase().includes(firstname)) {
            filteredPersonData.push(personData[i]);
        }
    }
    response.json({status: "success", length: filteredPersonData.length, values: filteredPersonData});
});

app.get("/lastname", (request, response) => {
    let lastname = request.query.filtervalue;
    if(!validStringInput(lastname)) {
        response.json({status: "error", message: "Lastname value must not be blank."})
        return;
    }
    lastname = lastname.toLowerCase().trim();
    let filteredPersonData = [];
    for(let i=0; i<personData.length; i++) {
        if(personData[i].lastname.toLowerCase().includes(lastname)) {
            filteredPersonData.push(personData[i]);
        }
    }
    response.json({status: "success", length: filteredPersonData.length, values: filteredPersonData});
});

app.get("/age", (request, response) => {
    let age = request.query.filtervalue;
    if(!validIntegerInput(age)) {
        response.json({status: "error", message: "Filter value must be an integer > 0."})
        return;
    }
    age = parseFloat(age);
    let filteredPersonData = [];
    for(let i=0; i<personData.length; i++) {
        if(personData[i].age === age) {
            filteredPersonData.push(personData[i]);
        }
    }
    response.json({status: "success", length: filteredPersonData.length, values: filteredPersonData});

});

app.get("/hometown", (request, response) => {
    let hometown = request.query.filtervalue;
    if(!validStringInput(hometown)) {
        response.json({status: "error", message: "Hometown value must not be blank."})
        return;
    }
    hometown = hometown.toLowerCase().trim();
    let filteredPersonData = [];
    for(let i=0; i<personData.length; i++) {
        if(personData[i].hometown.toLowerCase().includes(hometown)) {
            filteredPersonData.push(personData[i]);
        }
    }
    response.json({status: "success", length: filteredPersonData.length, values: filteredPersonData});
});

// Checks if a string input for firstname, lastname, or hometown is valid
const validStringInput = (input) => {
    return input !== undefined && input.length > 0;
}

const validIntegerInput = (value) => {
    if(isNaN(value)) {
        return false;
    }
    const num = parseFloat(value);
    return Number.isInteger(num) && num > 0;
}

app.listen(3000);
console.log("Running on http://localhost:3000");