//Don't remove this

const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex : Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

class Algorithms{

  // Splitting array
  private arraySplit(arr : any[], left : number, right : number) : any[]{
    let newArr : Array<any> = new Array(right-left);
    console.log(arr);
    for(let i=left, j=0; i<right; i++, j++){
        // wrong
        newArr[j] = arr[i];
    }
    //console.log(newArr);
    return newArr;
} 

  // Push value into array
  // use a fixed size array to create an ammortized O(n)
  // otherwise everytime i loop and push it will be O(n^2) too slow
  private arrayPush(arr : any[], val : any) : any[]{
    let newArr : any[] = new Array<any>(arr.length+1);
    for(let i=0; i<arr.length; i++){
      newArr[i] = arr[i];
    }
    newArr[arr.length] = val;
    return newArr;
  }

  // Merge sort
  // 
  public mergeSort(dataArray : any[]) : any[]{

    // base case
    if(dataArray.length <= 1){
      return dataArray;
    }
    // find mid point in the array
    let mid : number = Math.floor(dataArray.length/2);
    // split into left and right side subarrays
    let left : Array<any> = this.mergeSort(this.arraySplit(dataArray, 0, mid));
    let right : Array<any> = this.mergeSort(this.arraySplit(dataArray, mid, dataArray.length));
    
    return this.merge(left, right);
  }
  
  // Merge 
  // Merging the arrays together after they have been cut down to 1 piece
  public merge(left : any[], right : any[]) : any[]{
    let sortedArray: any[] = new Array<any>();
    let l : number = 0; let r : number = 0;
    // depending on compare we add that element to the sorted and increment the index
    // this compares every element to the other side, but since it is already sorted we don't have to compare with itself
    // maximum comparisions in a loop is n/2
    while (l < left.length && r < right.length) {
      // comparison
      if (left[l] < right[r]) {
          this.arrayPush(sortedArray, left[l]);
          l++;
      } else {
          this.arrayPush(sortedArray, right[r]);
          r++;
      }
    }

    // add remaining elements
    while (l < left.length) {
      this.arrayPush(sortedArray, left[l]);
      l++;
    }
    while (r < right.length) {
      this.arrayPush(sortedArray, right[r]);
      r++;
    }

  return sortedArray;
  }   
  
}
/*
let a : Algorithms = new Algorithms;
let test = data.longitude;
a.mergeSort(test);
console.log(test);
*/
let t : MergeSortLL<number> = new MergeSortLL<number>;
t.push(1);
t.push(2);
t.print();