// contains comparisons

// compare function for sorting alphabetically ascendingly
function compareAlphaAscending(target: string, mid:string): number{
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

// compare function for search/sort descending
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

// rounds number, than compares
function roundedAscending(target: number, mid: number){
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

// compare function for alpha descending
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

// compare for sort/search ascending
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
function hieuristicAscending(arg1 : Point, arg2 : Point){
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
function compareRange(time: number, min: number, max: number){
    if(time>= min && time<= max){
=======
// is inputted a point data structure
function hieuristicAscending(arg1 : Point, arg2 : Point){
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

// compare function for range (min-max)
function compareRange(val: number, min: number, max: number): number{
    if(val>= min && val<= max){
>>>>>>> Stashed changes
        return 0;
    }
    else if(val<min){
        return 1;
    }
    else{
        return -1;
    }
}

// compare function that does nothing
function nothing(data: string | number): string | number{
    return data;
}

// compare alphabetically for the binarySearch algorithms
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
<<<<<<< Updated upstream
}
=======
}

>>>>>>> Stashed changes
