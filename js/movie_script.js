import {fillDropdown, postOrPutObjectAsJson, ageLimits, movieCategories} from "./module.js";

const category = document.getElementById('category')
const ageLimit = document.getElementById('age_limit')

fillDropdown(category, movieCategories, 'category');
fillDropdown(ageLimit, ageLimits, 'age limit');


document.addEventListener('DOMContentLoaded', createFormEventLisner);

let movie_form;

function createFormEventLisner() {
    movie_form = document.getElementById('movie_form');
    movie_form.addEventListener('submit', handleSumbitForm);
}

async function handleSumbitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;

    try {
        const formData = new FormData(form);
        await postFormDataAsJson(url, formData);
    } catch(error) {
        alert(error.message); //make error message appear above the 'create form' instead
    }
}

async function postFormDataAsJson(url, formData) {
    const plainFormData = Object.fromEntries(formData.entries());

    const response = await postOrPutObjectAsJson(url, plainFormData, 'POST');
    if(response.ok) {
        alert('Movie created'); //make error message appear above the 'create form' instead
    }
}


