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

// Distance formula
// returns the distance the current node is from the goal node
function heuristic(node : Point, goal : Point){
    return ((node.lat - node.lat) ** 2 + (node.lon - goal.lon) ** 2) ** 0.5
}

// find the distance between two points
// takes in intial position, target (amount of pokemon), array of the pokemon (binarysearched down)
// takes the position and finds the shortest path until target is hit
function aStar(start : Point, target : number, data : number[]){
    let q : PriorityQueue<Point> = new PriorityQueue<Point>(ascending);
    q.enqueue(start); // queue the starting node
    let prev : Array<number> = new Array(data.length);
    let gScore : Array<number> = new Array(data.length);
    let fScore : Array<number> = new Array(data.length);

    

}
