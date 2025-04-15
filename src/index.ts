//Don't remove this
const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex: Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

const graph: Array<Array<Item>> = loadJSON("../DO_NOT_TOUCH/graph.json"); // closest 500 nodes adjacency list

let sortedData: AllSorted = new AllSorted();
let data2: Pokedex = new Pokedex();

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

// precompile the data to make it easier to access
// only take name and types as thats all we need for the table
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
    let types: string = "";
    const typeList: string = pokedex.types[i];

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
  const input = document.getElementById("searchBar") as HTMLInputElement | null;
  
  // Get advanced search parameters
  const minLongitude = (document.getElementById("minLongitude") as HTMLInputElement)?.value;
  const maxLongitude = (document.getElementById("maxLongitude") as HTMLInputElement)?.value;
  const minLatitude = (document.getElementById("minLatitude") as HTMLInputElement)?.value;
  const maxLatitude = (document.getElementById("maxLatitude") as HTMLInputElement)?.value;
  const timeStart = (document.getElementById("timePickerStart") as HTMLInputElement)?.value;
  const timeEnd = (document.getElementById("timePickerEnd") as HTMLInputElement)?.value;
  
  // if no input, return
  if (!input) return;

  // get val of input and trim
  const query = input.value.trim();
  
  // Build the URL with search parameters
  let searchParams = new URLSearchParams();
  searchParams.set("page", "1"); // Always start with page 1 for a new search
  
  // Add name search if provided
  if (query.length > 0) {
    searchParams.set("search", query);
  }
  
  // Add coordinate filters if both min and max are provided
  if (minLongitude && maxLongitude) {
    searchParams.set("minLong", minLongitude);
    searchParams.set("maxLong", maxLongitude);
  } else if (minLongitude || maxLongitude) {
    alert("Please enter both minimum and maximum longitude values.");
    return;
  }
  
  if (minLatitude && maxLatitude) {
    searchParams.set("minLat", minLatitude);
    searchParams.set("maxLat", maxLatitude);
  } else if (minLatitude || maxLatitude) {
    alert("Please enter both minimum and maximum latitude values.");
    return;
  }
  
  // Add time filters if both start and end are provided
  if (timeStart && timeEnd) {
    // Convert HTML time input (HH:MM) to the format needed (HH:MM:00 AM/PM)
    searchParams.set("timeStart", formatTimeForFilter(timeStart));
    searchParams.set("timeEnd", formatTimeForFilter(timeEnd));
  } else if (timeStart || timeEnd) {
    alert("Please enter both start and end time values.");
    return;
  }
  
  // If no search parameters were provided, prompt user
  if (searchParams.toString() === "page=1") {
    alert("Please enter a search term or use the advanced search options.");
    return;
  }
  
  // Redirect to the table page with all the parameters
  window.location.href = `../html/table.html?${searchParams.toString()}`;
}

// Helper function to convert HTML time input format (HH:MM) to the format needed by filterTimes (HH:MM:00 AM/PM)
function formatTimeForFilter(timeString: string): string {
  // HTML time input returns time in 24-hour format (HH:MM)
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Convert to 12-hour format with AM/PM
  let period = "AM";
  let hours12 = hours;
  
  if (hours >= 12) {
    period = "PM";
    hours12 = hours === 12 ? 12 : hours - 12;
  }
  
  if (hours12 === 0) {
    hours12 = 12; // Convert 0 to 12 for 12 AM
  }
  
  // Format as "H:MM:00 AM/PM"
  return `${hours12}:${minutes.toString().padStart(2, '0')}:00 ${period}`;
}

// populates the table with the search results
function populateTableWithResults(data: Data): void {
  // identify the current page
  const path: string = window.location.pathname;
  const page: string = path.substring(path.lastIndexOf("/") + 1);
  if (page !== "table.html") return;

  const tableBody = document.getElementById("pokemonTableBody");
  if (!tableBody) return;

  // Get all parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery: string | null = urlParams.get("search");
  const currentPage: number = parseInt(urlParams.get("page") || "1", 10);
  
  // Get coordinate filters
  const minLong: number | null = urlParams.get("minLong") ? parseFloat(urlParams.get("minLong")!) : null;
  const maxLong: number | null = urlParams.get("maxLong") ? parseFloat(urlParams.get("maxLong")!) : null;
  const minLat: number | null = urlParams.get("minLat") ? parseFloat(urlParams.get("minLat")!) : null;
  const maxLat: number | null = urlParams.get("maxLat") ? parseFloat(urlParams.get("maxLat")!) : null;
  
  // Get time filters
  const timeStart: string | null = urlParams.get("timeStart");
  const timeEnd: string | null = urlParams.get("timeEnd");
  
  // Initialize results array
  let searchResults: number[] = [];
  
  // Apply name search if provided
  if (searchQuery && searchQuery.length > 0) {
    searchResults = search(sortedData.names_english.key, searchQuery);
  } else {
    // If no name search, use all pokemon
    searchResults = Array.from({ length: sortedData.names_english.key.length }, (_, i) => i);
  }
  
  // Apply coordinate filters if provided
  if (minLong !== null && maxLong !== null && minLat !== null && maxLat !== null) {
    // Get Pokemon within the coordinate range
    const coordResults = filterCoords(
      sortedData.latitude.key, 
      data.longitude, 
      minLat, 
      minLong, 
      maxLat, 
      maxLong, 
      sortedData.latitude.val
    );
    
    // If we have valid coordinates, filter search results
    if (coordResults[0] !== -1) {
      // We need to match indexes between the name search and coordinate filter
      searchResults = searchResults.filter(index => {
        const originalIndex = sortedData.names_english.val[index];
        return coordResults.includes(originalIndex);
      });
    }
  }
  
  // Apply time filters if provided
  if (timeStart && timeEnd) {
    // Filter results by time range
    const timeResults = filterTimes(sortedData.localTime.key, timeStart, timeEnd);
    
    if (timeResults[0] !== -1) {
      // Filter results to only include Pokémon that match the time range
      searchResults = searchResults.filter(index => {
        const originalIndex = sortedData.names_english.val[index];
        return timeResults.includes(originalIndex);
      });
    }
  }
  
  // Display no results message if appropriate
  if (searchResults.length === 0 || searchResults[0] === -1) {
    tableBody.innerHTML = "<tr><td colspan='5'>No Pokémon found matching your search criteria.</td></tr>";
    return;
  }

  tableBody.innerHTML = "";

  // Calculate the starting and ending indices for the current page
  const resultsPerPage: number = 100;
  const startIndex: number = (currentPage - 1) * resultsPerPage;
  const endIndex: number = Math.min(startIndex + resultsPerPage, searchResults.length);

  // Get the slice of results for the current page
  const currentPageResults: number[] = searchResults.slice(startIndex, endIndex);

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
    searchQuery,
    minLong,
    maxLong,
    minLat,
    maxLat,
    timeStart,
    timeEnd
  );

  // Populate the table with the current page results
  for (const i of currentPageResults) {
    const name: any = sortedData.names_english.key[i];
    const originalIndex: any = sortedData.names_english.val[i];

    const type: string = Array.isArray(data2.types[originalIndex])
      ? data2.types[originalIndex].join("/")
      : data2.types[originalIndex];

    // if returns null then display a placeholder
    const longitude: string = data.longitude[originalIndex]?.toFixed(4) ?? "-";
    const latitude: string = data.latitude[originalIndex]?.toFixed(4) ?? "-";
    const time: string = data.localTime[originalIndex] ?? "-";

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

// Update this function to include all search parameters
function updatePaginationButtons(
  currentPage: number,
  totalResults: number,
  resultsPerPage: number,
  searchQuery: string | null,
  minLong: number | null,
  maxLong: number | null,
  minLat: number | null,
  maxLat: number | null,
  timeStart: string | null,
  timeEnd: string | null
): void {
  const totalPages: number = Math.ceil(totalResults / resultsPerPage);

  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  // Previous page button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.classList.add("pagination-button");
    prevButton.addEventListener("click", () => {
      navigateToPage(currentPage - 1, searchQuery, minLong, maxLong, minLat, maxLat, timeStart, timeEnd);
    });
    paginationContainer.appendChild(prevButton);
  }

  // Next page button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.classList.add("pagination-button");
    nextButton.addEventListener("click", () => {
      navigateToPage(currentPage + 1, searchQuery, minLong, maxLong, minLat, maxLat, timeStart, timeEnd);
    });
    paginationContainer.appendChild(nextButton);
  }
}

// Update this function to include all search parameters
function navigateToPage(
  pageNumber: number, 
  searchQuery: string | null,
  minLong: number | null,
  maxLong: number | null,
  minLat: number | null,
  maxLat: number | null,
  timeStart: string | null,
  timeEnd: string | null
): void {
  let searchParams = new URLSearchParams();
  searchParams.set("page", pageNumber.toString());
  
  if (searchQuery) {
    searchParams.set("search", searchQuery);
  }
  
  if (minLong !== null && maxLong !== null) {
    searchParams.set("minLong", minLong.toString());
    searchParams.set("maxLong", maxLong.toString());
  }
  
  if (minLat !== null && maxLat !== null) {
    searchParams.set("minLat", minLat.toString());
    searchParams.set("maxLat", maxLat.toString());
  }
  
  if (timeStart && timeEnd) {
    searchParams.set("timeStart", timeStart);
    searchParams.set("timeEnd", timeEnd);
  }
  
  window.location.href = `../html/table.html?${searchParams.toString()}`;
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
): Pair[] {
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

  // if advSearchBar is found then toggle the hidden class
  if (advSearchBar) {
    advSearchBar.classList.toggle("hidden");
  }
}

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
