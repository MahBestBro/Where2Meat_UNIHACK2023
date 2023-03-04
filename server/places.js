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

async function placeDetails(placeId) {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json")
    url.searchParams.append("place_id", placeId)
    url.searchParams.append("key", process.env.API_KEY)

    const response = await axios.get(url.href)
    return response.data
}

module.exports = { autocompleteLocationSearch, placeDetails }

// console.log((autocompleteLocationSearch("howitt")));