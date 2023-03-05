/*
Gets health rating from given place with 'place_id'. 

Notes: 
- This function likely can't be used outside of callbacks you need a place_id, and that is only obtained asynchronously from 
  what I know.
- The returned value is a dummy value, in an actual implementation this would do some more processing to get a proper health 
  rating.

Example:
  searchForFoodPlaces([-37.850921, 145.098048], (err, place) => getHealthRating(place.place_id, (rating) => console.log(rating)));
  Output: 3.6
*/
const getHealthRating = (place_id, callback) => {
    const health_rating = (((Math.random() > 0.5) + Math.random()) * (response.result.rating / 5)) * 5;
    locations.details({ placeid: place_id }, (err, response) => callback(health_rating));
}