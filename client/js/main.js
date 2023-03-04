// if (window.navigator.geolocation) {
//     // Geolocation available
//     console.log("Geolocation available")
//     window.navigator.geolocation.getCurrentPosition(success, error);
// } else {
//     // Geolocation not available
//     console.log("Geolocation not available")
//     window.navigator.geolocation.getCurrentPosition(success, error);
// }

// function success(position) {
//     console.log("success")
//     console.log(position)
// }

// function error() {
//     console.log("error")
// }

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