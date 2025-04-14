// utility functions

// converts indexes to a data set based on order
// so if [1, 3, 2, 4]
// it will return the data value of [data[1], data[3], data[2], data[4]]
function indexToData(indexes : number[], arr : any[]) : Array<any> {
    let result : Array<any> = new Array(indexes.length);
    for(let i=0; i<indexes.length; i++){
        result[i] = arr[indexes[i]];
    }
    return result;
}

// returns indexes of searched value
// needs changing because ascedning and descending doesnt work for string
function search<T>(arr : T[], val : string | number) : number[]{
    // check whether string or num and change function based off it
    let ascension = (typeof val === 'string') ? compareAlpha : ascending;
    let descension = (typeof val === 'string') ? compareAlpha : descending;
    let sortedArray : number[] = sortAscending(arr)
    let indexes : number[] = binarySearch(val, sortedArray, descension);
    return indexes;
}   

// returns the given array in ascending form
function sortAscending<T>(arr : T[]){
    let ascension = (typeof arr[0] === 'string') ? compareAlpha : ascending;
    let mergeSorter : mergeSort<T> = new mergeSort(ascension);
    let sortedIndexes : number[] = mergeSorter.sort(arr);
    return sortedIndexes
}   

// given two points longitude and latitude
// since the earth is a sphere we find the shortest length between the two points
// this will be the edge for the graph
function haversine(lat1 : number, lon1 : number, lat2 : number, lon2 : number) : number{
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
