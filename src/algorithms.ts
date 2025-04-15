// contains algorithms

// finds ALL occurences of inputted target
// returns array of indexes
// O(log n + k), k is the number of occurences of target
// since, you halve the search area every time, is it log2n,
// and then + O(k), since it loops k more times, to find all k other occurences of the target
// Takes 2-6 ms to run on 99000 data, using performance.now()
function binarySearch(target: number | string, data: any[], compareFn: any) : number[]{
    let startTime = performance.now();
    // left bound
    let left: number = 0;
    // right bound
    let right: number = data.length-1;
    // stores indexes of targets found
    let foundIndexes: number[] = []
    // stores current index of target
    let foundIndex: number = -1;

    // check if the compareFn inputted is a function  
    if(typeof compareFn !== 'function'){
        return [-1];
    }
    while(left <= right){
        // find middle index
        let midIndex: number = Math.floor((left+right)/2);
        // store the return value of the compare function
        // O(1)
        let compareResult : number = compareFn(target, data[midIndex]);
        // if the target was found at the midIndex, set the foundIndex to midIndex
        if(compareResult === 0){
            foundIndex = midIndex;
            break;
        }
        // if the middle val was too large, decrease right
        else if(compareResult < 0){
            right = midIndex-1;
        }
        // if the middle val was too small, increase left
        else{
            left = midIndex + 1;
        }
    }
    if(foundIndex === -1){
        return [-1];
    }
    // add the target's index to the foundIndexes
    foundIndexes.push(foundIndex);

    // traverse to the left of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking left until the next element is not the target
    let i: number = foundIndex -1;
    while(i>=0 && compareFn(target,data[i]) ===0){
        foundIndexes.push(i);
        i--;
    }

    // traverse to the right of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking right until the next element is not the target
    let j: number = foundIndex +1;
    while(j<=data.length && compareFn(target,data[j]) === 0){
        foundIndexes.push(j);
        j++;
    }
    let endTime = performance.now();
    let newPair : Pair = new Pair("Binary Search", endTime-startTime)
    performanceTime.enqueue(newPair);
    return foundIndexes;
} 

function binarySearchBetween(min: number, max: number, data: any[], compareFn: any, convert?: any){
    const startTime = performance.now();
    // left bound
    let left: number = 0;
    // right bound
    let right: number = data.length-1;
    // stores indexes of targets found
    let foundIndexes: number[] = []
    // stores current index of target
    let foundIndex: number = -1;

    // check if the compareFn inputted is a function  
    if(typeof compareFn !== 'function'){
        return [-1];
    }
    if(typeof convert !== 'function'){
        convert = nothing;
    }
    while(left <= right){
        // find middle index
        let midIndex: number = Math.floor((left+right)/2);
        // store the return value of the compare function
        // O(1)
        // if type is time, convert to seconds
        let compareResult: number = compareFn(convert(data[midIndex]), min, max);
        // if the target was found at the midIndex, set the foundIndex to midIndex
        if(compareResult === 0){
            foundIndex = midIndex;
            break;
        }
        // if the middle val was too large, decrease right
        else if(compareResult < 0){
            right = midIndex-1;
        }
        // if the middle val was too small, increase left
        else{
            left = midIndex + 1;
        }
    }
    if(foundIndex === -1){
        return [-1];
    }
    // add the target's index to the foundIndexes
    foundIndexes.push(foundIndex);

    // traverse to the left of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking left until the next element is not the target
    let i: number = foundIndex -1;
    while(i>=0 && compareFn(convert(data[i]), min, max) ===0){
        foundIndexes.push(i);
        i--;
    }

    // traverse to the right of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking right until the next element is not the target
    let j: number = foundIndex +1;
    while(j<data.length && compareFn(convert(data[j]), min, max) === 0){
        foundIndexes.push(j);
        j++;
    }
    const endTime = performance.now();
    console.log(`Binary search runtime: ${endTime-startTime} ms`);
    return foundIndexes;
}


// returns indexes of sorted array
// O(nlogn) time 
// mergesort function --> O(logn) because it divides the array by 2 each time
// merge function --> O(n) because it at most compares n times, 1 for each value
// since each mergesort function calls merge it is mutipled giving O(nlogn)
    // returns indexes of sorted array
function sort<T>(arr : T[], compare : any) : number[]{
    let startTime = performance.now();
    let sortSpace : PairNode<T>[] = new Array(arr.length);

    // make deep copy, we dont want to edit the original
    // O(n) time
    let deepcopy : PairNode<T>[] = new Array(arr.length)
    for(let i=0; i<arr.length; i++){
        let newPair : PairNode<T> = new PairNode<T>(arr[i], i);
        deepcopy[i] = newPair;
    }

    mergeSort<T>(deepcopy, 0, arr.length-1, sortSpace, compare);

    // convert deep copy to array of indexes
    let indexes : Array<number> = new Array(arr.length);
    for(let i=0; i<indexes.length; i++)[
        indexes[i] = deepcopy[i].index
    ]

    let endTime = performance.now();
    let newPair : Pair = new Pair("Merge Sort", endTime-startTime)
    performanceTime.enqueue(newPair);

    return indexes;
}


function mergeSort<T>(arr : PairNode<T>[], leftStart : number, rightEnd : number, sortSpace : PairNode<T>[], compareFn : any) : PairNode<T>[]{

// BASE CASE
// when the array is only 1 item (or no items) it is already sorted
if (rightEnd <= leftStart){
    return arr;
}

// RECURSIVE CASE: array length is 2 or more -- keep dividing
// in half and sorting those halves

// get the middle index of the array to do the splitting
let midIndex : number = Math.floor((leftStart + rightEnd)/ 2);

// recursively sort the left and right sides halves back into the original array
arr = mergeSort<T>(arr, leftStart, midIndex, sortSpace, compareFn);
arr = mergeSort<T>(arr, midIndex + 1, rightEnd, sortSpace, compareFn);

// merge the 2 sorted halves together to sort the entire range from leftStart
// to rightEnd
arr = merge<T>(arr, leftStart, rightEnd, sortSpace, compareFn);

return arr;
}

function merge<T>(arr: PairNode<T>[], leftStart : number, rightEnd : number, sortSpace : PairNode<T>[], compareFn : any) : PairNode<T>[]{
    // create a bigger array to hold all of the sorted elements

    // get the middle index of the array to do the splitting
    let midIndex : number = Math.floor((leftStart + rightEnd)/ 2);

    let leftIndex : number = leftStart;
    let rightIndex : number = midIndex + 1;

    // each loop, put an element from the leftSorted or rightSorted arrays into the
    // sort the elements into the AUXILIARY storage array - 
    // O(n) time complexity
    for ( let i = leftIndex; i <= rightEnd; i++){
        // if there are no more elements remaining in the leftSorted array
        //  then dump all of the rightSorted elements into sorted
        if (leftIndex > midIndex){
            sortSpace[i] = arr[rightIndex];
            rightIndex++;
        }

        // if there are no more elements remaining in the rightSorted array
        //  then dump all of the leftSorted elements into sorted
        else if (rightIndex > rightEnd){
            sortSpace[i] = arr[leftIndex];
            leftIndex++;
        }

        // if the element in rightSorted should go into sorted
        else if (compareFn(arr[rightIndex].val, arr[leftIndex].val) === 1){
            sortSpace[i] = arr[rightIndex];
            rightIndex++;
        }

        // if the element in the leftSorted should go into sorted
        else {
            sortSpace[i] = arr[leftIndex];
            leftIndex++;
        }
    }


    // copy sorted elements from the auxilliary array back to arr - 
    // O(n) time complexity
    for (let i = leftStart; i <= rightEnd; i++){
        arr[i] = sortSpace[i];
    }

    // 2 O(n) time complexity loops run in this function, which is still O(n)

    return arr;
}

// find the distance between two points
// takes in intial position, target (amount of pokemon), array of the pokemon (binarysearched down)
// takes the position and finds the shortest path until target is hit
function aStar(start : Point, target : number, data : number[]){
    let q : PriorityQueue<Point> = new PriorityQueue<Point>(ascending);
    q.enqueue(start); // queue the starting node
    let prev : Array<number> = new Array(data.length);
    let gScore : Array<number> = new Array(data.length);
    let fScore : Array<number> = new Array(data.length);

    

}

// returns indexes of data with (lat, lng) between two inputted points
// O(n), since it loops through all inputted data points once
// 6 millisecond average runtime using performance.now()
function filterCoords(latitudes: number[], unsortedLongitudes: number[], lat1: number, lng1: number, lat2: number, lng2: number, latUnsortedIndexes: any[]): number[]{
    let startTime = performance.now();
    // store indexes of data that are within the two inputted points
    // smallest latitude value of the two points
    let minLat: number = Math.min(lat1,lat2);
    // biggest latitude value of the two points
    let maxLat: number = Math.max(lat1,lat2);
    // smallest longitude value of the two points
    let minLng: number = Math.min(lng1,lng2);
    // biggest longitude value of the two points
    let maxLng: number = Math.max(lng1, lng2);
    // returns indexes of sorted lat
    // find indexes that latitude is within the max and min lat
    let latIndexes : number[] = binarySearchBetween(minLat, maxLat, latitudes, compareRange);
    // return -1 if no indexes are found
    if(latIndexes[0] === -1){
        return [-1];
    }
    let validIndexes: number[] = [];
    for(let i=0;i<latIndexes.length;i++){
        // find the index of the sorted array index value, in the unsorted array
        let unsortedLatIndex = latUnsortedIndexes[latIndexes[i]];
        // find the corresponding longitude value
        let longitude: number = unsortedLongitudes[unsortedLatIndex];
        // if the longitude value is between the max and min, add the index to the array
        if(longitude >= minLng && longitude <= maxLng){
            validIndexes.push(unsortedLatIndex);
        }
    }
    let endTime = performance.now();
    let newPair : Pair = new Pair("Filter Coords", endTime-startTime)
    performanceTime.enqueue(newPair);
    return validIndexes;
}

// Returns indexes of pokemon that were caught within 2 inputted times
// O(log n), as it calls the binarySearchBetween function which is log n, and doesn't do any seperate loops itself
function filterTimes(times: string[], timeA: string, timeB: string): number[]{
    const startTime = performance.now();
    // store indexes of data within the 2 times
    let validIndexes: number[] = [];
    // convert string time Ex: "1:40:10" to seconds
    // O(1)
    let aVal: number = toSeconds(timeA);
    // convert string time Ex: "1:40:10" to seconds
    // O(1)
    let bVal: number = toSeconds(timeB);
    // find the minimum time
    let minTime: number = Math.min(aVal, bVal);
    // find the max time
    let maxTime: number = Math.max(aVal, bVal);
    // O(log n)
    validIndexes = binarySearchBetween(minTime, maxTime, times, compareRange, toSeconds)
    const endTime = performance.now();
    let newPair : Pair = new Pair("Filter Time", endTime-startTime)
    performanceTime.enqueue(newPair);
    return validIndexes;
}

// Returns indexes of pokemon that are an inputted type
// O(n), since it looops through all given times once
function filterType(pokemonIDs: number[], type: string){
    const startTime = performance.now();
    // store indexes
    let validIndexes: number[] = [];
    // loop through the inputted pokemon
    for(let i=0;i<pokemonIDs.length;i++){
        if(pokedex.types[pokemonIDs[i]-1].includes(type)){
            validIndexes.push(i);
        }
    }
    const endTime = performance.now();
    console.log(`Filter time runtime: ${endTime-startTime}`);
    return validIndexes;
}

function filterName(name: string, pokemon: any[]){
    return binarySearch(name, pokemon, compareAlphaAscendingSearch);
}