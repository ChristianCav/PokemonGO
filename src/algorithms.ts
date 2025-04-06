// contains algorithms

function binarySearch(target: number | string, data: any[], compareFn: any) : number[]{
    let left: number = 0;
    let right: number = data.length-1;
    let foundIndexes: number[] = []
    let foundIndex: number = -1;

    if(typeof compareFn !== 'function'){
        return [-1];
    }
    while(left <= right){
        // find middle index
        const midIndex: number = Math.floor((left+right)/2);
        // store the return value of the compare function
        const compareResult : number = compareFn(target, data[midIndex]);
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
    foundIndexes.push(foundIndex);

    let i: number = foundIndex -1;
    while(i>=0 && compareFn(target,data[i]) ===0){
        foundIndexes.push(i);
        i--;
    }

    let j: number = foundIndex +1;
    while(j<=data.length && compareFn(target,data[j]) === 0){
        foundIndexes.push(j);
        j++;
    }
    return foundIndexes;
} 
