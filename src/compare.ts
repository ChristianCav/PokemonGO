// contains comparisons


// compare function for sorting alphabetically from a-z 
// returns 1 if target comes before mid, -1 if target comes after mid, 0 if mid and target are the same
function compareAlphaAscending(target: string, mid:string): number{
    const len = Math.min(target.length,mid.length);
    let a = target.toLowerCase();
    let b = mid.toLowerCase();
    for(let i=0;i<len;i++){
        let aVal = a.charCodeAt(i);
        let bVal = b.charCodeAt(i);
        if(aVal === bVal){
            continue;
        }
        else if(aVal<bVal){
            return 1;
        }
        else{
            return -1;
        }
    }
    if(a.length<b.length){
        return 1;
    }
    if(a.length>b.length){
        return -1;
    }
    return 0;
}
  
// compare function for sorting numbers in descending order
// returns 0 if target = mid, 1 if target>mid, -1 if target<mid
function descending(target: number, mid: number): number{
    if(target===mid){
        return 0;
    }
    else if(target>mid){
        return 1;
    }
    else{
        return -1;
    }
}

// compare function for rounding and sorting in ascending order
function roundedAscending(target: number, mid: number): number{
    let decimals = numDecimals(String(mid));
    let roundedMid = roundToDecimal(mid, numDecimals(String(target)));
    if(target===roundedMid){
        return 0;
    }
    else if(target>roundedMid){
        return 1;
    }
    else{
        return -1;
    }
}

// compare function for sorting strings alphabetically from z-a
function compareAlphaDescending(target: string, mid:string): number{
    const len = Math.min(target.length,mid.length);
    let a = target.toLowerCase()
    let b = mid.toLowerCase();
    let count: number =0;
    for(let i=0;i<len;i++){
        let aVal = a.charCodeAt(i);
        let bVal = b.charCodeAt(i);
        if(aVal === bVal){
        count++
        }
        else if(aVal<bVal){
        return -1;
        }
        else{
        return 1;
        }
    }
    return 0;
}

// compare function for sorting numbers in ascending order
function ascending(target: number, mid: number): number{
    if(target===mid){
        return 0;
    }
    else if(target<mid){
        return 1;
    }
    else{
        return -1;
    }
}

// is inputted a point data structure
function hieuristicAscending(arg1 : Point, arg2 : Point): number{
    if(arg1.cost === arg2.cost){
        return 0;
    }
    else if(arg1.cost < arg2.cost){
        return 1;
    }
    else {
        return -1;
    }
}

// compare function for searching for values within a range
// returns 0 if target is within min and max, 1 if target is >min, -1 if target<max
function compareRange(target: number, min: number, max: number): number{
    if(target>= min && target<= max){
        return 0;
    }
    else if(target<min){
        return 1;
    }
    else{
        return -1;
    }
}

// compare function for search for (lat,lng) within an area
function compareBetweenArea(lat1 : number, lat2 : number, lng1 : number, lng2 : number, latTarget : number, lngTarget : number): number{
    // store indexes of data that are within the two inputted points
    // smallest latitude value of the two points
    let minLat: number = Math.min(lat1,lat2);
    // biggest latitude value of the two points
    let maxLat: number = Math.max(lat1,lat2);
    // smallest longitude value of the two points
    let minLng: number = Math.min(lng1,lng2);
    // biggest longitude value of the two points
    let maxLng: number = Math.max(lng1, lng2);
    if (latTarget <= maxLat && latTarget >= minLat && lngTarget >= minLng && lngTarget <= maxLng){
        return 0;
    }
    else {
        return -1;
    }
}

// compare function for searching for times
function compareTimes(time: string, min: number, max: number): number{
    let tar : number = toSeconds(time);

    if(tar>= min && tar<= max){
        return 0;
    }
    else if(tar<min){
        return 1;
    }
    else{
        return -1;
    }
}

// compare function for binarySearch, when data is sorted ascendingly alphabetically
function compareAlphaAscendingSearch(target: string, mid:string): number{
    const len = Math.min(target.length,mid.length);
    let a = target.toLowerCase()
    let b = mid.toLowerCase();
    for(let i=0;i<len;i++){
        let aVal = a.charCodeAt(i);
        let bVal = b.charCodeAt(i);
        if(aVal === bVal){
            continue;
        }
        else if(aVal<bVal){
            return -1;
        }
        else{
            return 1;
        }
    }
    return 0;
}

// compare 2 letters, see which comes first
function compareLetter(target: string, val:string): number{
    const len = Math.min(target.length,val.length);
    let a = target.toLowerCase()
    let b = val.toLowerCase();
    a = a.substring(0, len);
    b = b.substring(0, len);    
    return (a === b) ? 1 : -1;
}

// used for advanced filter
// for the final find the rest of indexes
function compareAll(index : number, name : string, type : string, time1 : string, time2 : string, lat1 : number, lon1 : number, lat2 : number, lon2 : number): number{

    let check : number = 0;
    // check everytype
    // if it staifies give a increment
    // if its not a requirement give it for free
    //console.log(name)
    //console.log(data2.names_english[index])
    if(name === "" || compareLetter(name, data2.names_english[index]) === 1) {
        check++;
    }
    if(type === "" || checkType(data2.types[index], type) === 1){
        check++;
    }
    if(time1 === "" || compareTimes((data.localTime[index]), toSeconds(time1), toSeconds(time2)) === 0){
        check++;
    }
    if(lat1 === -1000 || compareBetweenArea(lat1, lat2, lon1, lon2, data.latitude[index], data.longitude[index]) === 0){
        check++;
    }
    if(check === 4){
        return 1;
    } 
    else {
        return -1;
    }
}

// checks for the type in an array
// O(n) time but max types is 2 os bascially constant.
function checkType(typeArray : string[], target : string) : number{
    target = target.toLowerCase();
    for(let i=0; i<typeArray.length; i++){
        let compare : string = typeArray[i].toLowerCase();
        if(compareLetter(compare, target) === 1){
            return 1;
        }
    }
    return -1;
}

// compare for sorting times ascendingly
function ascendingTime(target: string, mid: string): number{
    let a : number = toSeconds(target);
    let b : number = toSeconds(mid);
    if(a===b){
        return 0;
    }
    else if(a>b){
        return 1;
    }
    else{
        return -1;
    }
}

// compare function for sorting times descendingly
function descendingTime(target: string, mid: string): number{
    let a : number = toSeconds(target);
    let b : number = toSeconds(mid);
    if(a===b){
        return 0;
    }
    else if(a>b){
        return 1;
    }
    else{
        return -1;
    }
}