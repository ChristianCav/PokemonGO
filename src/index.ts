//Don't remove this

const data : Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex: Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

const graph : Array<Array<Item>> = loadJSON("../DO_NOT_TOUCH/graph.json") // closest 500 nodes adjacency list

let sortedData : AllSorted = new AllSorted;

// handles performance times
// since functions are one by one we can use a queue to hold the performance times in order
// input the function performance times and the name of the function
let performanceTime : Queue<Pair> = new Queue();

// presort all sorted data

// KEY is ACTUAL VALUE
// VAL is the INDEXES
function presort(){
  sortedData.localTime = new Pair(indexToData(sort(data.localTime, ascending), data.localTime), sort(data.localTime, ascending));
  sortedData.pokemonId = new Pair(indexToData(sort(data.pokemonId, ascending), data.pokemonId), sort(data.pokemonId, ascending));
  sortedData.longitude = new Pair(indexToData(sort(data.longitude, ascending), data.longitude), sort(data.longitude, ascending));
  sortedData.latitude = new Pair(indexToData(sort(data.latitude, ascending), data.latitude), sort(data.latitude, ascending));
  sortedData.ids = new Pair(indexToData(sort(findPokedex(pokedex.ids), ascending), findPokedex(pokedex.ids)), sort(findPokedex(pokedex.ids), ascending));
  sortedData.names_english = new Pair(indexToData(sort(findPokedex(pokedex.names_english), compareAlphaAscending), findPokedex(pokedex.names_english)), sort(findPokedex(pokedex.names_english), compareAlphaAscending));
  sortedData.heights = new Pair(indexToData(sort(findPokedex(pokedex.heights), ascending), findPokedex(pokedex.heights)), sort(findPokedex(pokedex.heights), ascending));
  sortedData.weights = new Pair(indexToData(sort(findPokedex(pokedex.weights), ascending), findPokedex(pokedex.weights)), sort(findPokedex(pokedex.weights), ascending));
}

// premake other information
function precompile(){

}
presort();

// function to take the data and create new elements for each pokemon
// @param takes the data from the json file
function displayPokedex(pokedex: Pokedex): void {
  // select the grid container to append the pokemon to
  const gridContainer = document.querySelector(".pokemonGrid") as HTMLElement;

  // function to format the numbers of the pokemon
  // @param takes the id of the pokemon
  // @return returns the formatted number as a string
  function formatNumber(id: number): string {
    // Checks to see how many digits the id has and adds 0s to the front of it
    if (id < 10) return "#00" + id;
    else if (id < 100) return "#0" + id;
    else return "#" + id;
  }

  // loop through the first 149 pokemon
  for (let i = 0; i < 151; i++) {
    // creates a string of the types of the pokemon
    let types = "";
    const typeList = pokedex.types[i];

    // splits the types by the comma and adds them to the string
    for (let t = 0; t < typeList.length; t++) {
      const type = typeList[t];
      types += `<span class="type ${type.toLowerCase()}">${type}</span>`;
    }

    // creates the card for the pokemon
    const cardHTML = `
      <div class="pokemonCard">
        <img src="${pokedex.images[i]}" alt="${pokedex.names_english[i]}" class="pokemonImage">
        <div class="pokemonInfo">
          <h3 class="pokemonName">${pokedex.names_english[i]}</h3>
          <p class="pokemonNumber">${formatNumber(pokedex.ids[i])}</p>
          <div class="pokemonTypes">
        </div>
      </div>
    `;

    // appends the card to the grid container
    gridContainer.innerHTML += cardHTML;
  }
}

// call function when the DOM is loaded (webpage starts)
document.addEventListener("DOMContentLoaded", (): void => {
  displayPokedex(pokedex);
});

// returns the closest same pokemon as the pokemon given
// mon --> name of the pokemon
// lat --> latitude
// lon --> longitude
// numTargets --> how many pokemon you want
// returns a path of pairs (key is index in sorted.names_english), val is cost
// (first is first node) last is last node
function grindingCandies(mon : string, lat : number, lon : number, numTargets : number) : Pair[]{

  // search for all the indexes of the mon
  let indexArray : number[] = search<string>(sortedData.names_english.key, mon);
  
  // find shortest same pokemon (because we could be starting not on one)
  let shortestDistance : Pair = sortDistance(indexArray, lat, lon);
  let closest : number = sortedData.names_english.val[shortestDistance.val[0]] // index of closest pokemon, (of sorted)

  let startPokemon : Point = new Point(data.longitude[closest], data.latitude[closest], shortestDistance.val[0], 0);
  let path : Pair[] = bfs(startPokemon, numTargets, indexArray);
  path.push(new Pair(shortestDistance.val[0], 0));

  return path.reverse();

}

// bonus 5
// will give one of the shortest paths not guarenteed shortest because we do not have all the edges of the nodes only 5 of the closest
// (cannot have more because it takes up too much memory)
// couple assumptions
// assume the first pokemon we start at has an optimal path
// assume that majority of the pokemon required are all around us
/*
function catchThemAll(lon : number, lat : number){
  let close : Pair = sortDistance(sortedData.names_english.val, lat, lon) // first go to closest pokemon
  let filteredDistance : number[] = filterDistance(5000, lat, lon) // majority of all pokemon near start
  let start : Point = new Point(data.longitude[close.val[1]], data.latitude[close.val[1]], close.val[1])
  console.log(start)
  console.log(prim(start, filteredDistance));
  
}


console.log(filterDistance(5000, data.latitude[2], data.longitude[2]))
catchThemAll(data.longitude[2], data.latitude[2]);

//grindingCandies("Eevee", data.latitude[0], data.longitude[0])
// test stuff
/*
console.log(pokedex.names_english[data.pokemonId[0]-1])
let t = (grindingCandies(pokedex.names_english[data.pokemonId[0]-1], data.latitude[0], data.longitude[0]))
console.log(t);

/*
// array of indexes 
let g = sort(findPokedex(pokedex.names_english), compareAlphaAscending);
console.log(g)
let h = indexToData(g, findPokedex(pokedex.names_english));
console.log(h)
let k = binarySearch("P",h, compareAlphaDescending)
console.log(k);
console.log(indexToData(k,h));

const mainNames = pokedex.names_english.slice(0,149)
// array of indexes 
let m = sort(mainNames,compareAlphaAscending);
console.log(m)
let n = indexToData(m, mainNames);
console.log(n)
let o = binarySearch("P", n, compareAlphaDescending)
console.log(o);
console.log(indexToData(o,n));

console.log(filterCoords(data.latitude, data.longitude,-40, -40, 0, 0));
console.log(filterTimes(data.localTime, "1:40:20 AM", "5:21:40 AM"));
console.log(filterType(pokedex.types.slice(0,149), "Normal"));

// returns the closest same pokemon as the pokemon given
// uses haversine formula with the given pokemon as the comparision
// and sorts it by it
// therefore the closest pokemon is the second one in the return

function grindingCandies(mon : string, lat : number, lon : number){

  // search for all the indexes of the mon
  let indexArray : number[] = search<string>(findPokedex(pokedex.names_english), mon);
  // create new array to sort after
  let distanceArray : number[] = new Array(indexArray.length);

  // create an array of haversine lengths compared to the starting node
  // O(n)
  for(let i=0; i<indexArray.length; i++){
    let index : number = indexArray[i];

    // put the distance into array
    distanceArray[i] = haversine(lat, lon, data.latitude[index], data.longitude[index]);
  }

  // if the length is less 2 there is only 1 of that pokemon
  return (distanceArray.length <= 1) ? -1 : distanceArray[0]; // index 1 because 0 must be itself

}
// test stuff
/*
console.log(pokedex.names_english[data.pokemonId[21]-1])
let t = (grindingCandies(pokedex.names_english[data.pokemonId[21]-1], data.latitude[21], data.longitude[21]))
console.log(t);

/*
let f: mergeSort<string> = new mergeSort(compareAlphaAscending)
// array of indexes 
let g = f.sort(findPokedex(pokedex.names_english));
console.log(g)
let h = indexToData(g, findPokedex(pokedex.names_english));
console.log(h)
let k = binarySearch("P",h, compareAlphaDescending)
console.log(k);
console.log(indexToData(k,h));

const mainNames = pokedex.names_english.slice(0,149)
let l: MergeSortLL<string> = new MergeSortLL(mainNames);
// array of indexes 
let m = l.sort(compareAlphaAscending);
console.log(m)
let n = indexToData(m, mainNames);
console.log(n)
let o = binarySearch("P", n, compareAlphaDescending)
console.log(o);
console.log(indexToData(o,n));

console.log(filterCoords(data.latitude, data.longitude,-40, -40, 0, 0));
console.log(filterTimes(data.localTime, "1:40:20 AM", "5:21:40 AM"));
console.log(filterType(pokedex.types.slice(0,149), "Normal"));

/* HOW TO USE BINARY SEARCH AND MERGE SORT
// they have to be opposite
let t : mergeSort<number> = new mergeSort(ascending);
console.log(data.pokemonId);
let m = (t.sort(data.pokemonId));
console.log(m);
let v = (indexToData(m, data.pokemonId));
console.log(v);
let d = binarySearch(1, v, desending);
console.log(d);
console.log(indexToData(d, v));
*/