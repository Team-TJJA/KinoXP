import {fillDropdown} from "./module.js";
const dropdownDate = document.getElementById('dropdown_date')

//table: showings (showing_date)
let dropdownDates
const url = "http://localhost:8080/showingseightdays"

fillDropdown(dropdownDate, dropdownDates, "date")

async function fetchAnyData(url) {
    const response = await fetch(url);
    const jsonFormat = await response.json();
    return jsonFormat;
}

async function fillDropdownDates() {
    dropdownDates = await fetchAnyData(url);
    dropdownDates.forEach(showing => );
}