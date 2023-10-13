import {fillDropdown, postOrPutObjectAsJson, restDelete} from "./module.js";

const category = document.getElementById('category')
const ageLimit = document.getElementById('age_limit')
const ageLimits = ["A", "PG7", "PG11", "PG15", "F"];
const movieCategories = ["ACTION", "COMEDY", "DRAMA", "ROMANCE", "HORROR", "SCIFI", "FANTASY", "SUPERHERO"];

fillDropdown(category, movieCategories, 'category');
fillDropdown(ageLimit, ageLimits, 'age limit');

const movie_url = "https://kinoxp-back.azurewebsites.net/movies"

/*----------------------------------------------FORM---------------------------------------------------*/
document.addEventListener('DOMContentLoaded', createFormEventListener);

let movie_form;

function createFormEventListener() {
    movie_form = document.getElementById('movie_form');
    movie_form.addEventListener('submit', handleSubmitForm);
}

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
    console.log(typeof plainFormData.movieID);
    let response;
    if(plainFormData.movieID !== '') {
        response = await postOrPutObjectAsJson(url, plainFormData, 'PUT');
        if(response.ok) {
            alert('MOVIE UPDATED'); //make error message appear above the 'create form' instead
        }
    } else {
        response = await postOrPutObjectAsJson(url, plainFormData, 'POST');
        if(response.ok) {
            alert('MOVIE CREATED'); //make error message appear above the 'create form' instead
        }
    }

}

/*--------------------------------------------FETCH DATA-------------------------------------------------*/
const movie_tbody = document.getElementById('movie_tbody');
let movieArray;


fetchMovies();

async function fetchAnyData(url) {
    const response = await fetch(url);
    const jsonFormat = await response.json();
    return jsonFormat;
}

async function fetchMovies() {
    movieArray = await fetchAnyData(movie_url);
    movieArray.forEach(movie => createTableRow(movie, movie_tbody));
}


/*-------------------------------------------CREATE TABLE------------------------------------------------*/
/** CreateTableRow:
 *  The function takes in dataObject (movie) and the reference to the tables tbody tag in the html.
 *  1. It creates the tr-tag (tablerow) 'trContainer'. This is our container for one row in the table.
 *  2. The dataObject (movie) recieved as parameter is looped through.
 *  3. Inside the loop a td-tag will be created and stored in the variable tdElement.
 *  4. The if-statement will check for either the property is a a photo or not and append it to the tdElement.
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
        if(property === 'photo') {
            const img = document.createElement('img');
            img.setAttribute("src", dataObject[property]);
            img.setAttribute("alt", "movie photo");
            img.setAttribute("width", 100);
            img.setAttribute("height", 80);
            tdElement.appendChild(img);

        } else {
            tdElement.textContent = dataObject[property];
        }
        // 5.
        trContainer.appendChild(tdElement);
    }
    // 6.
    const updateAction = createUpdateMovieButton(dataObject);
    trContainer.appendChild(updateAction);
    // 7.
    const deleteAction = createDeleteMovieButton(trContainer, dataObject);
    trContainer.appendChild(deleteAction);
    // 8.
    tableElement.appendChild(trContainer);
}

/*---------------------------------------CREATE UPDATE BUTTON--------------------------------------------*/

function createUpdateMovieButton(dataObject) {
    const updateAction = document.createElement('td');
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
        const { movieID, title, description, category, ageLimit, photo } = dataObject;

        document.getElementById('id').setAttribute('value', movieID);
        document.getElementById('title').setAttribute('value', title);
        document.getElementById('description').textContent = description;
        document.getElementById('category').value = category;
        document.getElementById('age_limit').value = ageLimit;
        document.getElementById('photo').setAttribute('value', photo);
    });

    updateAction.appendChild(updateButton);

    return updateAction;
}

//TODO:
// - Figure out a way to display that a movie has been created and updated
// - Figure out a way to display that you are now updating a movie

function displayChangesToMovieTable(movie) {

}

/*---------------------------------------CREATE DELETE BUTTON--------------------------------------------*/

function createDeleteMovieButton(trContainer, dataObject) {
    const deleteAction = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        trContainer.remove();
        deleteObjectById(dataObject.movieID);
    });

    deleteAction.appendChild(deleteButton);

    return deleteAction;
}


async function deleteObjectById(objectId) {
    try {
        const response = await restDelete(movie_url.concat(`/${objectId}`))
        const data = await response.text();
        alert(data);
    } catch(error) {
        alert(error.message);
    }
}



