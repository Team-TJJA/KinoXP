import {fillDropdown} from "./module.js";

const ageLimits = ["A", "PG7", "PG11", "PG15", "F"];
const movieCategories = ["ACTION", "COMEDY", "DRAMA", "ROMANCE", "HORROR", "SCIFI", "FANTASY", "SUPERHERO"];

const category = document.getElementById('category')
const ageLimit = document.getElementById('age_limit')

fillDropdown(category, movieCategories)
fillDropdown(ageLimit, ageLimits)

