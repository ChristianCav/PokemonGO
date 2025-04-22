// contains comparisons

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
        return 0;
    }
    else if(time<min){
        return 1;
    }
    else{
        return -1;
    }
}

function nothing(data: string | number): string | number{
    return data;
}

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
function compareTimes(time: number, min: number, max: number){
    if(time>= min && time<= max){
        return 0;
    }
    else if(time<min){
        return 1;
    }
    else{
        return -1;
    }
}

// for the final find the rest of indexes
function compareAll(index : number, name : string, type : string, time1 : string, time2 : string, lat1 : number, lon1 : number, lat2 : number, lon2 : number, sortedArrayIndexes : number[]): number{
    // convert to original
    let originalIndex : number = sortedArrayIndexes[index];

    let check : number = 0;
    // check everytype
    // if it staifies give a increment
    // if its not a requirement give it for free
    if(name === "" || compareAlphaAscending(name, data2.names_english[originalIndex])) {
        check++;
    }
    if(type === "" || checkType(data2.types[originalIndex], type) === 1){
        check++;
    }
    if(time1 === "" || compareRange(toSeconds(data.localTime[index]), toSeconds(time1), toSeconds(time2))){
        check++;
    }
    if(lat1 === -1){
        check++;
    }
    if(check === 4){
        return 1;
    } 
    else {
        console.log(check)
        return -1;
    }
}

// checks for the type in an array
// O(n) time but max types is 2 os bascially constant.
function checkType(typeArray : string[], target : string) : number{
    for(let i=0; i<typeArray.length; i++){
        if(typeArray[i] === target){
            return 1;
        }
    }
    return -1;
}