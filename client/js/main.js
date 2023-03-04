import getPlaces from "./locationfinder.js"

const API_KEY = "AIzaSyAGH3JiAZfOMBon4qNy-MBiL7PFGqSDAyI";
getPlaces("monash", API_KEY)


function initMap() {
    console.log("initMap")
    const position = {}

    window.navigator.geolocation.getCurrentPosition((pos => {
        position.lat = pos.coords.latitude;
        position.lng = pos.coords.longitude;

        new google.maps.Map(document.getElementById("map"), {
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
}

window.initMap = initMap;