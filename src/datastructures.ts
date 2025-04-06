// constains all structures

// node structure for linkedlist
// double linked node
class node<T>{
    public next : node<T> | null = null;
    public prev : node<T> | null = null;
    // auto take value
    constructor(
        public val : T,
        public index : number,
    ){}
}

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
        if(typeof compare !== 'function') compare = ascending;
        else this.compare = compare;

        let arr : Array<number> = new Array<number>;
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