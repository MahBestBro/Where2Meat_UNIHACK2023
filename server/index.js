const express = require('express')
const path = require('path')
const env = require('dotenv').config()
const cors = require('cors')
const https = require('https')
const url = require('url')

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
const { autocompleteLocationSearch, placeDetails, searchForFoodPlaces } = require("./places.js")
const { getHealthRating } = require("./health_rating.js")


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
    const centerPoint = findCentrePoint(locations)
    console.log(centerPoint);
    // search for restaurants
    const data = (await searchForFoodPlaces(centerPoint, 1000)).map(place => {
        if (!place.rating) return null;
        if (!place.photos) return null;

        const temp = {
            name: place.name,
            rating: place.rating,
            price_level: place.price_level,
            location: place.geometry.location,
            place_id: place.place_id,
            address: place.vicinity,
            reviews: place.reviews
        }
        temp.health_rating = parseFloat(getHealthRating(place.rating)).toFixed(1)

        if (place.photos) {
            const url = new URL("https://maps.googleapis.com/maps/api/place/photo")
            url.searchParams.append("photo_reference", place.photos[0].photo_reference)
            url.searchParams.append("maxwidth", 400)
            url.searchParams.append("key", process.env.API_KEY)
            temp.photo = url.toString()
            // temp.photo
            // place.photos[0]
        }
        return temp
    }).filter(x => x !== null)

    console.log(data)
    res.json({
        centerPoint,
        data
    })
})

app.get("/default/recommendations", async (req, res) => {
    const defaultjson = require("./Clayton_places.json")
    const data = defaultjson.map(place => {
        const temp = {
            name: place.name,
            rating: place.rating,
            price_level: place.price_level,
            location: place.geometry.location,
            place_id: place.place_id,
            address: place.vicinity,
            reviews: place.reviews
        }
        if (place.photos) {
            const url = new URL("https://maps.googleapis.com/maps/api/place/photo")
            url.searchParams.append("photo_reference", place.photos[0].photo_reference)
            url.searchParams.append("maxwidth", 400)
            url.searchParams.append("key", process.env.API_KEY)
            temp.photo = url.toString()
            // temp.photo
            // place.photos[0]
        }
        return temp
    })
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
  callback: A callback function that takes an (err, places) as arguments. 'places' are the results received back from 
  the places API (for info on properties, see 
  https://developers.google.com/maps/documentation/places/web-service/search-nearby#Place).
  radius_m [opt]: The search radius in metres.
  search_with_previous_options [opt]: If you wish to search again with the same parameters passed to a previous call to
  this functions, set this to true. All other parameters will be ignored when true. If this is true and no next results
  can be found, throws a 'Search Error' as defined above. 

Example:
    searchForFoodPlaces([-37.850921, 145.098048], (err, place) => console.log(place.name));
    Output: McDonald's Burwood
*/
// const searchForFoodPlaces = (
//   lat_lon_point,
//   callback,
//   radius_m = 100,
//   search_with_previous_options = false,
// ) => {
//   const options = {
//     location: lat_lon_point,
//     radius: radius_m,
//     types: ["cafe", "restaurant"/*, "bar"*/]
//   };

//   if (search_with_previous_options) {
//     if (next_page_token === "")
//       throw new SearchError("Attempted to search with previous options when no further results can be found.");

//     options.page_token = next_page_token;
//   }

//   locations.search(options, (err, response) => {
//     var places = response.results;
//     for (let i in places) {
//       for (let p in places[i].photos) {
//         places[i].photos[p].html_attributions.length = 0;
//       }
//     }
//     callback(err, places);
//     next_page_token = (response.hasOwnProperty('next_page_token')) ? response.next_page_token : "";
//   });
// }

/*
Gets further details of a place with the given 'place_id'. Note: This will probably need to be called inside of a callback 
function like searchForFoodPlaces, where it is possible to retrieve the place_id.
*/
const getFurtherDetails = (place_id, callback) => {
    locations.details({ placeid: place_id }, (err, response) => {
        const result = response.result;
        for (let i in result.photos) result.photos[i].html_attributions.length = 0;
        callback(err, result);
    });
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
