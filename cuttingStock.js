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

function cuttingStock(standardCuts, bareLengths, requiredCuts, wasteLimit = 125) {
    let oddLengths = [];
    let results = [];
    let unusedBareLengths = [...bareLengths]; // Create a copy of bareLengths to keep track of used bareLengths

    bareLengths.sort((a, b) => b - a);

    requiredCuts.sort((a, b) => {
        if (a.priority !== b.priority) { // sort requiredCuts by priority, else sort by length
            return a.priority ? -1 : 1;
        }
        return b.length - a.length;
    });

    standardCuts.sort((a, b) => b - a); // sort standardCuts in descending order

    for (let bareLength of bareLengths) {
        let index = unusedBareLengths.indexOf(bareLength); // Find the index of the bareLength in the copy

        if (index > -1) { // If the bareLength is found in the copy
            unusedBareLengths.splice(index, 1); // Remove the used bareLength from the copy
        }

        let remainder = bareLength;
        let cutsMade = [];

        for (let requiredCut of requiredCuts) {
            while (remainder >= requiredCut.length && requiredCut.count > 0) { // cut the bareLength into the requiredCuts
                remainder -= requiredCut.length; // update remainder
                requiredCut.count--;
                cutsMade.push(requiredCut.length); // add the cut to cutsMade
                if (requiredCut.count == 0) { // if all required cuts are satisfied
                    break;
                }
            }
        }
        // cut the remainder into the longest standardCuts if no requiredCut fits
        for (let standardCut of standardCuts) { // cut the remainder into standardCuts
            while (remainder >= standardCut) {
                remainder -= standardCut;
                cutsMade.push(standardCut);
            }
        }
        if (remainder >= wasteLimit && remainder < Math.min(...standardCuts)) { // if the remainder is not a standardCut and is greater than the wasteLimit
            oddLengths.push(remainder);
        }

        let scrap = remainder < wasteLimit ? remainder : 0; // if the remainder is less than the wasteLimit, it is scrap
        results.push({ bareLength, cutsMade, scrap, remainder });

        // Check if all required cuts are satisfied
        if (requiredCuts.every(cut => cut.count === 0)) {
            break; // Stop cutting up bareLengths
        }
    }

    console.log(results, oddLengths, unusedBareLengths);
    return { results, oddLengths, unusedBareLengths };
}


//Testing inputs
let importedStandardCuts = [500, 1000, 2500, 5000]; // Populated from the database eventually
let standardCuts = [];
let bareLengths = [8000, 8000, 8000, 8000, 8000, 5600, 4100, 1800, 4000]; // Populated from the database eventually


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

function removeRequiredCut(length) {
    let index = requiredCuts.findIndex(cut => cut.length === length);
    if (index !== -1) {
        if (requiredCuts[index].count > 1) {
            requiredCuts[index].count--;
        } else {
            requiredCuts.splice(index, 1);
        }
    }
    displayRequiredCuts();
}

function addRequiredCut(lengthToAdd) {
    console.log('addRequiredCut called');
    lengthToAdd = lengthToAdd || parseInt(document.getElementById('requiredCutsInput').value);
    if (isNaN(lengthToAdd)) {
        alert("Invalid input. Please enter a number.");
        return;
    }
    let existingCut = requiredCuts.find(cut => cut.length === lengthToAdd);
    if (existingCut) {
        existingCut.count += requiredMultiple;
    } else {
        requiredCuts.push({ length: lengthToAdd, count: requiredMultiple, priority: true });
    }

    document.getElementById('requiredCutsInput').value = '';
    requiredMultiple = 1;
    document.getElementById('requiredMuliplier').textContent = 'x ' + requiredMultiple;
    displayRequiredCuts();
}

let requiredCuts = [
    { length: 500, count: 6, priority: true },
    { length: 1000, count: 3, priority: true },
    { length: 2500, count: 2, priority: true },
    { length: 545, count: 4, priority: true },
    { length: 600, count: 3, priority: true }
]; // Populated from the database eventually

function displayRequiredCuts() {
    console.log('Required Cuts: ', requiredCuts);
    let table = document.getElementById('requiredCutsTable');
    table.innerHTML = '';

    for (let cut of requiredCuts) {
        let row = table.insertRow();

        // Create a cell for the length
        let lengthCell = row.insertCell();
        lengthCell.innerHTML = cut.length;
        lengthCell.contentEditable = true;
        lengthCell.style.width = '4rem';
        lengthCell.style.textAlign = 'left';
        lengthCell.style.border = '1px solid black';
        lengthCell.onblur = function () {
            let newLength = this.innerHTML;
            let index = requiredCuts.findIndex(c => c.length === parseInt(cut.length));
            if (index !== -1) {
                requiredCuts[index].length = parseInt(newLength);
            }
        };
        lengthCell.onkeypress = function (e) {
            let char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char)) {
                e.preventDefault();
            }
        };

        // Create a cell for the multiple indicator
        let multipleCell = row.insertCell();
        multipleCell.style.minWidth = '2 rem';
        multipleCell.innerHTML = 'x' + cut.count;

        // Create a cell for the delete button
        let deleteCell = row.insertCell();
        let deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        deleteButton.onclick = function () { removeRequiredCut(cut.length); };
        deleteCell.appendChild(deleteButton);

        // Create a cell for the add button
        let addCell = row.insertCell();
        let addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.onclick = function () {
            let lengthToAdd = parseInt(lengthCell.innerHTML); // get the length from the length cell
            addRequiredCut(lengthToAdd); // add the length
        };
        addCell.appendChild(addButton);
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
};

