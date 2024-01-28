export function cuttingStock(standardCuts, bareLengths, requiredCuts, wasteLimit = 125) {
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
        for (let stockCut of standardCuts) { // cut the remainder into standardCuts
            while (remainder >= stockCut) {
                remainder -= stockCut;
                cutsMade.push(stockCut);
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
