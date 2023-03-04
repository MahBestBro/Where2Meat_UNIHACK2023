export default function placeMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map
    });

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
    })
    // place marker
    map.marker(location);

}