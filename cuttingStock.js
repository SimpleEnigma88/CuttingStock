// Cutting stock algorithm - Greedy algorithm;

// Requirements:

// Take a set of stockCuts that represent lengths we always sell and store.
// Take a set of bareLengths that represent the available cutting stock.
// Take a set of requiredCuts that represent the needed cuts for this order.These must be cut from the bareLengths and all are required.

// Choose a barelength and a selection of the cuts that will create the least waste. 
// Fully use that reel before moving onto the next bareLength. 

// Fully used means the remainder of the reel after applying cuts is less than the shortest stockCuts provided.

// Remainders above a wasteLimit variable and below the shortest StockCuts length are turned into oddLengths, any length below the wasteLimit becomes "scrap"

// The algorithm should aim to minimize waste and fully utilized the bareLengths into requiredCuts first, then stockCuts if needed to finish the bareLength.;

// lengths in requiredCuts that do not match stockCuts lengths will have a higher priority than the ones that match stockCuts.

// ToDos:
// Decide what happens when the requiredCuts cannot be satisfied by the bareLengths.
//
//
//
//

// Testing inputs
let importedStandardCuts = [500, 1000, 2500, 5000]; // Populated from the database eventually
let standardCuts = [...importedStandardCuts]; // Use a copy to avoid modifying the imported array
let bareLengths = [8000, 8000, 8000, 8000, 8000, 5600, 4100, 1800, 4000]; // Populated from the database eventually
let requiredCuts = [500, 500, 500, 500, 500, 500, 1000, 1000, 1000, 1000, 2500, 2500, 2500, 5000, 5000, 5000, 545, 545, 545, 545, 545, 725, 725, 725]; // Populated from the database eventually

function cuttingStock(standardCuts, bareLengths, requiredCuts, wasteLimit = 125) {
    let oddLength = 0;
    let results = [];
    let unusedBareLengths = [...bareLengths]; // Create a copy of bareLengths to keep track of used bareLengths

    bareLengths.sort((a, b) => a - b); // sort bareLengths in ascending order

    requiredCuts = requiredCuts.map(length => ({ length, count: 1 })); // Convert requiredCuts to an array of objects with a count property

    requiredCuts.sort((a, b) => b.length - a.length);

    standardCuts.sort((a, b) => b - a); // sort standardCuts in descending order

    for (let bareLength of bareLengths) {
        let index = unusedBareLengths.indexOf(bareLength); // Find the index of the bareLength in the copy

        if (index > -1) { // If the bareLength is found in the copy
            unusedBareLengths.splice(index, 1); // Remove the used bareLength from the copy
        }

        let remainder = bareLength;
        let cutsMade = [];

        for (let i = 0; i < requiredCuts.length; i++) {
            let requiredCut = requiredCuts[i];
            while (remainder >= requiredCut.length && requiredCut.count > 0) {
                remainder -= requiredCut.length;
                requiredCut.count--;
                cutsMade.push(requiredCut.length);
            }
            if (requiredCut.count === 0) {
                requiredCuts.splice(i, 1); // Remove the satisfied requiredCut
                i--; // Adjust the index after removing an element
            }
        }

        // cut the remainder into the longest standardCuts if no requiredCut fits
        for (let i = 0; i < standardCuts.length; i++) {
            let standardCut = standardCuts[i];
            while (remainder >= standardCut) {
                remainder -= standardCut;
                cutsMade.push(standardCut);
            }
        }

        if (remainder >= wasteLimit && remainder < Math.min(...standardCuts)) { // if the remainder is not a standardCut and is greater than the wasteLimit
            oddLength = remainder;
        }

        let scrap = remainder < wasteLimit ? remainder : 0; // if the remainder is less than the wasteLimit, it is scrap
        results.push({ bareLength, cutsMade, scrap, oddLength });

        // Check if all required cuts are satisfied
        if (requiredCuts.every(cut => cut.count === 0)) {
            break; // Stop cutting up bareLengths
        }
    }
    return { results, oddLength, unusedBareLengths, requiredCuts };
}

cuttingStock(standardCuts, bareLengths, requiredCuts);


function displayStandardCuts() {
    let table = document.getElementById('standardCutsTable');
    let row = table.insertRow();
    for (let i = 0; i < importedStandardCuts.length; i++) {
        let cell = row.insertCell();
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'checkbox' + i;
        checkbox.checked = true; // All checkboxes are checked by default
        checkbox.onchange = function () {
            if (this.checked) {
                standardCuts.push(importedStandardCuts[i]);
            } else {
                let index = standardCuts.indexOf(importedStandardCuts[i]);
                if (index !== -1) {
                    standardCuts.splice(index, 1);
                }
            }
            standardCuts.sort((a, b) => b - a); // sort standardCuts in descending order
            console.log('standard Cuts: ', standardCuts);
        };
        cell.appendChild(checkbox);
        let textNode = document.createTextNode(' ' + importedStandardCuts[i]);
        cell.appendChild(textNode);
    }
    // Add all values to standardCuts after the checkboxes have been created and checked
    for (let i = 0; i < importedStandardCuts.length; i++) {
        standardCuts.push(importedStandardCuts[i]);
    }
}

function removeBareLength(length) {
    let index = bareLengths.indexOf(parseInt(length));
    if (index !== -1) {
        bareLengths.splice(index, 1);
    }
    displayBareLengths();
}

function addBareLength(length) {
    let input = document.getElementById('bareLengthInput');
    let lengthToAdd = length || parseInt(input.value);
    if (isNaN(lengthToAdd)) {
        alert("Invalid input. Please enter a number.");
        return;
    }
    for (let i = 0; i < bareMultiple; i++) {
        bareLengths.push(lengthToAdd);
    }
    input.value = '';
    bareMultiple = 1;
    document.getElementById('bareMultiplier').textContent = 'x ' + bareMultiple;
    displayBareLengths();
}

function addRequiredCut(lengthToAdd) {
    console.log('addRequiredCut called');
    lengthToAdd = lengthToAdd || parseInt(document.getElementById('requiredCutsInput').value);
    if (isNaN(lengthToAdd)) {
        alert("Invalid input. Please enter a number.");
        return;
    }
    requiredCuts.push(lengthToAdd);
    document.getElementById('requiredCutsInput').value = '';
    displayRequiredCuts();
}

function removeRequiredCut(length) {
    console.log('top of remove Required Cuts: ', requiredCuts);
    console.log('removeRequiredCut called with length:', length);
    length = parseInt(length);
    let index = requiredCuts.indexOf(length);
    if (index !== -1) {
        requiredCuts.splice(index, 1);
    }
    displayRequiredCuts();
}

function displayRequiredCuts() {
    let table = document.getElementById('requiredCutsTable');
    table.innerHTML = ''; // clear the existing table

    // Reduce the array to get the count of each length
    let counts = requiredCuts.reduce((acc, length) => {
        acc[length] = (acc[length] || 0) + 1;
        return acc;
    }, {});

    // Display each length and its count
    for (let length in counts) {
        let row = table.insertRow();

        // Display the length
        let lengthCell = row.insertCell();
        lengthCell.textContent = length;

        // Display the count
        let countCell = row.insertCell();
        countCell.textContent = 'x ' + counts[length];

        // Add a delete button
        let deleteCell = row.insertCell();
        let deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.onclick = function () {
            removeRequiredCut(parseInt(length));
        };
        deleteCell.appendChild(deleteButton);

        // Add an increase button
        let increaseCell = row.insertCell();
        let increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.onclick = function () {
            addRequiredCut(parseInt(length));
        };
        increaseCell.appendChild(increaseButton);
    }
}

function displayBareLengths() {
    let table = document.getElementById('bareLengthTable');
    table.innerHTML = '';

    let counts = bareLengths.reduce((acc, val) => { // count the number of each length
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
    console.log("Bare lengths available: ", bareLengths);

    console.log("Standard Cuts: ", standardCuts);
}

let bareMultiple = 1;

function incrementBareMultiple(eleID) {
    bareMultiple++;
    document.getElementById(eleID).textContent = 'x ' + bareMultiple;
}

function decrementBareMultiple(eleID) {
    if (bareMultiple > 1) {
        bareMultiple--;
        document.getElementById(eleID).textContent = 'x ' + bareMultiple;
    }
}

let requiredMultiple = 1;

function incrementRequiredMultiple(eleID) {
    requiredMultiple++;
    document.getElementById(eleID).textContent = 'x ' + requiredMultiple;
}

function decrementRequiredMultiple(eleID) {
    if (requiredMultiple > 1) {
        requiredMultiple--;
        document.getElementById(eleID).textContent = 'x ' + requiredMultiple;
    }
}

function checkInput(inputID, buttonID) {
    let input = document.getElementById(inputID);
    let addButton = document.getElementById(buttonID);
    addButton.disabled = !input.value;
}

window.onload = function () {
    displayStandardCuts();
    displayBareLengths();
    displayRequiredCuts();

    document.getElementById('runButton').addEventListener('click', function () {
        let table = document.getElementById('resultsTable');
        table.innerHTML = ''; // clear the table

        let { results } = cuttingStock(standardCuts, bareLengths, requiredCuts); // run the cuttingStock function

        for (let result of results) {
            let row = table.insertRow();

            let bareLengthCell = row.insertCell();
            bareLengthCell.textContent = 'Bare reel used: ' + result.bareLength + ' | ';

            let cutsMadeCell = row.insertCell();
            cutsMadeCell.textContent = 'Cuts: ' + result.cutsMade.join(', ') + ' | ';

            let scrapCell = row.insertCell();
            scrapCell.textContent = 'Scrap: ' + result.scrap + ' | ';

            let remainderCell = row.insertCell();
            remainderCell.textContent = 'Odd Length: ' + result.oddLength;
        }
    });
};

