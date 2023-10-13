function createRows() {
    for (let i = 0; i < 20; i++) {
        const createRow = document.createElement('div');
        createRow.classList = 'row';
        rowContainer.appendChild(createRow);
        createSeats(createRow);
    }
}

function createSeats(createRow) {
    for (let i = 0; i < 12; i++) {
        const createSeat = document.createElement('div');
        createSeat.classList = 'seat';
        createRow.appendChild(createSeat);
    }
}