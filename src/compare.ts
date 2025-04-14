// contains comparisons

// for merge sort
function compareAlphaAscendingSort(target: string, mid:string): number{
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

// for binarySearch
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
  
function descending(target: number, mid: number): number{
    if(target===mid){
        return 0;
    }
    else if(target>mid){
        return -1;
    }
    else{
        return 1;
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
        return -1;
    }
    else{
        return 1;
    }
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