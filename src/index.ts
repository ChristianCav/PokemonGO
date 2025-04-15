//Don't remove this
const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex: Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

const graph: Array<Array<Item>> = loadJSON("../DO_NOT_TOUCH/graph.json"); // closest 500 nodes adjacency list

let sortedData: AllSorted = new AllSorted();
let data2: Pokedex = new Pokedex();

let currentRuntimeIndex: number = 0; // Keeps track of which runtime we’re displaying


let currentRuntimeIndex: number = 0; // Keeps track of which runtime we’re displaying


// handles performance times
// since functions are one by one we can use a queue to hold the performance times in order
// input the function performance times and the name of the function
let performanceTime: Queue<Pair> = new Queue();

// presort all sorted data

// KEY is ACTUAL VALUE
// VAL is the INDEXES
function presort() {
  sortedData.localTime = new Pair(
    indexToData(sort(data.localTime.map(toSeconds), ascending), data.localTime),
    sort(data.localTime.map(toSeconds), ascending)
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

function precompile(): void {
  data2.names_english = findPokedex(pokedex.names_english);
  data2.types = findPokedex(pokedex.types);
}

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
  for (let i = 0; i < 149; i++) {
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
        <div class="pokemonTypes">${types}</div>
      </div>
    </div>
  `;

    // appends the card to the grid container
    gridContainer.innerHTML += cardHTML;
  }
}

function handleSearchClick(): void {
  const input = document.getElementById("searchBar") as HTMLInputElement | null;
  if (!input) return;

  const query = input.value.trim();
  if (query.length === 0) {
    alert("Please enter a Pokémon name before searching.");
    return;
  }

  // Redirect to the table page with the search query as a parameter
  // Always start with page 1 for a new search
  const encodedQuery = encodeURIComponent(query);
  window.location.href = `../html/table.html?search=${encodedQuery}&page=1`;
}

function populateTableWithResults(data: Data): void {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);
  if (page !== "table.html") return;

  const tableBody = document.getElementById("pokemonTableBody");
  if (!tableBody) return;

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");
  const currentPage = parseInt(urlParams.get("page") || "1", 10);

  if (!searchQuery) {
    tableBody.innerHTML =
      "<tr><td colspan='5'>No search query found.</td></tr>";
    return;
  }

  const searchResults = search(sortedData.names_english.key, searchQuery);

  if (searchResults.length === 0 || searchResults[0] === -1) {
    tableBody.innerHTML =
      "<tr><td colspan='5'>No Pokémon found matching your search.</td></tr>";
    return;
  }

  tableBody.innerHTML = "";

  // Calculate the starting and ending indices for the current page
  const resultsPerPage = 100;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, searchResults.length);

  // Get the slice of results for the current page
  const currentPageResults = searchResults.slice(startIndex, endIndex);

  // Display the current page information
  const pageInfo = document.getElementById("pageInfo");
  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(
      searchResults.length / resultsPerPage
    )}`;
  }

  // Show or hide pagination buttons
  updatePaginationButtons(
    currentPage,
    searchResults.length,
    resultsPerPage,
    searchQuery
  );

  // Populate the table with the current page results
  for (const i of currentPageResults) {
    const name = sortedData.names_english.key[i];
    const originalIndex = sortedData.names_english.val[i];

    const type = Array.isArray(data2.types[originalIndex])
      ? data2.types[originalIndex].join("/")
      : data2.types[originalIndex];

    const longitude = data.longitude[originalIndex]?.toFixed(4) ?? "-";
    const latitude = data.latitude[originalIndex]?.toFixed(4) ?? "-";
    const time = data.localTime[originalIndex] ?? "-";

    const rowHTML = `
      <tr>
        <td>${name}</td>
        <td>${type}</td>
        <td>${longitude}</td>
        <td>${latitude}</td>
        <td>${time}</td>
      </tr>
    `;

    tableBody.innerHTML += rowHTML;
  }
}

function updatePaginationButtons(
  currentPage: number,
  totalResults: number,
  resultsPerPage: number,
  searchQuery: string
): void {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  // Previous page button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous Page";
    prevButton.classList.add("pagination-button");
    prevButton.addEventListener("click", () => {
      navigateToPage(currentPage - 1, searchQuery);
    });
    paginationContainer.appendChild(prevButton);
  }

  // Next page button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next Page";
    nextButton.classList.add("pagination-button");
    nextButton.addEventListener("click", () => {
      navigateToPage(currentPage + 1, searchQuery);
    });
    paginationContainer.appendChild(nextButton);
  }
}

function navigateToPage(pageNumber: number, searchQuery: string): void {
  const encodedQuery = encodeURIComponent(searchQuery);
  window.location.href = `../html/table.html?search=${encodedQuery}&page=${pageNumber}`;
}

// call function when the DOM is loaded (webpage starts)
// ! Only runs when in index.html file
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);

  presort();
  precompile();

  if (page === "index.html" || page === "") {
    displayPokedex(pokedex);
  }

  if (page === "table.html") {
    populateTableWithResults(data);
  }
});

// returns the closest same pokemon as the pokemon given
// uses haversine formula with the given pokemon as the comparision
// and sorts it by it
// therefore the closest pokemon is the second one in the return
function grindingCandies(
  mon: string,
  lat: number,
  lon: number,
  numTargets: number
) {
  // search for all the indexes of the mon
  let indexArray: number[] = search<string>(sortedData.names_english.key, mon);

  // find shortest same pokemon (because we could be starting not on one)
  let shortestDistance: Pair = sortDistance(indexArray, lat, lon);
  let closest: number = sortedData.names_english.val[shortestDistance.val[0]]; // index of closest pokemon, (of sorted)

  let startPokemon: Point = new Point(
    data.longitude[closest],
    data.latitude[closest],
    shortestDistance.val[0],
    0
  );
  let path: Pair[] = bfs(startPokemon, numTargets, indexArray);
  path.push(new Pair(shortestDistance.val[0], 0));

  console.log(path);
  console.log(path);
  return path.reverse();
}

// Function to show the performance times
function showPerformanceTime(): void {
  // get the container to display the performance times
  const container = document.querySelector(".runtimeDisplay") as HTMLElement;

  // Clear existing content
  container.innerHTML = "";

  const count = performanceTime.size(); // get size of the performance time queue
  const maxElements = 100; // max num of elements to show, if goes over, will remove the oldest ones
  const tempList: Pair[] = []; // temp list to hold the performance times

  // Loop through the queue and add the items to the temp list
  for (let i = 0; i < count; i++) {
    const item = performanceTime.dequeue();
    if (item) {
      tempList.push(item);
      performanceTime.enqueue(item);
    }
  }

  // take the last 100 elements from the temp list
  // if list is shorter than 100, take all of them
  const start = Math.max(0, tempList.length - maxElements);
  const latestEntries = tempList.slice(start);

  // Log each performance time in a new line, ordered most recent to oldest
  for (let i = latestEntries.length - 1; i >= 0; i--) {
    const pair = latestEntries[i];
    container.innerHTML += `${pair.key}: ${pair.val.toFixed(3)}ms<br>`;
  }
}

// function to hide and unhide the advanced search bar
function toggleAdvancedSearch(): void {
  const advSearchBar = document.querySelector(".advSearchBar");

  if (advSearchBar) {
    advSearchBar.classList.toggle("hidden");
  }
}
// grindingCandies("Eevee", data.latitude[0], data.longitude[0])
// test stuff

// console.log(filterTimes(sortedData.localTime.key, "12:00:10 AM", "2:46:40 AM"));
// console.log(filterCoords(sortedData.latitude.key, data.longitude, 0, 0, 40, 60, sortedData.latitude.val)); // 4261
// console.log(filterType(sortedData.ids.key, "Dragon"));
// console.log(filterName("Pidgey", sortedData.names_english.key));
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
