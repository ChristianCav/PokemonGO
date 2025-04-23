//Don't remove this
const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex: Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

const graph: Array<Array<Item>> = loadJSON("../DO_NOT_TOUCH/graph.json"); // closest 500 nodes adjacency list

// handles performance times
// since functions are one by one we can use a queue to hold the performance times in order
// input the function performance times and the name of the function
let performanceTime: Queue<Triplet> = new Queue();

let sortedData: AllSorted = new AllSorted();
let data2: Pokedex = new Pokedex();

// presort all sorted data
// KEY is ACTUAL VALUE
// VAL is the INDEXES
function presort() {
  let startTime = performance.now();
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
  let endTime = performance.now();
  let time : Triplet = new Triplet("Presort Data", endTime-startTime, true)
  performanceTime.enqueue(time);
}

// precompile the data to make it easier to access
// only take name and types as thats all we need for the table
function precompile(): void {
  let startTime = performance.now();
  data2.names_english = findPokedex(pokedex.names_english);
  data2.types = new Array<string[]>(data2.names_english.length);
  for(let i=0; i<data.localTime.length; i++){
    let index : number = data.pokemonId[i]-1;
    data2.types[i] = pokedex.types[index];
  }
  let endTime = performance.now();
  let time : Triplet = new Triplet("Precompile Data", endTime-startTime, true)
  performanceTime.enqueue(time);
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
    let types: string = "";
    const typeList: string[] = pokedex.types[i];

    // splits the types by the comma and adds them to the string
    for (let t = 0; t < typeList.length; t++) {
      const type: string = typeList[t];
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

// function to handle the search button click
function handleSearchClick(): void {

  const nameInput = document.getElementById("searchBar") as HTMLInputElement | null;
  const timeStartInput = document.getElementById("timePickerStart") as HTMLInputElement | null;
  const timeEndInput = document.getElementById("timePickerEnd") as HTMLInputElement | null;
  const minLngInput = document.getElementById("minLongitude") as HTMLInputElement | null;
  const maxLngInput = document.getElementById("maxLongitude") as HTMLInputElement | null;
  const minLatInput = document.getElementById("minLatitude") as HTMLInputElement | null;
  const maxLatInput = document.getElementById("maxLatitude") as HTMLInputElement | null;
  const typeInput = document.getElementById("typeInput") as HTMLInputElement | null;

  // check if they all exist
  if(!nameInput || !timeStartInput || !timeEndInput || !minLngInput || !maxLngInput || !minLatInput || !maxLatInput || !typeInput) return;

  // does not require all but one
  let name : string = nameInput.value.trim().length === 0 ? "" : nameInput.value.trim();
  let timeStart : string = (timeStartInput.value !== "") ? timeStartInput.value : "";
  let timeEnd : string = (timeEndInput.value !== "") ? timeEndInput.value : "";
  // allow decimals
  let minLng : number | null = isValidLongitude(parseFloat(minLngInput.value)) ? parseFloat(minLngInput.value) : -1000;
  let maxLng : number | null = isValidLongitude(parseFloat(maxLngInput.value)) ? parseFloat(maxLngInput.value) : -1000;
  let minLat : number | null = isValidLatitude(parseFloat(minLatInput.value)) ? parseFloat(minLatInput.value) : -1000;
  let maxLat : number | null = isValidLatitude(parseFloat(maxLatInput.value)) ? parseFloat(maxLatInput.value) : -1000;

  let type : string = (typeInput.value) !== "" ? typeInput.value.trim() : ""; 

  // if any of the pairs are null make them all null
  if(timeStart === "" || timeEnd === ""){
    timeStart = "";
    timeEnd = "";
  }

  if(minLng === -1000 || maxLng === -1000 || minLat === -1000 || maxLat === -1000){
    minLng = -1000
    maxLng = -1000
    minLat = -1000
    maxLat = -1000
  }

  const encodedQuery = encodeURIComponent(name);
  const encodedTime1 = encodeURIComponent(timeStart)
  const encodedTime2 = encodeURIComponent(timeEnd)
  const encodedlng1 = encodeURIComponent(minLng)
  const encodedlng2 = encodeURIComponent(maxLng)
  const encodedlat1 = encodeURIComponent(minLat)
  const encodedlat2 = encodeURIComponent(maxLat)
  const encodedType = encodeURIComponent(type);
  window.location.href = `../html/table.html?search=${encodedQuery}&type=${encodedType}&time1=${encodedTime1}&time2=${encodedTime2}&lng1=${encodedlng1}&lng2=${encodedlng2}&lat1=${encodedlat1}&lat2=${encodedlat2}&page=1`;

}

// populates the table with the search results
function populateTableWithResults(): void {
  // identify the current page
  const path: string = window.location.pathname;
  // get the last part of the path after the /
  const page: string = path.substring(path.lastIndexOf("/") + 1);
  // check if we are on the table page
  if (page !== "table.html") return;

  const tableBody = document.getElementById("pokemonTableBody");
  // if no table body, return
  if (!tableBody) return;

  // get all queries from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery: string | null = urlParams.get("search") as string;
  console.log(searchQuery);
  const typeQuery: string | null = urlParams.get("type") as string;
  console.log(typeQuery);
  const time1Query: string | null = urlParams.get("time1") as string;
  console.log(time1Query);
  const time2Query: string | null = urlParams.get("time2") as string;
  console.log(time2Query);
  const lng1Query: string | null = urlParams.get("lng1") as string;
  console.log(lng1Query);
  const lng2Query: string | null = urlParams.get("lng2") as string;
  console.log(lng2Query);
  const lat1Query: string | null = urlParams.get("lat1") as string;
  console.log(lat1Query);
  const lat2Query: string | null = urlParams.get("lat2") as string;
  console.log(lat2Query);

  const currentPage: number = parseInt(urlParams.get("page") || "1", 10);

  // run filter functions to get the indexes of the pokemon that match all filter queries

  let startTime = performance.now();

  // start with all indexes as searchResults
  let searchResultsList: List<number> = filterAll(searchQuery, typeQuery, time1Query, time2Query, Number(lat1Query), Number(lng1Query), Number(lat2Query), Number(lng2Query));

  let searchResults: number[] = searchResultsList.getData();

  // if no inputs make it default all with sorted names
  if(searchQuery === "" && (time1Query === "" || time2Query === "") && (Number(lng1Query) === -1000 || Number(lng2Query) === -1000 || Number(lat1Query) === -1000 || Number(lat2Query) === -1000)){
    searchResults = sortedData.names_english.val;
  }
  // else there are search results and presort them by alphabet
  else {
    let sortedResults = sort(indexToData(searchResults, data2.names_english), compareAlphaAscending);
    searchResults = indexConverter(sortedResults, searchResults);
  }

  // if no results, display error on table container
  if (searchResults.length === 0 || searchResults[0] === -1) {
    tableBody.innerHTML =
      "<tr><td colspan='5'>No Pokémon found matching your search.</td></tr>";
    return;
  }

  let endTime = performance.now();
  let time : Triplet = new Triplet("Populate All", endTime-startTime, true)
  performanceTime.enqueue(time);

  tableBody.innerHTML = "";

  // calculate the starting and ending indices for the current page
  const resultsPerPage: number = 100;
  const startIndex: number = (currentPage - 1) * resultsPerPage;
  const endIndex: number = Math.min(
    startIndex + resultsPerPage,
    searchResults.length
  );

  // get the slice of results for the current page
  const currentPageResults: number[] = searchResults.slice(
    startIndex,
    endIndex
  );

  // display the current page information
  const pageInfo = document.getElementById("pageInfo");
  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(
      searchResults.length / resultsPerPage
    )}`;
  }

  // show or hide pagination buttons
  updatePaginationButtons(
    currentPage,
    searchResults.length,
    resultsPerPage,
    searchQuery as string,
    typeQuery as string,
    time1Query as string, 
    time2Query as string,
    lat1Query as string,
    lat2Query as string,
    lng1Query as string,
    lng2Query as string
  );

  // Populate the table with the current page results
  for (const i of currentPageResults) {
    const name: any = data2.names_english[i];

    const type: string = Array.isArray(data2.types[i])
      ? data2.types[i].join("/")
      : data2.types[i];

    // if returns null then display a placeholder
    const longitude: string = data.longitude[i]?.toFixed(4) ?? "-";
    const latitude: string = data.latitude[i]?.toFixed(4) ?? "-";
    const time: string = data.localTime[i] ?? "-";

    // creates a new row for the table
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

// update the pagination buttons
// @param currentPage holds the current page
// @param totalResults holds the total num of results
// @param resultsPerPage holds the num of results per page
// @param searchQuery holds the search query
// @param typeQuery holds the type query
// @param time1Query holds the time1 query
// @param time2Query holds the time2 query
// @param lat1Query holds the lat1 query
// @param lat2hQuery holds the lat2 query
// @param lng1Query holds the lng1 query
// @param lng2Query holds the lng2 query
function updatePaginationButtons(
  currentPage: number,
  totalResults: number,
  resultsPerPage: number,
  searchQuery: string,
  typeQuery: string, 
  time1Query: string, 
  time2Query: string, 
  lat1Query: string, 
  lat2Query: string, 
  lng1Query: string,
  lng2Query: string
): void {
  // calcs the total number of pages needed
  const totalPages: number = Math.ceil(totalResults / resultsPerPage);

  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  // previous page button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.classList.add("pagination-button");
    // when the user clicks, navigates to the previous page
    prevButton.addEventListener("click", () => {
      navigateToPage(currentPage - 1, searchQuery, typeQuery, time1Query, time2Query, lat1Query, lat2Query, lng1Query, lng2Query);
    });
    paginationContainer.appendChild(prevButton);
  }

  // next page button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.classList.add("pagination-button");
    // when the user clicks, navigates to the next page
    nextButton.addEventListener("click", () => {
      navigateToPage(currentPage + 1, searchQuery, typeQuery, time1Query, time2Query, lat1Query, lat2Query, lng1Query, lng2Query);
    });
    paginationContainer.appendChild(nextButton);
  }
}

// function to navigate to the specified page
function navigateToPage(pageNumber: number, searchQuery: string, typeQuery: string, time1Query: string, time2Query: string, lat1Query:string, lat2Query: string, lng1Query:string, lng2Query:string): void {
  // encode all queries
  const encodedQuery = encodeURIComponent(searchQuery);
  const encodedTime1 = encodeURIComponent(time1Query)
  const encodedTime2 = encodeURIComponent(time2Query)
  const encodedlng1 = encodeURIComponent(lng1Query)
  const encodedlng2 = encodeURIComponent(lng2Query)
  const encodedlat1 = encodeURIComponent(lat1Query)
  const encodedlat2 = encodeURIComponent(lat2Query)
  const encodedType = encodeURIComponent(typeQuery);
  window.location.href = `../html/table.html?search=${encodedQuery}&type=${encodedType}&time1=${encodedTime1}&time2=${encodedTime2}&lng1=${encodedlng1}&lng2=${encodedlng2}&lat1=${encodedlat1}&lat2=${encodedlat2}&page=${pageNumber}`;
}

// call function when the DOM is loaded (webpage starts)
// ! Only runs when in index.html file
document.addEventListener("DOMContentLoaded", () => {
  const path: string = window.location.pathname;
  const page: string = path.substring(path.lastIndexOf("/") + 1);

  // check if page is index or blank page (home)
  if (page === "index.html" || page === "") {
    presort();
    precompile();
    displayPokedex(pokedex);
  }

  // checks of page is table
  if (page === "table.html") {
    presort();
    precompile();
    populateTableWithResults();
  }
  if (page === "map.html") {
    presort();
    precompile();
  }
});

// function to show the performance times
function showPerformanceTime(): void {
  console.log(performanceTime);
  const container = document.querySelector(".runtimeDisplay") as HTMLElement;
  const headingTitle = document.getElementById("runTimeHeading") as HTMLElement;

  // if queue is empty, show message
  if (performanceTime.isEmpty()) {
    container.innerHTML = "No more runtime data to display";
    return;
  }

  let mainFunction : string = "";
  let output : string = "";
  let firstIteration : boolean = true;

  // proceed until we find a main function (after the first one)
  while (!performanceTime.isEmpty()) {
    const current = performanceTime.peek() as Triplet;

    // remove and output the result
    const item = performanceTime.dequeue() as Triplet;
    output += `Function: ${item.key} — Time: ${item.val.toFixed(2)} ms<br>`;

    // mark that we've passed the first iteration
    if (item.main) {
      mainFunction = item.key;
      firstIteration = false;
    }

    // if we hit another main function after the first one, stop
    if (!firstIteration && current.main) {
      break;
    }
  }
  headingTitle.innerHTML = `Runtime For Each Algorithm: ${mainFunction}`;
  container.innerHTML = output;
}

// function to hide and unhide the advanced search bar
function toggleAdvancedSearch(): void {
  const advSearchBar = document.querySelector(".advSearchBar");

  // if advSearchBar is found then toggle the hidden class
  if (advSearchBar) {
    advSearchBar.classList.toggle("hidden");
  }
}

// sorts in a way for the table depending on what is inputted
// type is the value type ex name, latitude
// direction --> true is ascending --> false descending
// givenData --> the inputted data
function sortType(type : string, direction : boolean, givenData : any[]) : number[] {
  // sorted indexes based on the given data
  let sortedIndexes : number[];
  let comparetor : any;
  if(type === "name"){
    comparetor = (direction) ? compareAlphaAscending : compareAlphaDescending;
  }
  else if(type === "latitude" || type === "longitude"){
    comparetor = (direction) ? ascending : descending;
  }
  else if(type === "time"){
    comparetor = (direction) ? ascendingTime : descendingTime;
  }
  sortedIndexes = sort(givenData, comparetor);
  // return as original
  return indexConverter(sortedIndexes!, givenData);
}

// DOENST WORK BECUASE PRESORT IS CALLED AFTER

// grindingCandies("Eevee", data.latitude[0], data.longitude[0]);
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
