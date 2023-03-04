const locationPickerContainer = document.querySelector(".location-picker");
const locationPickerContainerFooter = document.querySelector(".location-picker footer");

function addPicker(e) {
    console.log("reached")
    const numberOfPickers = locationPickerContainer.dataset.items;
    const newPicker = Object.assign(document.createElement("div"), {
        classList: "location-picker__item",
        innerHTML: `<input type="location-${numberOfPickers + 1}" placeholder="Enter location"> <datalist id="${numberOfPickers + 1}"></datalist>`
    })
    // update the number of pickers
    locationPickerContainer.dataset.items = numberOfPickers + 1;
    // add the new picker to the container
    locationPickerContainer.insertBefore(newPicker, locationPickerContainerFooter);
}

const addLocationButton = document.querySelector(".add-item__btn");
addLocationButton.addEventListener("click", addPicker);
