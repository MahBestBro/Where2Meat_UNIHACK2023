const radians = (deg) => deg * Math.PI / 180;
const degrees = (rad) => rad * 180 / Math.PI;

/*
Finds central point from an array of [lat, lon] points. Note this will not work if the points are too far from each other
as curvature of the earth will have an effect, have yet to test approximately when this comes into effect. 

Example:
console.log(findCentrePoint([
  [-37.907350, 145.129688],
  [-37.908112, 145.137021],
  [-37.915283, 145.135616],
  [-37.914382, 145.128020]
]));
Output: [-37.911281811443516, 145.13258626595612]
*/
const findCentrePoint = (latLongPoints) => {
    //Find centre point by averaging cartesian points.
    let centre_cart = { x: 0, y: 0, z: 0 };
    for (let point of latLongPoints) {
        //convert lat/lon to cartesian coordinates.
        centre_cart.x += Math.cos(radians(point[0])) * Math.cos(radians(point[1]));
        centre_cart.y += Math.cos(radians(point[0])) * Math.sin(radians(point[1]));
        centre_cart.z += Math.sin(radians(point[0]));
    }
    centre_cart.x /= latLongPoints.length;
    centre_cart.y /= latLongPoints.length;
    centre_cart.z /= latLongPoints.length;

    //Convert centre point back to lat/lon.
    const hypotenuse = Math.sqrt(centre_cart.x * centre_cart.x + centre_cart.y * centre_cart.y);
    const lat_radians = Math.atan2(centre_cart.z, hypotenuse);
    const lon_radians = Math.atan2(centre_cart.y, centre_cart.x);
    return [degrees(lat_radians), degrees(lon_radians)];
}

module.exports = { findCentrePoint }