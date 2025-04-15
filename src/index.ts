//Don't remove this

const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex: Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

let sortedData: AllSorted = new AllSorted();

// handles performance times
// since functions are one by one we can use a queue to hold the performance times in order
// input the function performance times and the name of the function
let performanceTime: Queue<Pair> = new Queue();
// presort all sorted data
function presort() {
  sortedData.localTime = new Pair(
    indexToData(sort(data.localTime, ascending), data.localTime),
    sort(data.localTime, ascending)
  );
  sortedData.pokemonId = new Pair(
    indexToData(sort(data.pokemonId, ascending), data.pokemonId),
    sort(data.pokemonId, ascending)
  );
  sortedData.longitude = new Pair(
    indexToData(sort(data.longitude, ascending), data.longitude),
    sort(data.longitude, ascending)
  );
  sortedData.latitude = new Pair(
    indexToData(sort(data.latitude, ascending), data.latitude),
    sort(data.latitude, ascending)
  );
  sortedData.ids = new Pair(
    indexToData(
      sort(findPokedex(pokedex.ids), ascending),
      findPokedex(pokedex.ids)
    ),
    sort(findPokedex(pokedex.ids), ascending)
  );
  sortedData.names_english = new Pair(
    indexToData(
      sort(findPokedex(pokedex.names_english), compareAlphaAscending),
      findPokedex(pokedex.names_english)
    ),
    sort(findPokedex(pokedex.names_english), compareAlphaAscending)
  );
  sortedData.heights = new Pair(
    indexToData(
      sort(findPokedex(pokedex.heights), ascending),
      findPokedex(pokedex.heights)
    ),
    sort(findPokedex(pokedex.heights), ascending)
  );
  sortedData.weights = new Pair(
    indexToData(
      sort(findPokedex(pokedex.weights), ascending),
      findPokedex(pokedex.weights)
    ),
    sort(findPokedex(pokedex.weights), ascending)
  );
}
// // presort all sorted data
// function presort(){
//   sortedData.localTime = new Pair(indexToData(sort(data.localTime, ascending), data.localTime), sort(data.localTime, ascending));
//   sortedData.pokemonId = new Pair(indexToData(sort(data.pokemonId, compareAlphaAscending), data.pokemonId), sort(data.pokemonId, compareAlphaAscending));
//   sortedData.longitude = new Pair(indexToData(sort(data.longitude, ascending), data.longitude), sort(data.longitude, ascending));
//   sortedData.latitude = new Pair(indexToData(sort(data.latitude, ascending), data.latitude), sort(data.latitude, ascending));
//   sortedData.ids = new Pair(indexToData(sort(findPokedex(pokedex.ids), ascending), findPokedex(pokedex.ids)), sort(findPokedex(pokedex.ids), ascending));
//   sortedData.names_english = new Pair(indexToData(sort(findPokedex(pokedex.names_english), ascending), findPokedex(pokedex.names_english)), sort(findPokedex(pokedex.names_english), compareAlphaAscending));
//   sortedData.types = new Pair(indexToData(sort(findPokedex(pokedex.types), compareAlphaAscending), findPokedex(pokedex.types)), sort(findPokedex(pokedex.types), compareAlphaAscending));
//   sortedData.heights = new Pair(indexToData(sort(findPokedex(pokedex.heights), ascending), findPokedex(pokedex.heights)), sort(findPokedex(pokedex.heights), ascending));
//   sortedData.weights = new Pair(indexToData(sort(findPokedex(pokedex.weights), ascending), findPokedex(pokedex.weights)), sort(findPokedex(pokedex.weights), ascending));
// }

// presort();

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
        <img src="${pokedex.images[i]}" alt="${
      pokedex.names_english[i]
    }" class="pokemonImage">
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

// function to hide and unhide the advanced search bar
function toggleAdvancedSearch(): void {
  const advSearchBar = document.querySelector(".advSearchBar");

  if (advSearchBar) {
    advSearchBar.classList.toggle("hidden");
  }
}

function handleSearchClick(): void {
  const input = document.getElementById("searchBar") as HTMLInputElement | null;

  if (!input) return;

  const query: string = input.value.toLowerCase().trim();

  if (query.length === 0) {
    alert("Please enter a Pokémon name before searching.");
    return;
  }

  // Run the search
  const searchResult = binarySearch(
    query,
    sortedData.names_english.val,
    compareAlphaDescending
  );

  if (searchResult[0] === -1) {
    alert("Pokémon not found.");
    return;
  }

  const resultData = indexToData(searchResult, sortedData.names_english.val);

  // Save the data to sessionStorage
  sessionStorage.setItem("searchResults", JSON.stringify(resultData));

  // Redirect to the table page
  window.location.href = `../html/table.html`;
}

// const encodedQuery = encodeURIComponent(query);
// window.location.href = `../html/table.html?search=${encodedQuery}`;

// call function when the DOM is loaded (webpage starts)
// ! Only runs when in index.html file
// ! Only runs when in index.html file
document.addEventListener("DOMContentLoaded", (): void => {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);

  if (page === "index.html" || page === "") {
    displayPokedex(pokedex);
  }

  if (page === "table.html") {
    const tableBody = document.getElementById("pokemonTableBody");

    if (!tableBody) return;

    const rawData = sessionStorage.getItem("searchResults");

    if (!rawData) {
      tableBody.innerHTML =
        "<tr><td colspan='5'>No search results found.</td></tr>";
      return;
    }

    const dataArray = JSON.parse(rawData);

    tableBody.innerHTML = "";

    for (const data of dataArray) {
      const row = document.createElement("tr");

      // Create each cell
      const nameCell = document.createElement("td");
      nameCell.textContent = data.name;

      const typeCell = document.createElement("td");
      typeCell.textContent = Array.isArray(data.type)
        ? data.type.join("/")
        : data.type;

      const longitudeCell = document.createElement("td");
      longitudeCell.textContent = data.longitude?.toFixed(4) ?? "-";

      const latitudeCell = document.createElement("td");
      latitudeCell.textContent = data.latitude?.toFixed(4) ?? "-";

      const timeCell = document.createElement("td");
      timeCell.textContent = data.time ?? "-";

      // Append cells to row
      row.append(nameCell, typeCell, longitudeCell, latitudeCell, timeCell);
      tableBody.appendChild(row);
    }
  }
});

// returns the closest same pokemon as the pokemon given
// uses haversine formula with the given pokemon as the comparision
// and sorts it by it
// therefore the closest pokemon is the second one in the return
function grindingCandies(mon: string, lat: number, lon: number) {
  // search for all the indexes of the mon
  let indexArray: number[] = search<string>(sortedData.names_english.key, mon);
  // create new array to sort after
  let distanceArray: number[] = new Array(indexArray.length);

  // create an array of haversine lengths compared to the starting node
  // O(n)
  for (let i = 0; i < indexArray.length; i++) {
    let index: number = indexArray[i];

    // put the distance into array
    distanceArray[i] = haversine(
      lat,
      lon,
      data.latitude[index],
      data.longitude[index]
    );
  }

  // if the length is less 2 there is only 1 of that pokemon
  return distanceArray.length <= 1 ? -1 : distanceArray[0]; // index 1 because 0 must be itself
}

// test stuff
/*
console.log(pokedex.names_english[data.pokemonId[21]-1])
let t = (grindingCandies(pokedex.names_english[data.pokemonId[21]-1], data.latitude[21], data.longitude[21]))
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
