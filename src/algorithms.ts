// contains algorithms

// finds ALL occurences of inputted target
// returns array of indexes
// O(log n + k), k is the number of occurences of target
// since, you halve the search area every time, is it log2n,
// and then + O(k), since it loops k more times, to find all k other occurences of the target
// Takes 2-6 ms to run on 99000 data, using performance.now()
function binarySearchSingle(target: number | string, data: any[], compareFn: any, rightIndex?: number) : number{
    let startTime = performance.now();
    // left bound
    let left: number = 0;
    // right bound
    let right: number;
    if(rightIndex){
        right = rightIndex-1
    }
    else{
        right = data.length-1;
    }

    // stores current index of target
    let foundIndex: number = -1;

    // check if the compareFn inputted is a function  
    if(typeof compareFn !== 'function'){
        return -1;
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
        return -1;
    }
    let endTime = performance.now();
    let time : Triplet = new Triplet("Binary Search Single", endTime-startTime, false)
    performanceTime.enqueue(time);
    return foundIndex
} 

// O(n) time if all elements are the same,
// since we have searched for an index in a sorted array that is correct
// the elements beside it should all be the same attributes so loop both sides until we get them all
function binarySearchFill(found : number, arr : any[], compareFn : any) : List<number>{
    let startTime = performance.now();
    let indexes : List<number> = new List<number>();
    if(typeof compareFn !== 'function'){
        indexes.push(-1);
        return indexes;
    }
    // traverse to the left of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking left until the next element is not the target
    let i: number = found -1;
    while(i>=0 && compareFn(arr[found],arr[i]) ===0){
        indexes.push(i);
        i--;
    }

    // traverse to the right of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking right until the next element is not the target
    let j: number = found +1;
    while(j<=arr.length && compareFn(arr[found],arr[j]) === 0){
        indexes.push(j);
        j++;
    }
    let endTime = performance.now();
    let time : Triplet = new Triplet("Binary Search Fill", endTime-startTime, false)
    performanceTime.enqueue(time);
    console.log(indexes);
    return indexes;
}

function binarySearch(target: number | string, sortedArr : any[], compareFn : any, rightIndex? : number) : List<number>{

    let startTime = performance.now();

    let indexFound : number = binarySearchSingle(target, sortedArr, compareFn, rightIndex);
    let foundIndexes : List<number> = new List<number>();
    // check
    if(indexFound === -1){
        foundIndexes.push(-1);
    }
    else {
        foundIndexes = binarySearchFill(indexFound, sortedArr, compareFn);
    }

    let endTime = performance.now();
    let time : Triplet = new Triplet("Binary Search", endTime-startTime, false)
    performanceTime.enqueue(time);

    return foundIndexes;
}

function binarySearchBetween(min: number, max: number, sorted: any[], compareFn: any) : List<number>{
    let index : number = binarySearchBetweenSingle(min, max, sorted, compareFn);
    return binarySearchFillBetween(index, sorted, min, max, compareFn);
}

// O(n) time if all elements are the same,
// since we have searched for an index in a sorted array that is correct
// the elements beside it should all be the same attributes so loop both sides until we get them all
function binarySearchFillBetween(found : number, arr : any[], min : number, max : number, compareFn : any) : List<number>{
    let startTime = performance.now();
    let indexes : List<number> = new List<number>();
    if(typeof compareFn !== 'function'){
        indexes.push(-1);
        return indexes;
    }
    // traverse to the left of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking left until the next element is not the target
    let i: number = found -1;
    while(i>=0 && compareFn(arr[i], min, max) === 0){
        indexes.push(i);
        i--;
    }

    // traverse to the right of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking right until the next element is not the target
    let j: number = found +1;
    while(j<=arr.length && compareFn(arr[j], min, max) === 0){
        indexes.push(j);
        j++;
    }
    let endTime = performance.now();
    let time : Triplet = new Triplet("Binary Search Fill Between", endTime-startTime, false)
    performanceTime.enqueue(time);
    console.log(indexes);
    return indexes;
}

function binarySearchBetweenSingle(min: number, max: number, data: any[], compareFn: any): number{
    const startTime = performance.now();
    // left bound
    let left: number = 0;
    // right bound
    let right: number = data.length-1;
    // stores current index of target
    let foundIndex: number = -1;
    // check if the compareFn inputted is a function  
    if(typeof compareFn !== 'function'){
        return -1;
    }
    while(left <= right){
        // find middle index
        let midIndex: number = Math.floor((left+right)/2);
        // store the return value of the compare function
        // O(1)
        // if type is time, convert to seconds
        let compareResult: number = compareFn(data[midIndex], min, max);
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
        return -1;
    }

    let endTime = performance.now();
    let time : Triplet = new Triplet("Binary Search Between Single", endTime-startTime, false)
    performanceTime.enqueue(time);

    return foundIndex;
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
    let time : Triplet = new Triplet("Merge Sort", endTime-startTime, false)
    performanceTime.enqueue(time);
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
// returns the closest same pokemon as the pokemon given
// uses haversine formula with the given pokemon as the comparision
// and sorts it by it
// therefore the closest pokemon is the second one in the return
function grindingCandies(
    mon: string,
    lat: number,
    lon: number,
    numTargets: number
  ): List<Pair> {
    // search for all the indexes of the mon
    let indexArray: number[] = search<string>(sortedData.names_english.key, mon);
    indexArray = indexConverter(indexArray, sortedData.names_english.val)
    // find shortest same pokemon (because we could be starting not on one)
    let shortestDistance: Pair = sortDistance(indexArray, lat, lon);
    let closest: number = shortestDistance.val[0]; // index of closest pokemon, (of sorted)
    // check if its same
    if(data.latitude[closest] === lat && data.longitude[closest] === lon){
        closest = shortestDistance.val[1];
    }

    let startPokemon: Point = new Point(
      data.longitude[closest],
      data.latitude[closest],
      closest,
      0
    );
    // returns indexes as sorted name english, and distance
    let path: List<Pair> = bfs(startPokemon, numTargets, indexArray);
    return path;
  }

// bonus 3
// find the distance between two points
// takes the position and finds the shortest path until target is hit
// start --> start point
// target --> number of pokemon to travel
// arr --> array of indexes representing the same pokemon
// returns path containing the index, and cost
function bfs(start : Point, target : number, indexes : number[]) : List<Pair>{
    let startTime = performance.now();
    // variable to check if the pokemon we got is actually the same
    let pokemon : string = data2.names_english[indexes[0]];
    let q : Queue<Point> = new Queue();
    // both use data.pokemonId.length because easier to access using indexes
    let vis : Array<boolean> = new Array(data.pokemonId.length).fill(false); // visited array
    let dis : Array<number> = new Array(data.pokemonId.length).fill(-1); // distance array
    let prev : Array<number> = new Array(data.pokemonId.length).fill(-1); // previous node array
    let next : Array<number> = new Array(data.pokemonId.length).fill(-1); // used to check if we have reached target if so don't add more
    // lowest cost target
    let lowest : Pair = new Pair(-1, -1);
    // initial node
    q.enqueue(start);
    vis[start.index] = true;
    dis[start.index] = 0;
    next[start.index] = 1;
    while(!q.isEmpty()){
        let cur : Point = q.dequeue() as Point;
        console.log(next[cur.index])
        if(next[cur.index] === target && lowest.key === -1 || dis[cur.index] < lowest.val){
            lowest.val = dis[cur.index];
            lowest.key = cur.index;
        }
        // access adjacency list 
        // O(n) time to loop
        let foundOne : boolean = false;
        for(let i=0; i<graph[cur.index].length; i++){
            let nxt : number = graph[cur.index][i].id;
            // check if its same pokemon and its not visited
            if(pokemon === data2.names_english[i] && !vis[nxt]){
                foundOne = true;
                vis[nxt] = true;
                dis[nxt] = dis[cur.index] + graph[cur.index][i].distance;
                next[nxt] = next[cur.index] + 1;
                prev[nxt] = cur.index;
                // if we havent reached enough push next one
                if(next[nxt] <= target) q.enqueue(new Point(data.longitude[nxt], data.latitude[nxt], nxt, dis[nxt]));
            }
        }
        // if we are unable to find at least one
        // means that the node on the graph doesnt have a close same pokemon
        // manually search for one
        if(!foundOne){
            let distance : Pair = sortDistance(indexes, cur.lat, cur.lon);
            // loop through until they meet conditions
            // O(n)
            let amountofadds : number = 0;
            for(let i=0; i<distance.key.length; i++){
                let nxt : number = distance.val[i];
                // should be guarenteed same pokemon
                if(pokemon === data2.names_english[nxt] && !vis[nxt]){
                    vis[nxt] = true;
                    dis[nxt] = dis[cur.index] + distance.key[i];
                    next[nxt] = next[cur.index] + 1;
                    prev[nxt] = cur.index;
                    amountofadds++;
                    // if we havent reached enough push next one
                    if(next[nxt] <= target) q.enqueue(new Point(data.longitude[nxt], data.latitude[nxt], nxt, dis[nxt]));
                    if(amountofadds === 2) break // only "k" max because we don't want to make it extremely slow
                    // doenst work 100% because there can be cases where a overall path is greater
                }
            }
        }
    }
    // return the original path
    let path : List<Pair> = reconstructPath(prev, dis, lowest.key)
    let endTime = performance.now();
    let time : Triplet = new Triplet("BFS Modified", endTime-startTime, false)
    performanceTime.enqueue(time);
    console.log(path)
    return path;
    
}

// Returns indexes of pokemon that were caught within 2 inputted times
// O(log n), as it calls the binarySearchBetween function which is log n, and doesn't do any seperate loops itself
function filterTimes(times: string[], timeA: string, timeB: string): List<number>{
    const startTime = performance.now();
    // store indexes of data within the 2 times
    let validIndexes: List<number> = new List<number>;
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
    validIndexes = binarySearchBetween(minTime, maxTime, times, compareTimes);
    const endTime = performance.now();
    let time : Triplet = new Triplet("Filter Time", endTime-startTime, false)
    performanceTime.enqueue(time);
    return validIndexes
}

// Returns indexes of pokemon that are an inputted type
// O(n), since it looops through all given times once
function filterType(types: string[][], type: string): List<number>{
    const startTime = performance.now();
    // store indexes
    let validIndexes: List<number> = new List<number>;
    // loop through the inputted pokemon
    for(let i=0;i<types.length;i++){
        if(checkType(types[i], type) === 1){
            validIndexes.push(i);
        }
    }
    const endTime = performance.now();
    let time : Triplet = new Triplet("Filter Type", endTime-startTime, false)
    performanceTime.enqueue(time);
    return validIndexes;
}

// filter pokemon by name
// works with full name, or just starting letters
// returns indexes in unsorted names_english array
// O(log n + k), where k is the number of occurences, since it uses binarySearch
function filterName(name: string, pokemon: any[]): number[]{
    return binarySearch(name, pokemon, compareAlphaAscendingSearch).getData();
}

// returns indexes of data with (lat, lng) between two inputted points
// O(n), since it loops through all inputted data points once
function filterCoords(latitudes: number[], longitudes: number[], lat1: number, lng1: number, lat2: number, lng2: number): List<number>{
    let startTime = performance.now();
    let validIndexes: List<number> = new List<number>;
    // if lat is between max and min lat, and if lng is between max and min lng, add the index
    for(let i=0;i<latitudes.length;i++){
        if(compareBetweenArea(lat1, lat2, lng1, lng2, latitudes[i], longitudes[i]) === 0){
            validIndexes.push(i);
        }
    }
    let endTime = performance.now();
    let time : Triplet = new Triplet("Filter Coords", endTime-startTime, false)
    performanceTime.enqueue(time);
    return validIndexes;
}
// put -1 into input if nothing
// put "" into input if nothing
function filterAll(name : string, type : string, time1 : string, time2 : string, lat1 : number, lon1 : number, lat2 : number, lon2 : number) : List<number>{
    let startTime = performance.now();

    // create a sub data set to hold the guareented at least one matching attribute
    let foundIndexes : List<number> | null = null;
    let sortedIndexes : Array<number> | null = null;
    
    let returnIndexes : List<number> = new List<number>();

    // if it exists then make the compare that
    // all ones that give sorted indexes as null are O(n) time to sort
    // others are O(logn)
    if(name !== "") {
        foundIndexes = binarySearch(name, sortedData.names_english.key, compareAlphaAscendingSearch)
        sortedIndexes = sortedData.names_english.val;
    }
    else if(type !== ""){
        foundIndexes = filterType(data2.types, type);
        sortedIndexes = null;
    }
    else if(time1 !== ""){
        foundIndexes = filterTimes(sortedData.localTime.key, time1, time2);
        sortedIndexes = sortedData.localTime.val;
    }
    else if(lat1 !== -1000){
        // already in original form
        foundIndexes = filterCoords(data.latitude, data.longitude, lat1, lon1, lat2, lon2);
        sortedIndexes = null;
    }
    // guarentee assignment
    else{
        foundIndexes = null;
        sortedIndexes = null;
    }

    console.log(foundIndexes)

    if(foundIndexes !== null){
    // traverse found indexes to match them
    // O(n) worst case but smaller since the found indexes will guarentee one match 
    // O(k) k being a constant that is based on the size of the filtered down array
        for(let i=0; i<foundIndexes!.size(); i++){
            let target : number = foundIndexes.get(i) as number;
            if(sortedIndexes !== null) target = sortedIndexes[target];
            if(compareAll(target, name, type, time1, time2, lat1, lon1, lat2 , lon2) === 1){
                returnIndexes.push(target); // indexes the sorted indexes
            }
        }
    }

    let endTime = performance.now();
    let time : Triplet = new Triplet("Filter All", endTime-startTime, false)
    performanceTime.enqueue(time);
    return returnIndexes;
}