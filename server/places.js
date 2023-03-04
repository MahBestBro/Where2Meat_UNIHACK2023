const axios = require('axios');

/**
 * This function is from the places API to autocomplete a location search
 * @param {string} query: The query to search for
 * @returns predictsions: An array of predictions
 */
async function autocompleteLocationSearch(query) {
    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json")
    url.searchParams.append("input", query)
    url.searchParams.append("types", "establishment")
    url.searchParams.append("region", "au")
    url.searchParams.append("key", process.env.API_KEY)

    const response = await axios.get(url.href)
    return response.data
}

/*
Finds nearby cafes and restaurants within a given radius at a latitude/longitude point.
Parameters: 
  location: An array of two numbers representing a latitude/longitude point (i.e., [lat, lon]).
  radius_m [opt]: The search radius in metres.

Example:
    searchForFoodPlaces([-37.850921, 145.098048]).then((places) => console.log(places[0].name));
    Output: McDonald's Burwood
*/
//TODO: add way to use next_page_token? 
async function searchForFoodPlaces(location, radius_m = 100) {
    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json")
    url.searchParams.append("location", location)
    url.searchParams.append("radius", radius_m)
    url.searchParams.append("types", "cafe|restaurant|bar")
    url.searchParams.append("key", process.env.API_KEY)

    const response = await axios.get(url.href)
    var places = response.data.results;
    for (let i in places) {
        for (let p in places[i].photos) {
            places[i].photos[p].html_attributions.length = 0;  
        }
    } 
    return places;
}

async function placeDetails(placeId) {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json")
    url.searchParams.append("place_id", placeId)
    url.searchParams.append("key", process.env.API_KEY)

    const response = await axios.get(url.href)
    return response.data
}

module.exports = autocompleteLocationSearch

// console.log((autocompleteLocationSearch("howitt")));