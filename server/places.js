const axios = require('axios');

// const GoogleLocations = require('google-locations');

// const locations = new GoogleLocations('');

// locations.search({ keyword: 'Google', location: [37.42291810, -122.08542120] }, function (err, response) {
//     console.log("search: ", response.results);

//     locations.details({ placeid: response.results[0].place_id }, function (err, response) {
//         console.log("search details: ", response.result.name);
//         // search details: Google
//     });
// });

// locations.autocomplete({ input: 'howitt', types: "establishment" }, function (err, response) {
//     console.log("autocomplete: ", response.predictions);

//     const success = function (err, response) {
//         console.log("did you mean: ", response.result);
//         // did you mean:  Vermont
//         // did you mean:  Vermont South
//         // did you mean:  Vermilion
//         // did you mean:  Vermillion
//     };

//     for (var index in response.predictions) {
//         locations.details({ placeid: response.predictions[index].place_id }, success);
//     }
// });

/**
 * This function is from the places API to autocomplete a location search
 * @param {string} query: The query to search for
 * @returns predictsions: An array of predictions
 */
async function autocompleteLocationSearch(query) {
    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json")
    url.searchParams.append("input", query)
    url.searchParams.append("types", "establishment")
    url.searchParams.append("key", process.env.API_KEY)

    const response = await axios.get(url.href)
    return response.data
}

module.exports = autocompleteLocationSearch

// console.log((autocompleteLocationSearch("howitt")));