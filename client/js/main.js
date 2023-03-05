import getPlaces from "./locationfinder.js"
import "./addlocationpicker.js"

// const API_KEY = "AIzaSyAGH3JiAZfOMBon4qNy-MBiL7PFGqSDAyI";
// getPlaces("monash", API_KEY)


async function initMap() {
    console.log("initMap")
    const position = {}

    window.navigator.geolocation.getCurrentPosition((pos => {
        position.lat = pos.coords.latitude;
        position.lng = pos.coords.longitude;

        window.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 17,
            center: {
                lat: parseFloat(position.lat),
                lng: parseFloat(position.lng)
            },
        });
    }), err => console.log(err));

    // const marker = new google.maps.Marker({
    //     position: uluru,
    //     map: map,
    // });

    // show default recommendations for clayton
    const response = await fetch("/default/recommendations")
    const data = await response.json();
    console.log(data);
    const recommendationContainer = document.querySelector(".recommendation-container")
    recommendationContainer.innerHTML = "";
    data.forEach(recommendation => {
        if (!recommendation.rating) return;
        const recommendationElement = `
        <article class="recommendation">
            <div class="column-1">
                <h2>${recommendation.name}</h2>
                <div class="information">
                    <div class="rating">
                        <span class="rating__value">Rating ${recommendation.rating}</span>
                        <span>${"★".repeat(Math.round(recommendation.rating))}</span>
                    </div>
                    <div class="health">
                        <span>Health ${recommendation.health_rating}</span>
                        <span>${"❤️".repeat(Math.round(recommendation.health_rating))}</span>
                    </div>
                    <div class="price-level">
                        <span>Price level:</span>
                        <span>${"💰".repeat(Math.round(recommendation.price_level)) ?? ""}</span>
                    </div>
                </div>
            </div>
            <div class="column-2">
                <img src="${recommendation.photo}">
            </div>
        </article>
    `

        recommendationContainer.innerHTML += recommendationElement;
    })
}

window.initMap = initMap;