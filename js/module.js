const ageLimits = ["A", "PG7", "PG11", "PG15", "F"];
const movieCategories = ["ACTION", "COMEDY", "DRAMA", "ROMANCE", "HORROR", "SCIFI", "FANTASY", "SUPERHERO"];

function fillDropdown(dropdownId, array, defaultText) {
    const firstElement = document.createElement('option');
    firstElement.textContent = `Select ${defaultText}`;
    firstElement.disabled = true;
    firstElement.selected = true;
    dropdownId.appendChild(firstElement);

    array.forEach(element => {
        const optionElement = document.createElement('option');
        optionElement.textContent = element;
        optionElement.value = element;
        dropdownId.appendChild(optionElement);
    });
}

async function postOrPutObjectAsJson(url, object, HttpVerb) {
    const objectToJsonString = JSON.stringify(object);
    const fetchOption = {
        method: HttpVerb,
        headers: {'Content-type' : 'application/json'},
        body: objectToJsonString
    }

    const response = await fetch(url, fetchOption);

    return response;
}

async function restDelete(url) {
    const fetchOption = {
        method: "DELETE",
        headers: {'Content-type' : 'application/json'},
    }
    const response = await fetch(url,fetchOption);
    return response;
}


export {fillDropdown, postOrPutObjectAsJson, restDelete, ageLimits, movieCategories}