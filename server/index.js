const express = require('express')
const path = require('path')
const env = require('dotenv').config()

var google_locations = require('google-locations');
var locations = new google_locations(process.env.API_KEY);

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//locations.search({keyword: 'Google', location: [37.42291810, -122.08542120]}, (err, response) => {
//    console.log("search: ", response.results);
//
//    locations.details({placeid: response.results[0].place_id}, (err, response) => {
//        console.log("search details: ", response.result.name);
//        // search details: Google
//    });
//});

locations.searchByAddress({
    address: '1600 Amphitheatre Pkwy, Mountain View, CA', 
    name: 'Goo', 
    maxResults: 2, 
    rankby: "prominence", 
    radius: 5000
    }, 
    (err, response) => {
        for (var index in response.details) {
          console.log("Potential Match: " + response.details[index]);
          // Potential Match: Google
          // Potential Match: Gooey Cookie Factory
        }
        for (var index in response.errors) {
          console.log("Error looking up place details: ", response.errors[index]);
        }
    }
);

//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, '/index.html'));
//});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})