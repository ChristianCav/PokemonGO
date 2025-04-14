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

// returns indexes of sorted array
// O(nlogn) time 
class mergeSort<T>{

    // made into class so it is easy to store the index array
    private indexArray : number[];
    private compareFn : any;

    constructor(compare? : any){
        if(typeof compare !== 'function') compare = ascending;
        else this.compareFn = compare;
    }

    public sort<T>(arr : T[]) : number[]{

        let sortSpace : Pair<T>[] = new Array(arr.length);
        this.indexArray = new Array(arr.length);

        // make deep copy, we dont want to edit the original
        // O(n) time
        let deepcopy : Pair<T>[] = new Array(arr.length)
        for(let i=0; i<arr.length; i++){
            let newPair : Pair<T> = new Pair<T>(arr[i], i);
            deepcopy[i] = newPair;
        }

        this.mergeSort(deepcopy, 0, arr.length-1, sortSpace);
        return this.indexArray;
    }


    private mergeSort<T>(arr : Pair<T>[], leftStart : number, rightEnd : number, sortSpace : Pair<T>[]) : Pair<T>[]{
        
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
        arr = this.mergeSort(arr, leftStart, midIndex, sortSpace);
        arr = this.mergeSort(arr, midIndex + 1, rightEnd, sortSpace);

        // merge the 2 sorted halves together to sort the entire range from leftStart
        // to rightEnd
        arr = this.merge(arr, leftStart, rightEnd, sortSpace);

        return arr;
    }

    private merge<T>(arr: Pair<T>[], leftStart : number, rightEnd : number, sortSpace : Pair<T>[]) : Pair<T>[]{
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
            else if (this.compareFn(arr[rightIndex].val, arr[leftIndex].val) === 1){
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
        for ( let i = leftStart; i <= rightEnd; i++){
            arr[i] = sortSpace[i];
            this.indexArray[i] = arr[i].index;
        }

        // 2 O(n) time complexity loops run in this function, which is still O(n)
        
        return arr;
    }
}