function cuttingStock(stockCuts, bareLengths, requiredCuts, wasteLimit = 125) {
    let oddLengths = [];
    let results = [];

    bareLengths.sort((a, b) => b - a);
    requiredCuts.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority ? -1 : 1;
        }
        return b.length - a.length;
    });
    stockCuts.sort((a, b) => b - a); // sort stockCuts in descending order

    for (let bareLength of bareLengths) {
        let remainder = bareLength;
        let cutsMade = [];
        for (let requiredCut of requiredCuts) {
            while (remainder >= requiredCut.length && requiredCut.count > 0) {
                remainder -= requiredCut.length;
                requiredCut.count--;
                cutsMade.push(requiredCut.length);
            }
        }
        // cut the remainder into the longest stockCuts if no requiredCut fits
        for (let stockCut of stockCuts) {
            while (remainder >= stockCut) {
                remainder -= stockCut;
                cutsMade.push(stockCut);
            }
        }
        if (remainder >= wasteLimit && remainder < Math.min(...stockCuts)) {
            oddLengths.push(remainder);
        }
        let scrap = remainder < wasteLimit ? remainder : 0;
        results.push({ bareLength, cutsMade, scrap, remainder });
    }

    console.log(results, oddLengths);
    return { results, oddLengths };
}