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

let currentRuntimeIndex: number = 0; // Keeps track of which runtime we’re displaying

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

function handleSearchClick(): void {
  const input = document.getElementById("searchBar") as HTMLInputElement | null;
  
  // Get advanced search parameters
  const minLongitude = (document.getElementById("minLongitude") as HTMLInputElement)?.value;
  const maxLongitude = (document.getElementById("maxLongitude") as HTMLInputElement)?.value;
  const minLatitude = (document.getElementById("minLatitude") as HTMLInputElement)?.value;
  const maxLatitude = (document.getElementById("maxLatitude") as HTMLInputElement)?.value;
  const timeStart = (document.getElementById("timePickerStart") as HTMLInputElement)?.value;
  const timeEnd = (document.getElementById("timePickerEnd") as HTMLInputElement)?.value;
  // Get type filter from your existing dropdown
  const typeFilter = (document.getElementById("typeInput") as HTMLSelectElement)?.value;
  
  // If no input, return
  if (!input) return;
  
  // Get val of input and trim
  const query = input.value.trim();
  
  // Build the URL with search parameters
  let searchParams = new URLSearchParams();
  searchParams.set("page", "1"); // Always start with page 1 for a new search
  
  // Add name search if provided
  if (query.length > 0) {
    searchParams.set("search", query);
  }
  
  // Add type filter if provided
  if (typeFilter) {
    searchParams.set("type", typeFilter);
  }
  
  // Rest of your validation code for coordinates and times
  // ...
  
  // Add coordinate filters if both min and max are provided
  if (minLongitude && maxLongitude) {
    // Validate longitude values
    const minLong = parseFloat(minLongitude);
    const maxLong = parseFloat(maxLongitude);
    
    if (isNaN(minLong) || isNaN(maxLong)) {
      alert("Longitude values must be numbers.");
      return;
    }
    
    if (minLong < -180 || minLong > 180 || maxLong < -180 || maxLong > 180) {
      alert("Longitude values must be between -180 and 180.");
      return;
    }
    
    searchParams.set("minLong", minLongitude);
    searchParams.set("maxLong", maxLongitude);
  } else if (minLongitude || maxLongitude) {
    alert("Please enter both minimum and maximum longitude values.");
    return;
  }
  
  if (minLatitude && maxLatitude) {
    // Validate latitude values
    const minLat = parseFloat(minLatitude);
    const maxLat = parseFloat(maxLatitude);
    
    if (isNaN(minLat) || isNaN(maxLat)) {
      alert("Latitude values must be numbers.");
      return;
    }
    
    if (minLat < -90 || minLat > 90 || maxLat < -90 || maxLat > 90) {
      alert("Latitude values must be between -90 and 90.");
      return;
    }
    
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

// populates the table with the search results
function populateTableWithResults(data: Data): void {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);

  if (page !== "table.html") return;

  const tableBody = document.getElementById("pokemonTableBody");
  if (!tableBody) return;

  const urlParams = new URLSearchParams(window.location.search);

  // All filters from URL
  const searchQuery = urlParams.get("search");
  const typeFilter = urlParams.get("type");
  const minLong = parseFloat(urlParams.get("minLong") || "");
  const maxLong = parseFloat(urlParams.get("maxLong") || "");
  const minLat = parseFloat(urlParams.get("minLat") || "");
  const maxLat = parseFloat(urlParams.get("maxLat") || "");
  const timeStart = urlParams.get("timeStart");
  const timeEnd = urlParams.get("timeEnd");
  const currentPage = parseInt(urlParams.get("page") || "1", 10);

  let baseIndexes: number[] = Array.from({ length: data.latitude.length }, (_, i) => i);

  // Filter by name
  if (searchQuery) {
    const nameIndexes = filterName(searchQuery, sortedData.names_english.key)
      .map(i => sortedData.names_english.val[i]);
    baseIndexes = baseIndexes.filter(i => nameIndexes.includes(i));
  }
  
  // Filter by type (expects indexes)
  if (typeFilter) {
    const typeIndexes = filterType(baseIndexes, typeFilter); // gets relative indexes
    baseIndexes = typeIndexes.map(i => baseIndexes[i]); // convert back to absolute indexes
  }
  
  // Filter by coordinates
  if (!isNaN(minLong) && !isNaN(maxLong) && !isNaN(minLat) && !isNaN(maxLat)) {
    baseIndexes = baseIndexes.filter(i =>
      data.longitude[i] >= minLong &&
      data.longitude[i] <= maxLong &&
      data.latitude[i] >= minLat &&
      data.latitude[i] <= maxLat
    );
  }
  
  // Filter by time (expects localTime: string[])
  if (timeStart && timeEnd) {
    const filteredByTime = filterTimes(
      baseIndexes.map(i => data.localTime[i]), // create a filtered string[] from indexes
      timeStart,
      timeEnd
    );
    baseIndexes = filteredByTime.map(i => baseIndexes[i]); // map back to absolute indexes
  }  

  const resultsPerPage = 100;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, baseIndexes.length);
  const currentPageResults = baseIndexes.slice(startIndex, endIndex);

  // Page info
  const pageInfo = document.getElementById("pageInfo");
  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(baseIndexes.length / resultsPerPage)}`;
  }

  updatePaginationButtons(currentPage, baseIndexes.length, resultsPerPage, searchQuery || "");

  // Step 8: Display the results
  tableBody.innerHTML = "";

  for (const index of currentPageResults) {
    const name = sortedData.names_english.key[sortedData.names_english.val.indexOf(index)];
    const type = Array.isArray(data2.types[index]) ? data2.types[index].join("/") : data2.types[index];
    const longitude = data.longitude[index]?.toFixed(4) ?? "-";
    const latitude = data.latitude[index]?.toFixed(4) ?? "-";
    const time = data.localTime[index] ?? "-";

    tableBody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${type}</td>
        <td>${longitude}</td>
        <td>${latitude}</td>
        <td>${time}</td>
      </tr>
    `;
  }
}

// Helper function to convert HTML time input format (HH:MM) to the format needed by filterTimes (HH:MM:00 AM/PM)
function formatTimeForFilter(timeString: string): string {
  // Handle input with or without seconds (e.g., "14:23" or "14:23:45")
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  // Convert to 12-hour format with AM/PM
  let period = "AM";
  let hours12 = hours;

  if (hours >= 12) {
    period = "PM";
    hours12 = hours === 12 ? 12 : hours - 12;
  }

  if (hours12 === 0) {
    hours12 = 12;
  }

  // Always set seconds to 00
  return `${hours12}:${minutes.toString().padStart(2, '0')}:00 ${period}`;
}

// update the pagination buttons
// @param currentPage holds the current page
// @param totalResults holds the total num of results
// @param resultsPerPage holds the num of results per page
// @param searchQuery holds the search query
function updatePaginationButtons(
  currentPage: number,
  totalResults: number,
  resultsPerPage: number,
  searchQuery: string
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
      navigateToPage(currentPage - 1, searchQuery);
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
      navigateToPage(currentPage + 1, searchQuery);
    });
    paginationContainer.appendChild(nextButton);
  }
}

// function to navigate to the specified page
function navigateToPage(pageNumber: number, searchQuery: string): void {
  const encodedQuery = encodeURIComponent(searchQuery);
  window.location.href = `../html/table.html?search=${encodedQuery}&page=${pageNumber}`;
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
  console.log(performanceTime)
    const container = document.querySelector(".runtimeDisplay") as HTMLElement;
    
    // If queue is empty, show message and disable button
    if (performanceTime.isEmpty()) {
        container.innerHTML = "No more runtime data to display";
        const button = document.getElementById("runtimeButton") as HTMLButtonElement;
        button.disabled = true;
        return;
    }

    let output = "";
    let firstIteration = true;
    
    // Process until we find a main function (after the first one)
    while (!performanceTime.isEmpty()) {
        const current = performanceTime.peek() as Triplet;
        
        // If we hit another main function after the first one, stop
        if (!firstIteration && current.main) {
            break;
        }
        
        // Remove and process the item
        const item = performanceTime.dequeue() as Triplet;
        output += `Function: ${item.key} — Time: ${item.val.toFixed(2)} ms<br>`;
        
        // Mark that we've passed the first iteration
        if (item.main) {
            firstIteration = false;
        }
    }
    
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