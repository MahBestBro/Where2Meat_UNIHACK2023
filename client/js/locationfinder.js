const inputs = document.querySelectorAll("input[name*='location']");

function debounce(callback, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
}

/**
 * setup the autocomplete for each input
 */
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
            option.dataset.placeId = prediction.place_id;

            datalistElement.append(option);
        })
    }, 1000))
})

// event when input is unfocused
// inputs.forEach(input => {
//     // ignore if the input is empty
//     if (input.value === "") return;

//     input.addEventListener("blur", async (e) => {
//         const place = e.target.value;
//         console.log(place)
//         // get the place id from the datalist
//         const datalistElement = input.parentElement.querySelector("datalist");
//         const option = datalistElement.querySelector(`option[value="${place}"]`);
//         const placeId = option.dataset.placeId;
//         console.log(placeId)

//     })
// })

const submitButton = document.querySelector("button#submit");
const map = document.querySelector("#map");
submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const placeIds = [...inputs].filter(input => input.value.trim() != "").map(input => input.parentElement.querySelector("datalist").querySelector("option").dataset.placeId);
    placeIds.forEach(async (placeId, index) => {
        const response = await fetch("/places/details/" + placeId);
        const { result } = await response.json();
        const { location } = result.geometry;
        new google.maps.Marker({
            position: location,
            map: window.map,
            title: index.toString()
        })
    })

})


export default async function getPlaces(query, YOUR_API_KEY) {
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${YOUR_API_KEY}`
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data)
}

