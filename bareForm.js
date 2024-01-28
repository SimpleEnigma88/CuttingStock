import { cuttingStock } from './cuttingStock.js';

let stockCuts = [500, 1000, 2500, 5000];
let bareLengths = [8000, 8000, 8000, 8000, 8000, 5600, 4100, 1800, 4000];
let requiredCuts = [
    { length: 500, count: 6, priority: true },
    { length: 1000, count: 3, priority: true },
    { length: 2500, count: 2, priority: true },
    { length: 545, count: 4, priority: true },
    { length: 600, count: 3, priority: true }
];

function increment() {
    let input = document.getElementById('bareLengthInput');
    input.value = parseInt(input.value) + 1;
}

function decrement() {
    let input = document.getElementById('bareLengthInput');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function highlight() {
    let input = document.getElementById('bareLengthInput');
    input.select();
}

function updateLength(index, value) {
    bareLengths[index] = parseInt(value);
}

function removeBareLength(length) {
    let index = bareLengths.indexOf(parseInt(length));
    if (index !== -1) {
        bareLengths.splice(index, 1);
    }
    displayLengths();
}

window.onload = function () {
    displayLengths();
};

function displayLengths() {
    let table = document.getElementById('lengthTable');
    table.innerHTML = '';

    let counts = bareLengths.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    for (let length in counts) {
        let row = table.insertRow();

        // Create a cell for the length
        let lengthCell = row.insertCell();
        lengthCell.innerHTML = length;
        lengthCell.contentEditable = true; // make the cell editable
        lengthCell.style.width = '4rem'; // set the width of the cell
        lengthCell.style.textAlign = 'left'; // align the text to the left
        lengthCell.style.border = '1px solid black'; // add a border to the cell
        lengthCell.onblur = function () { // event when the cell loses focus
            let newLength = this.innerHTML; // get the new length
            let index = bareLengths.indexOf(parseInt(length)); // find the index of the old length
            if (index !== -1) {
                bareLengths[index] = parseInt(newLength); // replace the old length with the new one
            }
        };
        lengthCell.onkeypress = function (e) { // event when a key is pressed
            let char = String.fromCharCode(e.which); // get the character
            if (!/[0-9]/.test(char)) { // if the character is not a digit
                e.preventDefault(); // prevent the character from being entered
            }
        };

        // Create a cell for the multiple indicator
        let multipleCell = row.insertCell();
        multipleCell.style.minWidth = '2 rem';
        multipleCell.innerHTML = 'x' + counts[length];

        // Create a cell for the delete button
        let deleteCell = row.insertCell();
        let deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.onclick = function () { removeBareLength(length); };
        deleteCell.appendChild(deleteButton);

        // Create a cell for the add button
        let addCell = row.insertCell();
        let addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.onclick = function () {
            let lengthToAdd = parseInt(lengthCell.innerHTML); // get the length from the length cell
            addBareLength(lengthToAdd); // add the length
        };
        addCell.appendChild(addButton);
    }
}

let multiple = 1;

function incrementMultiple() {
    multiple++;
    document.getElementById('multiplier').textContent = 'x ' + multiple;
}

function decrementMultiple() {
    if (multiple > 1) {
        multiple--;
        document.getElementById('multiplier').textContent = 'x ' + multiple;
    }
}

function addBareLength(length) {
    let input = document.getElementById('bareLengthInput');
    let lengthToAdd = length || parseInt(input.value);
    for (let i = 0; i < multiple; i++) {
        bareLengths.push(lengthToAdd);
    }
    input.value = '';
    multiple = 1;
    document.getElementById('multiplier').textContent = 'x ' + multiple;
    displayLengths();
}

function checkInput() {
    let input = document.getElementById('bareLengthInput');
    let addButton = document.getElementById('addButton');
    addButton.disabled = !input.value;
}

function calculate() { }
