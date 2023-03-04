const express = require('express');
const env = require('dotenv').config();

var googleLocations = require('google-locations');
var locations = new googleLocations(process.env.API_KEY);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Where2Meat listening on port ${port}`);
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
    types: ["cafe", "restaurant", "bar"] 
  };

  if (search_with_previous_options) {
    if (next_page_token === "")
      throw new SearchError("Attempted to search with previous options when no further results can be found.");
    
    options.page_token = next_page_token;
  } 

  locations.search(options, (err, response) => {
    for (let place of response.results) {
      locations.details({placeid: place.place_id}, (err, response) => {
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
  locations.details({placeid: place_id}, (err, response) => callback(response.result.rating));
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




const radians = (deg) => deg * Math.PI / 180;
const degrees = (rad) => rad * 180 / Math.PI;

/*
Finds central point from an array of [lat, lon] points. Note this will not work if the points are too far from each other
as curvature of the earth will have an effect, have yet to test approximately when this comes into effect. 

Example:
console.log(findCentrePoint([
  [-37.907350, 145.129688],
  [-37.908112, 145.137021],
  [-37.915283, 145.135616],
  [-37.914382, 145.128020]
]));
Output: [-37.911281811443516, 145.13258626595612]
*/
const findCentrePoint = (latLongPoints) => {
  //Find centre point by averaging cartesian points.
  let centre_cart = {x: 0, y: 0, z: 0};
  for (let point of latLongPoints) {
    //convert lat/lon to cartesian coordinates.
    centre_cart.x += Math.cos(radians(point[0])) * Math.cos(radians(point[1]));
    centre_cart.y += Math.cos(radians(point[0])) * Math.sin(radians(point[1]));
    centre_cart.z += Math.sin(radians(point[0]));
  }
  centre_cart.x /= latLongPoints.length;
  centre_cart.y /= latLongPoints.length;
  centre_cart.z /= latLongPoints.length;

  //Convert centre point back to lat/lon.
  const hypotenuse = Math.sqrt(centre_cart.x * centre_cart.x + centre_cart.y * centre_cart.y);
  const lat_radians = Math.atan2(centre_cart.z, hypotenuse);
  const lon_radians = Math.atan2(centre_cart.y, centre_cart.x);
  return [degrees(lat_radians), degrees(lon_radians)];
}