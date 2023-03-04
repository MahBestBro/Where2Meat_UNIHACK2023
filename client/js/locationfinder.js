
export default async function getPlaces(query, YOUR_API_KEY) {
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${YOUR_API_KEY}`
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data)
}

