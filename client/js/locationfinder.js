const inputs = document.querySelectorAll("input[name*='location']");

function debounce(callback, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
}

inputs.forEach(input => {
    input.addEventListener("input", debounce(async (e) => {
        const query = e.target.value;
        const response = await fetch("/places/autocomplete/" + query);
        const { predictions } = await response.json();
        console.log(predictions)

        const datalistElement = input.parentElement.querySelector("datalist");
        datalistElement.innerHTML = "";
        predictions.forEach(prediction => {
            const option = document.createElement("option");
            option.value = prediction.description;
            option.textContent = prediction.description;
            datalistElement.append(option);
        })
    }, 1000))
})


export default async function getPlaces(query, YOUR_API_KEY) {
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${YOUR_API_KEY}`
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data)
}

