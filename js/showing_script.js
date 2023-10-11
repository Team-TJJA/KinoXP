import {postOrPutObjectAsJson, restDelete} from "./module.js";
const showing_date = document.getElementById("showing_date");
const movie_id = document.getElementById('movie_id')
const theater_id = document.getElementById('theater_id')
//const showings_url = "https://kinoxp-back.azurewebsites.net/showings"
const showings_url = "http://localhost:8080/showings"

fetchMovies();
fetchTheaters();
fetchShowings();

function setDate() {
    const today = new Date().toISOString().split('T')[0];
    showing_date.setAttribute("min", today);
    showing_date.setAttribute("value", today);
}

setDate();

showing_date.addEventListener("change", function() {
    const selectedDate = showing_date.value;
});
/*----------------------------------------------FORM---------------------------------------------------*/
document.addEventListener('DOMContentLoaded', createFormEventListener);

let showing_form;

function createFormEventListener() {
    showing_form = document.getElementById('showing_form');
    showing_form.addEventListener('submit', handleSubmitForm);
}

//ADD to Module
async function handleSubmitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;

    try {
        const formData = new FormData(form);
        await postAndPutFormDataAsJson(url, formData);
    } catch(error) {
        alert(error.message); //make error message appear above the 'create form' instead
    }
}


async function postAndPutFormDataAsJson(url, formData) {
    const plainFormData = Object.fromEntries(formData.entries());
    plainFormData.movie = {movieID: plainFormData.movie};
    plainFormData.theater = {theaterID: plainFormData.theater};
    let response;
    if(plainFormData.showingID !== '') {
        response = await postOrPutObjectAsJson(url, plainFormData, 'PUT');
        if(response.ok) {
            alert('SHOWING UPDATED'); //make error message appear above the 'create form' instead
        }
    } else {
        response = await postOrPutObjectAsJson(url, plainFormData, 'POST');
        if(response.ok) {
            alert('SHOWING CREATED'); //make error message appear above the 'create form' instead
        }
    }
}

/*--------------------------------------------FETCH DATA-------------------------------------------------*/
const showing_tbody = document.getElementById('showing_tbody');
let showingArray;

async function fetchAnyData(url) {
    const response = await fetch(url);
    const jsonFormat = await response.json();
    return jsonFormat;
}

async function fetchShowings() {
    showingArray = await fetchAnyData(showings_url);
    showingArray.forEach(showing => createTableRow(showing, showing_tbody));
}

async function fetchMovies() {
    //showingArray = await fetchAnyData("https://kinoxp-back.azurewebsites.net/movies");
    showingArray = await fetchAnyData("http://localhost:8080/movies");
    fillMovieDropdown(movie_id, showingArray, 'Movie');
}

async function fetchTheaters() {
    //showingArray = await fetchAnyData("https://kinoxp-back.azurewebsites.net/theaters");
    showingArray = await fetchAnyData("http://localhost:8080/theaters");
    fillTheaterDropdown(theater_id, showingArray, 'Theater');
}

function setTextContent(firstElement, defaultText) {
    firstElement.textContent = `Select ${defaultText}`;
    firstElement.disabled = true;
    firstElement.selected = true;
}

function fillTheaterDropdown(dropdownId, array, defaultText) {
    const firstElement = document.createElement('option');
    setTextContent(firstElement, defaultText)
    dropdownId.appendChild(firstElement);
    array.forEach(element => {
        const optionElement = document.createElement('option');
        optionElement.textContent = element.size;
        optionElement.value = element.theaterID;
        dropdownId.appendChild(optionElement);
    });
}

function fillMovieDropdown(dropdownId, array, defaultText) {
    const firstElement = document.createElement('option');
    setTextContent(firstElement, defaultText)
    dropdownId.appendChild(firstElement);
    array.forEach(element => {
        const optionElement = document.createElement('option');
        optionElement.textContent = element.title;
        optionElement.value = element.movieID;
        dropdownId.appendChild(optionElement);
    });
}

/*-------------------------------------------CREATE TABLE------------------------------------------------*/
/** CreateTableRow:
 *  The function takes in dataObject (movie) and the reference to the tables tbody tag in the html.
 *  1. It creates the tr-tag (tablerow) 'trContainer'. This is our container for one row in the table.
 *  2. The dataObject (movie) recieved as parameter is looped through.
 *  3. Inside the loop a td-tag will be created and stored in the variable tdElement.
 *  4. The if-statement will check for either the property is a photo or not and append it to the tdElement.
 *  5. At then end of the loop we will append/place the tdElement into the trContainer.
 *     So in generel from the dataObjects properties we create elements and put them all in a "box" / trContainer.
 *  6. We call the function createUpdateMovieButton that returns a td element that we store in updateAction.
 *     This td element wil be appended to the trContainer too, just like the tdElement (*3).
 *  7. The same happens for the createDeleteMovieButton.
 *  8. At the end of the function the trContainer that holds our tdElements (properties of dataObject / movie),
 *     update and delete buttons, will be appended to our table.
 */
function createTableRow(dataObject, tableElement) {
    // 1.
    const trContainer = document.createElement('tr');
    // 2.
    for (const property in dataObject) {
        // 3.
        const tdElement = document.createElement('td');
        // 4.
        if(property === 'movie') {
            const movie = dataObject.movie;
            const tdElement2 = document.createElement('td');
            tdElement2.textContent = movie.title;
            trContainer.appendChild(tdElement2)
            const img = document.createElement('img');
            img.setAttribute("src", movie.photo);
            img.setAttribute("alt", "movie photo");
            img.setAttribute("width", 100);
            img.setAttribute("height", 80);
            tdElement.appendChild(img);
        } else if (property === 'theater') {
            const theater = dataObject.theater;
            tdElement.textContent = theater.size;
        } else {
            tdElement.textContent = dataObject[property];
        }
        // 5.
        trContainer.appendChild(tdElement);
    }
    // 6.
    const updateAction = createUpdateShowingButton(dataObject);
    trContainer.appendChild(updateAction);
    // 7.
    const deleteAction = createDeleteShowingButton(trContainer, dataObject);
    trContainer.appendChild(deleteAction);
    // 8.
    tableElement.appendChild(trContainer);
}

/*---------------------------------------CREATE UPDATE BUTTON--------------------------------------------*/
function createUpdateShowingButton(dataObject) {
    const updateAction = document.createElement('td');
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
        const { showingID, price, movie, theater, showDate, showTime } = dataObject;

        document.getElementById('id').setAttribute('value', showingID);
        document.getElementById('price').value = price;
        document.getElementById('movie_id').value = movie.movieID;
        document.getElementById('theater_id').value = theater.theaterID;
        document.getElementById('showing_date').value = showDate;
        document.getElementById('showing_time').value = showTime;
    });

    updateAction.appendChild(updateButton);

    return updateAction;
}

function createDeleteShowingButton(trContainer, dataObject) {
    const deleteAction = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        trContainer.remove();
        deleteObjectById(dataObject.showingID);
    });

    deleteAction.appendChild(deleteButton);

    return deleteAction;
}


async function deleteObjectById(objectId) {
    try {
        const response = await restDelete(showings_url.concat(`/${objectId}`))
        const data = await response.text();
        alert(data);
    } catch(error) {
        alert(error.message);
    }
}