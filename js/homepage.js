const moviePlayingDropdown = document.getElementById('moviePlayingDropdown');
const reservationURL = "https://mango-cliff-0e58c8803.3.azurestaticapps.net/reservation"
let showUrlByDate = 'https://kinoxp-back.azurewebsites.net/showings/';

function fillDropdown(dropdownId, array) {
    array.forEach(element => {
        const optionElement = document.createElement('option');
        optionElement.textContent = element;
        optionElement.value = element;
        dropdownId.appendChild(optionElement);
    });
    loadShowsToday();
}

/*------------------------DROPDOWN----------------------*/

const showDatesURL = 'https://kinoxp-back.azurewebsites.net/showings/week';

actionFetchMovieDates(showDatesURL);

async function actionFetchMovieDates(url) {
    const showDates = await fetchAnyData(url);
    const showDatesText = await JSON.parse(showDates);
    fillDropdown(moviePlayingDropdown, showDatesText);
}

async function fetchAnyData(url) {
    let jsonFormat;
    try {
        const response = await fetch(url);
        jsonFormat = await response.text();
    } catch (err) {
        alert('Network issue - data not recieved.')
    }
    return jsonFormat;
}


/*------------------------SHOWING CARDS----------------------*/

moviePlayingDropdown.addEventListener('change', function (event) {
    const date = event.target.value;
    const showCardsUrlByDate = showUrlByDate + date;
    actionFetchShowings(showCardsUrlByDate);
})

function loadShowsToday() {
    moviePlayingDropdown.selectedIndex = 0;
    const date = moviePlayingDropdown.options[moviePlayingDropdown.selectedIndex].value;
    const showCardsUrlByDate = showUrlByDate + date;
    actionFetchShowings(showCardsUrlByDate);
}

function separateShowingsByMovieTitleAndTheater(arrayOfShowings) {
    const showingsByTitleAndTheater= {};
    console.log(arrayOfShowings)
    arrayOfShowings.forEach(showing => {
        const title = showing.movie.movieID;
        const theater = showing.theater.theaterID;
        const key = `${title}-${theater}`;
        if (showingsByTitleAndTheater[key]) {
            showingsByTitleAndTheater[key].push(showing);
        } else {
            showingsByTitleAndTheater[key] = [showing];
        }
    });
    const arrayOfArraysOfShowings = Object.values(showingsByTitleAndTheater)
    createShowingCards(arrayOfArraysOfShowings);
}

async function actionFetchShowings(url) {
    const showings = await fetchAnyData(url);
    const showingsArray = await JSON.parse(showings)
    separateShowingsByMovieTitleAndTheater(showingsArray);
}

function createShowingCards(arrayOfarraysOfShowings) {
    const mainContainer = document.getElementById('main-container1');
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
    arrayOfarraysOfShowings.forEach(showingArray => {
        const showing = showingArray[0];

        //Create showingContainer
        const showingContainer = document.createElement('div');
        showingContainer.classList.add('showingContainer');

        //Create img and append it to showingContainer
        const showImg = document.createElement('img');
        showImg.classList.add('showingPic');
        showImg.setAttribute('src', showing.movie.photo);
        showImg.setAttribute('alt', 'movie photo');
        showingContainer.appendChild(showImg);

        //Create showingInfo
        const showInfo = document.createElement('div');
        showInfo.classList.add('showingInfo');

        //Movie title
        const h3 = document.createElement('h3');
        h3.textContent = showing.movie.title;
        showInfo.appendChild(h3)

        //Movie playing time in minuts
        const h4 = document.createElement('h4');
        h4.textContent = `Playing time: ${showing.movie.duration} minuts`;
        showInfo.appendChild(h4);

        const showTime = document.createElement('div');
        showTime.classList.add('showingTime');
        //Use this if its an array of times objects may add one more loop.
        showingArray.forEach(showing => {
            const timeItem = document.createElement('a');
            timeItem.classList.add('timeItem');
            timeItem.textContent = showing.showTime;
            timeItem.href = reservationURL + "/" + showing.showingID;
            showTime.appendChild(timeItem);
        });

        showInfo.appendChild(showTime);

        const reservationInfo = document.createElement('div');
        reservationInfo.classList.add('reservationInfo');
        reservationInfo.textContent = 'Click the time wanted to go to reservations';
        showInfo.appendChild(reservationInfo);
        showingContainer.appendChild(showInfo);
        mainContainer.appendChild(showingContainer);
    });
}
