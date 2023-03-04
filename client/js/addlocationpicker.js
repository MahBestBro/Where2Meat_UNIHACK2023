const locationPickerContainer = document.querySelector(".location-picker");

function addPicker() {
    const numberOfPickers = locationPickerContainer.dataset.items;
    const newPicker = Object.assign(document.createElement("div"), {
        classList: "location-picker__item",
        innerHTML: `<input type="location-${numberOfPickers + 1}" placeholder="Enter location">`
    })
    // update the number of pickers
    locationPickerContainer.dataset.items = numberOfPickers + 1;
    // add the new picker to the container
    locationPickerContainer.append(newPicker);
}

const addLocationButton = document.querySelector(".add-location");