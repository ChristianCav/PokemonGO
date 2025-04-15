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

function binarySearchBetween(min: number, max: number, data: any[], compareFn: any, type?: string) : number[]{
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
    while(left <= right){
        // find middle index
        let midIndex: number = Math.floor((left+right)/2);
        // store the return value of the compare function
        // O(1)
        let compareResult : number = compareFn(data[midIndex], min, max);
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
    while(i>=0 && compareFn(data[i], min, max) ===0){
        foundIndexes.push(i);
        i--;
    }

    // traverse to the right of the found index and check if element is also the target 
    // if it is add it to foundIndexes, and keep looking right until the next element is not the target
    let j: number = foundIndex +1;
    while(j<data.length && compareFn(data[j], min, max) === 0){
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

// bonus 3
// find the distance between two points
// takes the position and finds the shortest path until target is hit
// start --> start point
// target --> number of pokemon to travel
// arr --> array of indexes representing the same pokemon
// returns path containing the index, and cost
// asymtotic worst case O(n^2logn)
function bfs(start : Point, target : number, indexes : number[]) : Pair[]{
    // variable to check if the pokemon we got is actually the same
    let pokemon : string = sortedData.names_english.key[indexes[0]];
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
    // O(n + e) e the number of edges
    while(!q.isEmpty()){
        let cur : Point = q.dequeue() as Point;
        console.log(cur)
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
            if(pokemon === pokedex.names_english[data.pokemonId[nxt]] && !vis[nxt]){
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
            // O(nlogn)
            let distance : Pair = sortDistance(indexes, cur.lat, cur.lon);
            // loop through until they meet conditions
            // O(n)
            for(let i=0; i<distance.key.length; i++){
                let nxt : number = distance.val[i];
                // should be guarenteed same pokemon
                if(pokemon === sortedData.names_english.key[nxt] && !vis[nxt]){
                    vis[nxt] = true;
                    dis[nxt] = dis[cur.index] + distance.key[i];
                    next[nxt] = next[cur.index] + 1;
                    prev[nxt] = cur.index;
                    // if we havent reached enough push next one
                    if(next[nxt] <= target) q.enqueue(new Point(data.longitude[nxt], data.latitude[nxt], nxt, dis[nxt]));
                    break; // only 1 max because we don't want to make it extremely slow
                }
            }
        }
    }
    // return the original path
    let path : Pair[] = reconstructPath(prev, dis, lowest.key)
    return path;
}

// bonus 5
// prim algorithm with a second check
// check if node visited, and if the pokemon is already added
function dijkstras(start: Point) {

}
/*
// bonus 5
// /*
function prim(start : Point, indexes : number[]): number {
    // use length of original arrays so i can just index them with indexes
    let vis : boolean[] = new Array(data.pokemonId.length).fill(false);
    let dis : number[] = new Array(data.pokemonId.length).fill(Infinity);
    let hie : number[] = createDis(indexes, start.lat, start.lon); // create a hieuristic to the starting node
    let hieuristic : number[] = new Array(data.pokemonId.length).fill(Infinity);
    // move to the parrallel array
    for(let i=0; i<indexes.length; i++){
        hieuristic[indexes[i]] = hie[i];
    }
    // sort the indexes so we can binary search them
    indexes = indexToData(sort(indexes, ascending), indexes);
    // hieurisitic + distance will be the comparision
    // this ensures that the minimum costs are closer to the starting poisiton
    // of course this doesn't guarentee closest but will help
    let total : number[] = new Array(data.pokemonId.length).fill(Infinity);
    let unique : boolean[] = new Array(150).fill(false);
    let prev : number[] = new Array(data.pokemonId.length).fill(-1); // holds prev node
    dis[start.index] = 0;
    total[start.index] = 0;
    unique[data.pokemonId[start.index]] = true;

    let q : PriorityQueue<Pair> = new PriorityQueue(mstCompare);
    q.enqueue(new Pair(start.index, 0));

    while(!q.isEmpty()){
        let cur : Pair = q.dequeue() as Pair;
        if(vis[cur.key] && unique[data.pokemonId[cur.key]]) continue; // skip dupes
        vis[cur.key] = true;
        unique[data.pokemonId[cur.key]] = true;
        // loop through graph
        for(let i=0; i<graph[cur.key].length; i++){
            let nxt : Item = graph[cur.key][i];
            console.log(nxt)
            // make sure the node taken is in the range of indexes so we can ensure it is close to the start    
            if(search(indexes, nxt.id)[0] === -1) continue; // guareenteed to only be one because indexes are unique
            if(!vis[nxt.id] && !unique[data.pokemonId[nxt.id]] && nxt.distance + hieuristic[nxt.id] < total[nxt.id]){
                dis[nxt.id] = nxt.distance;
                total[nxt.id] = nxt.distance + hieuristic[nxt.id];
                prev[nxt.id] = cur.key;
                q.enqueue(new Pair(nxt.id, total[nxt.id]));
            }
        }
        // add a 6th unique pokemon otherwise the pokemon will just stick in one place because if 5 are bunched up they will never leave
    }

    let totalCost : number = 0;
    for(let i=0; i<total.length; i++){
        if(total[i] !== Infinity){
            totalCost += total[i];
        }
    }
    console.log(vis)
    console.log(unique)

    return totalCost;
}
*/


// returns indexes of data with (lat, lng) between two inputted points
// O(n), since it loops through all inputted data points once
// 6 millisecond average runtime using performance.now()
function filterCoords(latitudes: number[], longitudes: number[], lat1: number, lng1: number, lat2: number, lng2: number): number[]{
    let startTime = performance.now();
    // store indexes of data that are within the two inputted points
    let validIndexes: number[] = []
    // smallest latitude value of the two points
    let minLat: number = Math.min(lat1,lat2);
    // biggest latitude value of the two points
    let maxLat: number = Math.max(lat1,lat2);
    // smallest longitude value of the two points
    let minLng: number = Math.min(lng1,lng2);
    // biggest longitude value of the two points
    let maxLng: number = Math.max(lng1, lng2);

    // loop through all the data
    for(let i=0;i<latitudes.length;i++){
        let lat: number = latitudes[i];
        let lng: number = longitudes[i];

        // check if lat is greater than the minLat and less than the maxLat
        // and check if lng is greater than the minLng and less than the maxLng
        // if it is then add it to the validIndexes
        if(lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng){
            validIndexes.push(i)
        }
    }
    let endTime = performance.now();
    let newPair : Pair = new Pair("Filter Coords", endTime-startTime)
    performanceTime.enqueue(newPair);
    return validIndexes;
}

// Returns indexes of pokemon that were caught within 2 inputted times
// O(n), since it looops through all given times once
//
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
    validIndexes = binarySearchBetween(minTime, maxTime, times, compareTimes)
    
    const endTime = performance.now();
    let newPair : Pair = new Pair("Filter Time", endTime-startTime)
    performanceTime.enqueue(newPair);
    return validIndexes;
}

// Returns indexes of pokemon that are an inputted type
// O(n), since it looops through all given times once
function filterType(pokemon: string[], type: string){

    const startTime = performance.now();
    // store indexes
    let validIndexes: number[] = [];
    // loop through the inputted pokemon
    for(let i=0;i<pokemon.length;i++){
        if(pokedex.types[i].includes(type)){
            validIndexes.push(i);
        }
    }
    const endTime = performance.now();
    console.log(`Filter time runtime: ${endTime-startTime}`);
    return validIndexes;
}

// returns indexes of pokemon within the given range
// O(n) + O(nlogn) for sorting + O(logn) searching
// range --> haversine distance
// coords
function filterDistance(range : number, lat : number, lon : number) : Array<number>{
    let distances : Pair = sortDistance(sortedData.names_english.val, lat, lon);
    let filterDistance : number[] = binarySearchBetween(0, range, distances.key, compareNum);

    let newFilter = indexConverter(filterDistance, distances.val);

    return newFilter;
}