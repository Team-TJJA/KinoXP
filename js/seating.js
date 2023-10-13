import {postOrPutObjectAsJson} from "./module.js";
const container = document.querySelector('.container');
const rowContainer = document.querySelector('.container .row-container')
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.querySelector('#count');
const total = document.querySelector('#total');
const movieSelect = document.querySelector('#movie');
const row = document.querySelector('.row');
const seatsURL = "http://kinoxp-back.azurewebsites.net/seats/"
const reservedSeatsURL = "http://kinoxp-back.azurewebsites.net/reservation/seats/"
const urlParams = new URLSearchParams(window.location.search);
const localStorageKey = urlParams.get('key');
const showing = localStorage.getItem(localStorageKey);

initData();

function initData(){
    const arrayOfSeats = actionFetchSeats(seatsURL+showing.theater.theaterID);
    createRows(arrayOfSeats);
    actionFetchSeats(seatsURL+showing.showingID);
}

let ticketPrice = +movieSelect.value;

//update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatsIndex = [...selectedSeats].map(function(seat) {
        return [...seats].indexOf(seat);
    });
    console.log(seatsIndex);
    //localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
    const selectedSeatCount = selectedSeats.length;
    console.log(selectedSeatCount);
    count.innerText = selectedSeatCount;
    total.innerText = selectedSeatCount * ticketPrice;
}

// movie select event
movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    updateSelectedCount();
});

container.addEventListener('click', e => {
    if(e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
    }
    updateSelectedCount();
});

async function actionFetchSeats() {
    const response = await fetchAnyData(url);
    const jsonFormat = await response.json();
    return jsonFormat;
}

function createRows(arrayOfSeats) {
    for (let rowNumber = 0; rowNumber < showing.theater.numberOfRows; rowNumber++) {
        const createRow = document.createElement('div');
        createRow.classList = 'row';
        rowContainer.appendChild(createRow);
        createSeats(createRow, rowNumber, arrayOfSeats);
    }
}

function createSeats(createRow, rowNumber, arrayOfSeats) {
    for (let seatNumber = 0; seatNumber < showing.theater.numberOfSeatsPerRow; seatNumber++) {
        const createSeat = document.createElement('div');
        createSeat.classList = 'seat';
        createRow.value = arrayOfSeats[seatNumber*rowNumber-1];
        createRow.appendChild(createSeat);
    }
}