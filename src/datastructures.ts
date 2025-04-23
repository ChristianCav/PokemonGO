// constains all structures

// pair data structure
// mainly used for merge sort holding index and value
class PairNode<T> {
  constructor(public val: T, public index: number) {}
}

// used for graph
class Item {
  id: number;
  distance: number;
}

// for the performance time
class Triplet {
  constructor(public key: any, public val: any, public main: boolean) {}
}

// pair data struture
// this one is similar to a map where it has a key and value
class Pair {
  constructor(public key: any, public val: any) {}
}

// node structure for linkedlist
// double linked node
class node<T> {
  public next: node<T> | null = null;
  public prev: node<T> | null = null;
  // auto take value
  constructor(public val: T, public index: number) {}
}

// queue using list
// list usues enqueue O(1) ammoritized
// dequeue O(n) because its always the front
class Queue<T> {
  private queueArray: List<T> = new List<T>();
  private numberOfElements: number = 0;

  //Add one element to the rear of the queue
  public enqueue(arg: T): void {
    this.queueArray.push(arg);
    this.numberOfElements++;
  }
  //Removes and returns the element at the front
  public dequeue(): T | null {
    if (this.isEmpty()) return null;
    let front: T | null = this.queueArray.get(0);
    this.queueArray.delete(0);
    this.numberOfElements--;
    return front;
  }
  //Returns the first element in the queue
  public peek(): T | null {
    return this.queueArray.get(0);
  }
  //Returns true if the queue is empty
  public isEmpty(): boolean {
    return this.numberOfElements == 0 ? true : false;
  }
  //Returns the length of the queue
  public size(): number {
    return this.numberOfElements;
  }
}

/*
// TO USE
// Create the class (dataarray)
// returns sorted data array in index form
class MergeSortLL<T> {

    // since in merge sort split we aren't able to split an array down the middle unless we copy all previous elements
    // by using a linked link i can have a pointer towards the middle and just cut it in half
    // this way the split function becomes O(n/2) time instead of O(n)
    
    // also solves the push issue being O(n) because I can just push to the tail making it O(1)

    private head: node<T> | null = null;
    private tail: node<T> | null = null;
    private numElements : number = 0;

    // contains the function to compare 
    private compare : any;

    // construct linked list given data
    // takes O(n) time
    constructor(arr : Array<T>){
        for(let i=0; i<arr.length; i++){
            // create new node
            let newNode : node<T> = new node<T>(arr[i], i);
            
            // check if head exists
            if(this.head === null){
                this.head = newNode;
                this.tail = newNode;
                this.numElements++;
            }
            else if(this.tail !== null){
                this.tail.next = newNode;
                this.tail = newNode;
                this.numElements++;
            }
        }
    }

    // get size
    public size(): number {
        return this.numElements;
    }

    // Merge Sort
    // start with the head
    // cut it half until base case, 1 element
    // this way we can recombine them from the bottom up using O(1) opperation each time
    private mergeSort(head: node<T> | null) : node<T> | null {
        // base case
        // when the head is null means the split was uneven
        // when next is null it is a 1 item list
        if (!head || !head.next) return head;

        // split
        // contains the start to middle
        let middle : node<T> | null = this.getMiddle(head);
        // contains middle to end
        let nextOfMiddle : node<T> | null= middle.next;

        // Break the list into two halves
        middle.next = null;

        // split into left and right side linkedlists using the head
        let left : node<T> | null = this.mergeSort(head);
        let right : node<T> | null = this.mergeSort(nextOfMiddle);

        // merge
        return this.sortedMerge(left, right);
    }

    // find middle
    private getMiddle(node: node<T>) : node<T> {
        if (!node) return node;

        let slow = node;
        let fast = node;

        // since fast goes by 2 it goes to the end 2 times faster
        // therefore since slow goes by 1 it will reach the middle
        // O(n/2) to traverse
        while (fast.next !== null && fast.next.next !== null) {
            // if fast isnt null slow can't be either
            slow = slow.next!;
            fast = fast.next.next;
        }
        return slow;
    }

    // Merge 
    // Merging the arrays together after they have been cut down to 1 piece
    private sortedMerge(left: node<T> | null, right: node<T> | null) : node<T> | null {

        // depending on compare we add that element to the sorted and increment the index
        // this compares every element to the other side, but since it is already sorted we don't have to compare with itself
        // maximum comparisions in a loop is n/2

        let result : node<T> | null = null;
        let resultTail : node<T> | null = null;

        while(left !== null && right !== null){
            let newNode : node<T>;
            // COMPARISON
            if(this.compare(left.val, right.val) === 1){
                newNode = new node<T>(left.val, left.index);
                left = left.next;
                
            }
            else{
                newNode = new node<T>(right.val, right.index);
                right = right.next;
            }
            // no head
            if(result === null){
                result = newNode;
                resultTail = newNode;
            }
            // has head
            else if(resultTail !== null) {
                resultTail.next = newNode;
                resultTail = newNode;
            }
        }
        let remaining = (left !== null) ? left : right;
        if (resultTail !== null) {
            resultTail.next = remaining;
        }
        return result;
    }

    // sort the stuff
    // returns an array of sorted indexes
    public sort(compare? : any) : Array<number> {

        // if no compare function just do ascending
        if(typeof compare !== 'function') this.compare = descending;
        else this.compare = compare;

        let arr : Array<number> = new Array;
        let cur : node<T> = this.mergeSort(this.head) as node<T>;
        // O(n) to convert back to list
        for(let i=0; i<this.numElements; i++){
            arr[i] = cur.index;
            if(cur.next !== null){
                cur = cur.next;
            }
        }
        return arr;
    }
}
*/

class List<T> {
  public data: T[] = new Array<T>(10);
  private numItems: number = 0;
  private startSize: number = 10;

  // post: removes the element at index.
  //  returns without removing if index is not between
  //  0 and size() - 1
  public delete(index: number) {
    // halve the size of the array if it is only half full and larger than the startSize
    if (
      this.numItems === this.data.length / 2 &&
      this.data.length > this.startSize
    ) {
      let newData: T[] = new Array<T>(Math.floor(this.numItems / 2));

      for (let i = 0; i < this.numItems; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
    }
    //shift values after index to the left
    for (let i = index; i < this.numItems; i++) {
      this.data[i] = this.data[i + 1];
    }

    this.numItems--;
  }

  public size(): number {
    return this.numItems;
  }

  public isEmpty(): boolean {
    return this.numItems === 0;
  }

  // inserts a number at a certain index, pushing everything from the right of it 1 space right
  public insert(val: T, index: number) {
    if (this.numItems === this.data.length) {
      let newData: T[] = new Array<T>(this.numItems * 2);

      for (let i = 0; i < this.numItems; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
    }
    //shift values after index to the right
    for (let i = this.numItems; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }

    this.data[index] = val;

    this.numItems++;
  }

  public replace(val: T, index: number): void {
    if (index < 0 || index >= this.numItems) return;
    this.data[index] = val;
  }

  public get(index: number): T | null {
    if (index < 0 || index >= this.numItems) return null;
    return this.data[index];
  }

  // ammoritized O(1)
  // because the array will usually be big enough to O(1) add elements
  public push(val: T) {
    if (this.numItems === this.data.length) {
      let newData: T[] = new Array<T>(this.numItems * 2);

      for (let i = 0; i < this.numItems; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
    }
    this.data[this.numItems] = val;
    this.numItems++;
  }

  public getData(): T[] {
    return this.data.slice(0, this.numItems);
  }
}

// uses comparator
class PriorityQueue<T> {
  // contains compare function
  private compare: any;

  // a binary tree sort of that makes the root node be 0 then
  // left side is root * 2 + 1
  // right side is root * 2 + 2
  // so sons of 0 are 1 and 2
  // these become parent nodes for other ones going on and on
  private heap: List<T> = new List<T>();

  private numData: number = 0;

  constructor(compare: any) {
    this.compare = compare;
  }

  public isEmpty(): boolean {
    return this.numData === 0;
  }

  public peek(): T | null {
    return this.heap.get(0);
  }

  public enqueue(val: T) {
    this.heap.push(val);
    this.numData++;
    this.heapUp();
  }

  public dequeue(): T | null {
    let top = this.peek();
    let bottom: T = this.heap.get(this.numData - 1) as T;
    this.heap.delete(this.numData - 1);
    this.numData--;
    // basically swap the top value with bottom value
    // while taking the top value
    // this allows us to place the bottom value at the top using O(1) operations to get the top value
    // top value normally would take O(n) because we have to shift everything back
    // now just compare the root node to its children swaping when compartor says
    if (this.numData > 0 && bottom !== null) {
      this.heap.replace(bottom, 0);
      this.heapDown();
    }
    return top;
  }

  // compares new element and parents until it is in sorted order
  private heapUp(): void {
    let index: number = this.numData - 1;
    let element: T = this.heap.get(index) as T;
    //console.log(element);
    // cannot be less than 0 because 0 is top root node
    while (index > 0) {
      let parentIndex: number = Math.floor((index - 1) / 2);
      let parent: T = this.heap.get(parentIndex) as T;

      // comparison
      // if its not the ideal compare then the node is in place
      if (this.compare(element, parent) === 1) break;
      this.heap.replace(parent, index);
      index = parentIndex;
    }

    this.heap.replace(element, index);
  }

  private heapDown(): void {
    let index: number = 0;
    let element: T = this.heap.get(0) as T;

    while (true) {
      let leftChild: number = 2 * index + 1;
      let rightChild: number = 2 * index + 2;
      let swapIndex: number = index;

      if (
        leftChild < this.numData &&
        this.compare(this.heap.get(leftChild), this.heap.get(swapIndex)) !== 1
      ) {
        swapIndex = leftChild;
      }

      // both if statements because it doesn't matter if it goes left or right
      // end of day the structure is layer based
      // with prio at top
      if (
        rightChild < this.numData &&
        this.compare(this.heap.get(rightChild), this.heap.get(swapIndex)) !== 1
      ) {
        swapIndex = rightChild;
      }

      // no swaps
      if (swapIndex === index) break;

      let swapElement: T = this.heap.get(swapIndex) as T;
      this.heap.replace(swapElement, index);
      index = swapIndex;
    }

    this.heap.replace(element, index);
  }
}

class Point {
  constructor(
    public lon: number,
    public lat: number,
    public index: number,
    public cost: number
  ) {}
}


// everything below is for the map and pokemon catching

// class to store pokemon id and species for the pokemon to catch
// this is used to store the pokemon that are yet to be caught
class PokemonEntry {
  id: number;
  species: string;

  constructor(id: number, species: string) {
    this.id = id;
    this.species = species;
  }
}

// class to store the pokemon coordinates and distance from the user inputted coordinates
class PokemonCoordWithDistance {
  lat: number;
  lng: number;
  distance: number;
  species: string;

  constructor(lat: number, lng: number, distance: number, species: string) {
    this.lat = lat;
    this.lng = lng;
    this.distance = distance;
    this.species = species;
  }
}

// class to store the coordinates list, used for shortestDist and shortestCandyDist
class CoordList {
  // coordinates list, number of coords in the list, and capacity of the list
  private coordinates: [number, number][];
  private count: number;
  private capacity: number;

  // constructor for the coordinates list, initializes the coordinates list with a capacity of 1 and adds the initial coordinate to the list
  constructor(initialCoord: [number, number]) {
    this.capacity = 1;
    this.coordinates = new Array(this.capacity) as [number, number][];
    this.count = 0;

    if (initialCoord) {
      this.coordinates[0] = initialCoord;
      this.count = 1;
    }
  }

  // adds a new coordinate to the list, increases the capacity if the list is full
  // O(n) time complexity for adding a new coordinate and copying the list
  public add(lat: number, lng: number): void {
    if (this.count === this.capacity) {
      const newCapacity = this.capacity + 1;
      const newArray = new Array(newCapacity) as [number, number][];
      for (let i = 0; i < this.count; i++) {
        newArray[i] = [this.coordinates[i][0], this.coordinates[i][1]];
      }
      this.coordinates = newArray;
      this.capacity = newCapacity;
    }
    this.coordinates[this.count] = [lat, lng];
    this.count++;
  }

  // gets all the coordinates in the list and returns them as an array
  // O(n) time complexity for getting all the coordinates
  public getAll(): [number, number][] {
    const result = new Array(this.count) as [number, number][];
    for (let i = 0; i < this.count; i++) {
      result[i] = [this.coordinates[i][0], this.coordinates[i][1]];
    }
    return result;
  }

  // return the coordinates as a leaflet path as an array of LatLngTuple
  // this is used to draw the path on the map
  // O(n) time complexity for converting to leaflet path
  public toLeafletPath(): L.LatLngTuple[] {
    const result = new Array(this.count) as L.LatLngTuple[];
    for (let i = 0; i < this.count; i++) {
      result[i] = [this.coordinates[i][0], this.coordinates[i][1]];
    }
    return result;
  }

  // gets the size of the coordinates list
  // O(1) time complexity for getting the size of the list
  public size(): number {
    return this.count;
  }
}

// class to store the indexes of the caught pokemon
// this is used to ensure the same pokemon is not caught multiple times
class CaughtIndices {
  private spawnIndices: number[];  // tracks which spawn points have been caught
  private pokemonIds: number[];    // tracks which pokemon species have been caught
  private count: number;

  constructor(maxSize: number) {
    this.spawnIndices = new Array(maxSize);
    this.pokemonIds = new Array(149); // only 149 Gen 1 pokemon
    this.count = 0;
  }

  // adds a new index to the list of caught pokemon
  // O(1) time complexity for adding a new index
  public add(spawnIndex: number, pokemonId: number): void {
    this.spawnIndices[this.count] = spawnIndex;
    this.pokemonIds[pokemonId - 1] = pokemonId; // IDs start at 1
    this.count++;
  }

  // checks if the spawn index is already in the list of caught pokemon
  // O(n) time complexity for checking if the index is in the list
  public containsSpawn(spawnIndex: number): boolean {
    for (let i = 0; i < this.count; i++) {
      if (this.spawnIndices[i] === spawnIndex) return true;
    }
    return false;
  }

  // checks if the pokemon species has already been caught
  // O(1) time complexity since we're using direct indexing
  public containsPokemon(pokemonId: number): boolean {
    return this.pokemonIds[pokemonId - 1] !== undefined;
  }

  // gets the size of the list of caught pokemon
  // O(1) time complexity for getting the size of the list
  public size(): number {
    return this.count;
  }

  // gets the index of the caught pokemon at the given index
  // O(1) time complexity for getting the index of the caught pokemon
  public get(index: number): number {
    return this.spawnIndices[index];
  }
}

// class to store the pokemon to catch, this is used to store the pokemon that are yet to be caught
class PokemonToCatch {
  private data: PokemonEntry[];
  private count: number;

  // consturctor makes a array with a fixed size of 149, as there are only 149 pokemon in the dataset
  constructor() {
    this.data = new Array(149);
    this.count = 0;
  }

  // adds a new pokemon to the list of pokemon to catch
  // O(1) time complexity for adding a new pokemon
  public add(id: number, species: string): void {
    this.data[this.count] = new PokemonEntry(id, species);
    this.count++;
  }

  // gets the size of the list of pokemon to catch
  // O(1) time complexity for getting the size of the list
  public size(): number {
    return this.count;
  }

  // gets the index of the pokemon to catch at the given index
  // O(1) time complexity for getting the index of the pokemon to catch
  public get(index: number): PokemonEntry {
    return this.data[index];
  }
}
