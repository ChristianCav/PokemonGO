// contains comparisons

function ascending(target: number, mid: number): number{
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

function descending(target: number, mid: number): number{
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


function compareAlpha(target: string, mid:string): number{
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
  
