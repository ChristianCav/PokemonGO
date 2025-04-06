//Don't remove this

const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex : Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

class Algorithms {
  // Merge sort
  public mergeSort(dataArray: number[], l: number, m: number,r: number): number[] {
    return dataArray;
  }

  public merge() {}

  // finds all indexes of target
  // does binary search to find first occurence, then goes to the left and right to find all other occurences
  public binarySearch(target: number | string, data: any[], compareFn: any): number[]{
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
}

function compareNums(target: number, mid: number): number{
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

function displayPokedex(pokedex: Pokedex) {
  const gridContainer = document.querySelector(".pokemon-grid") as HTMLElement;

  function formatNumber(id: number): string {
    if (id < 10) return "#00" + id;
    else if (id < 100) return "#0" + id;
    else return "#" + id;
  }

  for (let i = 0; i < pokedex.ids.length; i++) {
    const types = pokedex.types[i].split(/[ ,]+/).map(type => {
      return `<span class="type ${type.toLowerCase()}">${type}</span>`;
    }).join("");

    const cardHTML = `
      <div class="pokemon-card">
        <img src="${pokedex.images[i]}" alt="${pokedex.names[i]}" class="pokemon-image">
        <div class="pokemon-info">
          <h3 class="pokemon-name">${pokedex.names[i]}</h3>
          <p class="pokemon-number">${formatNumber(pokedex.ids[i])}</p>
          <div class="pokemon-types">
            ${types}
          </div>
        </div>
      </div>
    `;

    gridContainer.innerHTML += cardHTML;
  }
}
