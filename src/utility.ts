// utility functions

// converts indexes to a data set based on order
// so if [1, 3, 2, 4]
// it will return the data value of [data[1], data[3], data[2], data[4]]
// O(n), as it loops through all inputted indexes once
function indexToData(indexes : number[], arr : any[]) : Array<any> {
    let startTime = performance.now();
    let result : Array<any> = new Array(indexes.length);
    for(let i=0; i<indexes.length; i++){
        result[i] = arr[indexes[i]];
    }
    let endTime = performance.now();
    let time : Triplet = new Triplet("Index to Data", endTime-startTime, true)
    performanceTime.enqueue(time);
    return result;
}

// returns number of decimal places of a given number
// takes number as a string as input Ex: "1.23"
// O(1), as there are no loops, only simple operations
function numDecimals(input: string): number{
    // If no period, there are no decimals
    if(!input.includes('.')) return 0;
    // Split the string into two parts, from before and after the decimal
    // Access the part after the decimal using [1]
    // Return the number of digits after the decimal, using .length
    return input.split('.')[1].length;  
}

// rounds an inputted number to an inputted number of decimal places
// returns as number
function roundToDecimal(input: number, numDecimals: number): number{
    return Number(input.toFixed(numDecimals));
}

// returns an array of the specific value of the pokemon using the pokemon id
// if inputted pokedex.names_english --> will return array of names_englsh
// O(n) time
function findPokedex(arr : any[]): string[]{
    let startTime = performance.now();
    let newArr : string[] = new Array(data.pokemonId.length)
    for(let i=0;i<data.pokemonId.length;i++){
        // id is 1 above 0
        newArr[i] = arr[data.pokemonId[i]-1];
    }
    let endTime = performance.now();
    let time : Triplet = new Triplet("Find Pokedex Array", endTime-startTime, true)
    performanceTime.enqueue(time);
    return newArr;
}   

// Converts time to seconds
// Takes in time ex.("11:23:40 AM") and converts it to seconds after midnight
// returns seconds as a number
// O(1), since there are no loops, just simple operations
function toSeconds(time: string): number{
    // Split "11:23:40 AM" to ["11:23:40", "AM"]
    let [timePart, modifierPart] = time.split(' ');
    // Split "11:23:40" to [11, 23, 40]
    let [hours, minutes, seconds] = timePart.split(':').map(Number);
    // Add 12 hours if the time is PM
    if(modifierPart === "PM" && hours !== 12){
        hours+=12
    }
    // Make hours 0, if it is 12:xx:xx AM
    if(modifierPart === "AM" && hours === 12){
        hours = 0;
    }
    return (hours*3600 + minutes*60 + seconds);
}

// returns indexes of searched value
// needs changing because ascedning and descending doesnt work for string
function search<T>(arr : T[], val : string | number) : number[]{
    let startTime = performance.now();
    // check whether string or num and change function based off it
    let descension = (typeof val === 'string') ? compareAlphaDescending : descending;
    let indexes : number[] = binarySearch(val, arr, descension).getData();
    let endTime = performance.now();
    let time : Triplet = new Triplet("Searching", endTime-startTime, true)
    performanceTime.enqueue(time);
    return indexes; // indexes of sorted data
}  

// returns a sorted ascending distance from given node 
// arr --> indexes of originals
// starting lat & lon
// O(n) to compute distance + Sorting O(nlogn)
function sortDistance(arr : number[], lat : number, lon : number) : Pair{
    let startTime = performance.now();
    let distance : number[] = new Array(arr.length);
    for(let i=0; i<distance.length; i++){
        let index : number = arr[i];
        // get distances from start node
        distance[i] = haversine(lat, lon, data.latitude[index], data.longitude[index]);
    }
    // O(nlogn) sort
    let distanceIndexes : number[] = sort<number>(distance, ascending);
    // O(n) conversion
    distance = indexToData(distanceIndexes, distance);
    // convert back to original indexes
    distanceIndexes = indexConverter(distanceIndexes, arr);    

    let endTime = performance.now();
    let time : Triplet = new Triplet("Sorting Distance From Point", endTime-startTime, true)
    performanceTime.enqueue(time);
    return new Pair(distance, distanceIndexes);
}

// reconstruct path
// loop backward since prev has previous nodes
// returns indexes of the path
function reconstructPath(prev : number[], cost : number[], endIndex : number) : List<Pair>{
    let path : List<Pair> = new List<Pair>;
    let cur : number = endIndex;
    while (cur !== -1) {
        let newPair : Pair = new Pair(cur, cost[cur]);
        path.push(newPair);
        cur = prev[cur];
    }
    return path;
}

// since the search function returns the sorted indexes of the sorted array
// we must be able to convert these indexes to their original form otherwise they will only ever work on the sorted data type
// must input the original data
// just index the original sort indexes using current indexes
// O(n)
function indexConverter(indexes : number[], sortedIndex : number[]) : number[]{
    let newArray : Array<number> = new Array(indexes.length);
    for(let i=0; i<indexes.length; i++){
        newArray[i] = sortedIndex[indexes[i]];
    }
    return newArray;
}

// returns the given array in ascending form
// returns in indexed form
// O(nlogn)
function sortDescending<T>(arr : T[]) : number[]{
    let startTime = performance.now();

    let decension = (typeof arr[0] === 'string') ? compareAlphaDescending : descending;
    let sortedIndexes : number[] = sort(arr, decension);

    let endTime = performance.now();
    let time : Triplet = new Triplet("Sort Descending", endTime-startTime, true)
    performanceTime.enqueue(time);

    return sortedIndexes
}   

// given two points longitude and latitude
// since the earth is a sphere we find the shortest length between the two points
// this will be the edge for the graph
function haversine(lat1 : number, lon1 : number, lat2 : number, lon2 : number) : number{
    // quick function to convert to radians
    const radiansConvert = (degrees : number) => degrees * (Math.PI/180);
    const R : number = 6371;

    let dLat : number = radiansConvert(lat2 - lat1);
    let dLon : number = radiansConvert(lon2 - lon1);

    let radLat1 : number = radiansConvert(lat1)
    let radLat2 : number = radiansConvert(lat2);

    // Haversine formula
    let a : number = Math.sin(dLat / 2)**2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2)**2
    let c  : number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance : number = R * c

    return distance;

}

function sortedtoUnsortedIndexes(sortedIndexes: number[]){
    let unsortedIndexes: List<number> = new List<number>;
    for(let i=0;i<sortedIndexes.length;i++){
        unsortedIndexes.push(sortedData.names_english.val[sortedIndexes[i]]);
    }
    return unsortedIndexes.getData();
}