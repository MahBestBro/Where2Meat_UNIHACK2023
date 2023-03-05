const inputs = document.querySelectorAll("input[name*='location']");

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
}

/**
 * setup the autocomplete for each input
 */
inputs.forEach((input) => {
  input.addEventListener(
    "input",
    debounce(async (e) => {
      const query = e.target.value;
      const response = await fetch("/places/autocomplete/" + query);
      const { predictions } = await response.json();
      console.log(predictions);

      const datalistElement = input.parentElement.querySelector("datalist");
      datalistElement.innerHTML = "";
      predictions.forEach((prediction) => {
        const option = document.createElement("option");
        option.value = prediction.description;
        option.textContent = prediction.description;
        option.dataset.placeId = prediction.place_id;

        datalistElement.append(option);
      });
    }, 1000)
  );
});

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
  // Place markers on the map
  const placeIds = [...inputs]
    .filter((input) => input.value.trim() != "")
    .map(
      (input) =>
        input.parentElement.querySelector("datalist").querySelector("option")
          .dataset.placeId
    );

  const locations = [];

  // placeIds.forEach(async (placeId, index) => {
  //     const response = await fetch("/places/details/" + placeId);
  //     const { result } = await response.json();
  //     const { location } = result.geometry;
  //     console.log("location", index, location)
  //     locations.push(location)
  //     new google.maps.Marker({
  //         position: location,
  //         map: window.map,
  //         title: `marker: ${index.toString()} : ${result.name}`
  //     })
  // })

  for await (const [index, placeId] of placeIds.entries()) {
    const response = await fetch("/places/details/" + placeId);
    const { result } = await response.json();
    const { location } = result.geometry;
    console.log("location", location);
    locations.push(location);
    new google.maps.Marker({
      position: location,
      map: window.map,
      title: `marker: ${index.toString()} : ${result.name}`,
    });
  }

  console.log("locations", locations);
  // get the central location
  const recommendations = await fetch(
    `/recommendations?locations=${JSON.stringify(locations)}`
  );
  const { centerPoint, data } = await recommendations.json();

  // marker for center point
  new google.maps.Marker({
    position: {
      lat: centerPoint[0],
      lng: centerPoint[1],
    },
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    },
    map: window.map,
    title: "center point",
    fillColor: "blue",
  });

  console.log(centerPoint, data);
});

export default async function getPlaces(query, YOUR_API_KEY) {
  const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${YOUR_API_KEY}`;
  const response = await fetch(URL);
  const data = await response.json();
  console.log(data);
}
