const express = require('express')
const path = require('path')
const env = require('dotenv').config()
const cors = require('cors')

const googleLocations = require('google-locations');
const locations = new googleLocations(process.env.API_KEY);

const app = express();
const port = 3000;

// set the public folder to serve public assets
app.use(express.static(path.join(__dirname, '..', 'client', 'public')))
app.use(express.static(path.join(__dirname, '..', 'client', 'css')))
app.use(express.static(path.join(__dirname, '..', 'client', 'js')))
app.set("views", path.join(__dirname, '..', 'client', 'views'));
app.set("view engine", "html");
app.engine('html', require('ejs').renderFile);
app.use(cors())

// helper functions
const { findCentrePoint } = require("./center.js")
const { autocompleteLocationSearch, placeDetails } = require("./places.js")


app.get('/', (req, res) => {
  res.render("index")
})

app.get("/places/autocomplete/:q", async (req, res) => {
  const query = req.params.q
  const response = await autocompleteLocationSearch(query)
  res.send(response)
})

app.get("/places/details/:placeid", async (req, res) => {
  const placeId = req.params.placeid
  const response = await placeDetails(placeId)
  res.send(response)
})

app.get("/recommendations", async (req, res) => {
  // query string form: /recommendations?locations=[{lat: 1, lng: 2}, {lat: 3, lng: 4}]
  const locations = JSON.parse(req.query.locations).map(location => [location.lat, location.lng])
  console.log(locations)
  const centrePoint = findCentrePoint(locations)
  console.log(centrePoint);
  // search for restaurants
  const data = []
  await searchForFoodPlaces(centrePoint, (err, place) => {
    if (err) return
    data.push(place)
    // res.json(place)
    // const temp = {
    //   name: place.name,
    //   rating: place.rating,
    //   address: place.vicinity,
    //   types: place.types
    // }
    // if (place.photos) {
    //   temp.photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.API_KEY}`
    // }
    // data.push(temp)
  }, 1000, false)

  console.log(data)
  // res.json(data)
})

var next_page_token = "";

class SearchError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "SearchError"; // (2)
  }
}

/*
Finds nearby cafes and restaurants within a given radius at a latitude/longitude point.
Parameters: 
  lat_lon_point: An array of two numbers representing a latitude/longitude point (i.e., [lat, lon]).
  callback: A callback function that takes an (err, place) as arguments, and is called on each place found. 'place' is the 
  results received back from the places API (for info on properties, see 
  https://developers.google.com/maps/documentation/places/web-service/search-nearby#Place).
  radius_m [opt]: The search radius in metres.
  search_with_previous_options [opt]: If you wish to search again with the same parameters passed to a previous call to
  this functions, set this to true. All other parameters will be ignored when true. If this is true and no next results
  can be found, throws a 'Search Error' as defined above. 

Example:
    searchForFoodPlaces([-37.850921, 145.098048], (err, place) => console.log(place.name));
    Output: McDonald's Burwood
*/
const searchForFoodPlaces = (
  lat_lon_point,
  callback,
  radius_m = 100,
  search_with_previous_options = false,
) => {
  const options = {
    location: lat_lon_point,
    radius: radius_m,
    types: ["cafe", "restaurant"/*, "bar"*/]
  };

  if (search_with_previous_options) {
    if (next_page_token === "")
      throw new SearchError("Attempted to search with previous options when no further results can be found.");

    options.page_token = next_page_token;
  }

  locations.search(options, (err, response) => {
    for (let place of response.results) {
      locations.details({ placeid: place.place_id }, (err, response) => {
        const result = response.result;
        for (let i in result.photos) result.photos[i].html_attributions.length = 0;
        callback(err, result);
      });
    }
    next_page_token = (response.hasOwnProperty('next_page_token')) ? response.next_page_token : "";
  })
}

/*
Gets health rating from given place with 'place_id'. 

Notes: 
- This function likely can't be used outside of callbacks you need a place_id, and that is only obtained asynchronously from 
  what I know.
- The returned value is a dummy value, in an actual implementation this would do some more processing to get a proper health 
  rating.

Example:
  searchForFoodPlaces([-37.850921, 145.098048], (err, place) => getHealthRating(place.place_id, (rating) => console.log(rating)));
  Output: 3.6
*/
const getHealthRating = (place_id, callback) => {
  locations.details({ placeid: place_id }, (err, response) => callback(response.result.rating));
}


//locations.searchByAddress({
//    address: '1600 Amphitheatre Pkwy, Mountain View, CA', 
//    name: 'Goo', 
//    maxResults: 2, 
//    rankby: "prominence", 
//    radius: 5000
//    }, 
//    (err, response) => {
//        //console.log(response.details);
//        for (var index in response.details) {
//          console.log("Potential Match: " + response.details[index].result.name);
//          // Potential Match: Google
//          // Potential Match: Gooey Cookie Factory
//        }
//        for (var index in response.errors) {
//          console.log("Error looking up place details: ", response.errors[index]);
//        }
//    }
//);

app.listen(port, () => {
  console.log(`Where2Meat listening on http://localhost:${port}`)
})
