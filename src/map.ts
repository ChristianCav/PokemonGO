// variable for global filter
let globalFilters: any[] | null = null;

// start the map at a default location
var map = L.map("map").setView([20, 0], 3);

// add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// display for the zoom level
const zoomControl = new L.Control({ position: "bottomleft" });

// creates a div for the zoom level display
zoomControl.onAdd = function () {
  const div = L.DomUtil.create("div", "zoom-display");
  div.innerHTML = `Zoom Level: ${map.getZoom()}`;
  return div;
};

// add the zoom control display to map
zoomControl.addTo(map);

// display the zoom level when the map is zoomed
map.on("zoomend", () => {
  const zoomDiv = document.querySelector(".zoom-display");
  if (zoomDiv) zoomDiv.innerHTML = `Zoom Level: ${map.getZoom()}`;
});

let pokedexData: Pokedex; // store the Pokedex data
let pokemonLocationData: Data; // store the pokemon location data

/**
 * Function to go to a specific country on the map and render the pokemon markers
 * function runs in O(n) time, as it loops through all the pokemon location data once
 * @param country the country to go to
 * @param filters filters to apply to the pokemon markers
 * @returns void
 */
function goToCountry(
  country: string,
  filters: any[] | null = globalFilters
): void {
  let startTime = performance.now();
  // clear the markers and polyline on the map
  clearMarkers();
  clearPolyline();

  // make sure the map is zoomed in enough, pervents overloading of the markers
  if (map.getZoom() > 3) {
    let location = (
      country ||
      (document.getElementById("countryInput") as HTMLInputElement).value
    )
      // generalize the input, makes input useable for the API
      .trim()
      .toLowerCase();
    // gives a error if input is invalid
    if (!location) {
      alert("Please enter a valid country name.");
      return;
    }

    // main rendering function for the map
    fetch(
      // geocoding API to get the coordinates of the country
      `https://nominatim.openstreetmap.org/search?country=${location}&format=json&addressdetails=1`
    )
      // waits for response, then changes it to format ts/js can read
      .then((response) => response.json())
      .then((data) => {
        // checks if data actually exists
        if (data.length > 0) {
          // get the lat and lng of the country and zoom map to it
          const lat: number = parseFloat(data[0].lat);
          const lng: number = parseFloat(data[0].lon);
          map.setView([lat, lng], map.getZoom());

          // get the data for the pokedex
          fetch("../DO_NOT_TOUCH/pokedex.json")
            // wait for response, then changes it to format to ts/js can read
            .then((response) => response.json())
            .then((pokedex) => {
              // save the response to a global variable
              pokedexData = pokedex;
              // get the data for the pokemon locations
              fetch("../DO_NOT_TOUCH/data.json")
                .then((response) => response.json())
                .then((locationData) => {
                  pokemonLocationData = locationData;
                  // waits for 500ms before loading markers, ensures the fetch actually fetches data before rendering the markers
                  setTimeout(() => {
                    renderPokemonMarkers(
                      pokedexData,
                      pokemonLocationData,
                      filters
                    );
                  }, 500);
                })
                // error for pokemon location data
                .catch((error) =>
                  console.error("Error loading pokemon location data:", error)
                );
            })
            // error for pokedex data
            .catch((error) =>
              console.error("Error loading Pokedex data:", error)
            );
        } else {
          // gives an alert if the country is not found for the API
          alert("Country not found. Try a different name.");
        }
      })
      // gives an error if the API does not load country data
      .catch((error) => {
        console.error("Failed to fetch country data. Please try again.", error);
      });
  } else {
    // gives an alert if the user does not zoom in enough
    alert("Please zoom in to at least level 4 before entering a country name.");
  }
  let endTime = performance.now();
  let time: Triplet = new Triplet("Go To Country: ", endTime - startTime, true);
  performanceTime.enqueue(time);
}

/**
 * function to render the pokemon markers on the map
 * function runs in O(n) time, as it loops through all the pokemon location data once
 * @param pokedex pokedex data
 * @param locationData location data
 * @param filters filters to apply to the pokemon markers
 */
function renderPokemonMarkers(
  pokedex: Pokedex,
  locationData: Data,
  filters?: any[] | null
): void {
  let startTime = performance.now();

  // clear the markers and polyline on the map
  clearMarkers();
  clearPolyline();

  // get the current bounds of the map (what is currently visible)
  const bounds = map.getBounds();

  // cycles through the length of location data
  for (let i = 0; i < locationData.pokemonId.length; i++) {
    // constant for the pokemonId
    const pokemonId: number = locationData.pokemonId[i];

    // ensures the pokemon is in gen 1 (as the data has up to gen 8)
    if (pokemonId >= 1 && pokemonId <= 149) {
      // set the lat, lng and time of the current pokemon
      const lat: number = locationData.latitude[i];
      const lng: number = locationData.longitude[i];
      const time: string = locationData.localTime?.[i];

      // if the bounds of the map does not contain the pokemon, skip it
      // contains is a method from leaflet that checks if the bounds of the map contains the coordinates
      // this is used to prevent overloading the map with markers
      if (!bounds.contains([lat, lng])) continue;

      // if the bounds do contain it, get the index of the pokemonId in the pokedex
      const index: number = pokedex.ids.indexOf(pokemonId);
      if (index === -1) continue;

      // get the name, image and id of the pokemon
      const name: string = pokedex.names_english[index];
      const image: string = pokedex.images[index];
      const id: number = pokedex.ids[index];

      // apply the filters the user inputted, ensure the filters exist and has parameters within it
      if (filters && filters.length > 0) {
        // set a constant for the first filter
        const f: any = filters[0];

        // name filter, if does not apply to current pokemon, skip it
        // sets name to lowercase to ensure filter is not case senstive
        if (f.name && !name.toLowerCase().includes(f.name.toLowerCase()))
          continue;

        // time filter, if does not apply to current pokemon, skip it
        if (f.fromTime && f.toTime && time) {
          const convertedTime = convert12to24(time); // Convert 12-hour to 24-hour
          // if the time is not in the range of the filter, skip it
          if (convertedTime < f.fromTime || convertedTime > f.toTime) continue;
        }

        // Latitude filter, if does not apply skip it
        if (f.fromLat && f.toLat) {
          // parse the latitude values to float, works with the decimals in the dataset
          const fromLat: number = parseFloat(f.fromLat);
          const toLat: number = parseFloat(f.toLat);
          if (lat < fromLat || lat > toLat) continue;
        }

        // Longitude filter
        if (f.fromLng && f.toLng) {
          // parse the longitude values to float, works with the decimals in the dataset
          const fromLng: number = parseFloat(f.fromLng);
          const toLng: number = parseFloat(f.toLng);
          if (lng < fromLng || lng > toLng) continue;
        }
      }

      //renders the marker by adding a new marker to the map
      // creates a popup for the marker, with the name, id, image and location of the pokemon
      const marker = `
        <div style="text-align:center;">
          <h3>${name} (#${id})</h3>
          <img src="${image}" alt="${name}" style="width:100px;height:auto;" />
          <p>Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
          <p>Time: ${time}</p>
        </div>
      `;

      // binds the marker to the map
      L.marker([lat, lng]).addTo(map).bindPopup(marker);
    }
  }
  let endTime = performance.now();
  let time: Triplet = new Triplet(
    "Render Pokemon Markers: ",
    endTime - startTime,
    false
  );
  performanceTime.enqueue(time);
}

/**
 * function to get the filters from the input fields and store them in the globalFilters variable
 * function runs in O(1) time, as it only does simple operations
 * @returns void
 */
function applyFilters(): void {
  let startTime = performance.now();
  // constants for the input fields
  const nameInput = document.getElementById("nameFilter") as HTMLInputElement;
  const fromTimeInput = document.getElementById(
    "fromTimeFilter"
  ) as HTMLInputElement;
  const toTimeInput = document.getElementById(
    "toTimeFilter"
  ) as HTMLInputElement;
  const fromLatInput = document.getElementById(
    "fromLatitudeFilter"
  ) as HTMLInputElement;
  const toLatInput = document.getElementById(
    "toLatitudeFilter"
  ) as HTMLInputElement;
  const fromLngInput = document.getElementById(
    "fromLongitudeFilter"
  ) as HTMLInputElement;
  const toLngInput = document.getElementById(
    "toLongitudeFilter"
  ) as HTMLInputElement;
  const countryInput = document.getElementById(
    "countryInput"
  ) as HTMLInputElement;

  // set the global filters to the values of the input fields
  globalFilters = [
    {
      // values are trimmed to pervent errors
      name: nameInput.value.trim(),
      fromTime: fromTimeInput.value.trim(),
      toTime: toTimeInput.value.trim(),
      fromLat: fromLatInput.value.trim(),
      toLat: toLatInput.value.trim(),
      fromLng: fromLngInput.value.trim(),
      toLng: toLngInput.value.trim(),
    },
  ];

  // ensures the user inputs a country, if not, gives an alert and returns
  if (countryInput.value.trim() === "") {
    alert("Please enter a valid country name.");
    return;
  } else {
    // runs the goToCountry function with the inputted country and the filters
    // this will ensure the filters are applied to the markers
    goToCountry(countryInput.value.trim(), globalFilters);
  }
  let endTime = performance.now();
  let time: Triplet = new Triplet("Apply Filters:", endTime - startTime, false);
  performanceTime.enqueue(time);
}

/**
 * function to clear the markers on the map
 * function runs in O(n) time, as it loops through all the layers on the map
 * for our purposes, this is O(1) as we only have 1 marker at a time
 */
function clearMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

/**
 * function to clear the polyline on the map
 * function runs in O(n) time, as it loops through all the layers on the map
 * for our purposes, this is O(1) as we only have 1 polyline at a time
 */
function clearPolyline() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
}

/**
 * function to convert 12 hour format to 24 hour format
 * function runs in O(1) time, as it only does simple operations
 * @param time12h time in 12 hour format (eg. "11:23:40 AM")
 * @returns time in 24 hour format (eg. "23:23:40")
 */

function convert12to24(time12h: string): string {
  // Split 12 hour format into its components
  let [time, AMorPM] = time12h.split(" ");
  let [hours, minutes, seconds] = time.split(":");

  // Convert hours to 24-hour format, converts the string to numbers
  if (AMorPM === "PM" && parseInt(hours) < 12) {
    hours = (parseInt(hours) + 12).toString();
  }
  if (AMorPM === "AM" && parseInt(hours) === 12) {
    hours = "00";
  }

  // Return the time in 24-hour format
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * function to toggle the instructions on and off
 */
function toggleInstructions(): void {
  const instructions = document.querySelector(
    ".instructions"
  ) as HTMLElement | null;

  if (instructions) {
    instructions.classList.toggle("hidden");
  }
}

/**
 * function to get the shortest distance to catch x number of pokemons of the same type from the users inputted coordinates (1km = $1)
 * function runs in O(n^2) time, as it loops through all the pokemon location data for each pokemon
 * @returns void
 */
function shortestCandyDist(): void {
  let startTime = performance.now();
  // get user inputs
  const latInput: number = parseFloat(
    (document.getElementById("candiesLatitudeFilter") as HTMLInputElement).value
  );
  const lngInput: number = parseFloat(
    (document.getElementById("candiesLongitudeFilter") as HTMLInputElement).value
  );
  const candiesPokemon: string = (
    (document.getElementById("candiesPokemon") as HTMLInputElement).value || ""
  )
    .trim()
    .toLowerCase();
  const numOfPokemons: number = parseInt(
    (document.getElementById("numberOfPokemons") as HTMLInputElement).value
  );

  // ensure inputs are actually there
  if (
    isNaN(latInput) ||
    isNaN(lngInput) ||
    isNaN(numOfPokemons) ||
    !candiesPokemon
  ) {
    alert("Please enter valid coordinates, pokemon name, and number");
    return;
  }

  // set map view and clear previous elements
  map.setView([latInput, lngInput], map.getZoom());
  clearMarkers();
  clearPolyline();

  // add starting point marker
  const startMarker = L.marker([latInput, lngInput]).addTo(map);
  startMarker.bindPopup(`
    <div style="text-align:center;">
      <h3>Start Location</h3>
      <p>${latInput.toFixed(4)}, ${lngInput.toFixed(4)}</p>
    </div>
  `);

  // get the data for the pokedex and pokemon locations
  fetch("../DO_NOT_TOUCH/pokedex.json")
    .then((response) => response.json())
    .then((pokedex) => {
      pokedexData = pokedex;
      return fetch("../DO_NOT_TOUCH/data.json");
    })
    .then((response) => response.json())
    .then((locationData) => {
      pokemonLocationData = locationData;

      // constants for the path and current location
      const pathCoordinates: CoordList = new CoordList([latInput, lngInput]);
      let currentLat: number = latInput;
      let currentLng: number = lngInput;
      let totalDistance: number = 0;
      let foundCount: number = 0;
      // stores the indices of caught pokemon
      const caughtIndices: CaughtIndices = new CaughtIndices(numOfPokemons);
      // stores the target pokemon ID once found
      let targetPokemonId: number | null = null;

      // loop while the number of found pokemon is less than the number of pokemon to find
      while (foundCount < numOfPokemons) {
        let closestIndex: number = -1;
        let minDistance: number = Infinity;
        let closestPokemon: PokemonCoordWithDistance | null = null;

        // find nearest matching pokemon that hasn't been caught yet
        for (let i = 0; i < pokemonLocationData.pokemonId.length; i++) {
          // skip already caught spawn points
          if (caughtIndices.containsSpawn(i)) continue;

          const pokemonId: number = pokemonLocationData.pokemonId[i];
          const index: number = pokedexData.ids.indexOf(pokemonId);

          // if the index exists, get the species of the pokemon
          if (index !== -1) {
            const species: string = pokedexData.names_english[index];
            
            // find pokemon id if not already found
            if (targetPokemonId === null && species.toLowerCase().includes(candiesPokemon)) {
              targetPokemonId = pokemonId;
            }
            
            // only consider exact matches to the target pokemon ID
            if (pokemonId === targetPokemonId) {
              const pokemonLat: number = pokemonLocationData.latitude[i];
              const pokemonLng: number = pokemonLocationData.longitude[i];
              // calculate distance from current location to pokemon
              const distance = map.distance(
                [currentLat, currentLng],
                [pokemonLat, pokemonLng]
              );

              // if the distance is less than the current minimum distance, set the closest pokemon
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
                closestPokemon = new PokemonCoordWithDistance(
                  pokemonLat,
                  pokemonLng,
                  distance,
                  species
                );
              }
            }
          }
        }

        // if no matching pokemon is found, break the loop
        if (!closestPokemon) break;

        // update path, markers, and counter
        foundCount++;
        totalDistance += closestPokemon.distance;
        // set the current location to the closest pokemon
        currentLat = closestPokemon.lat;
        currentLng = closestPokemon.lng;
        pathCoordinates.add(currentLat, currentLng);
        caughtIndices.add(closestIndex, pokemonLocationData.pokemonId[closestIndex]);

        // get pokemon image
        const pokemonIndex: number = pokedexData.ids.indexOf(
          pokemonLocationData.pokemonId[closestIndex]
        );
        const image: string = pokedexData.images[pokemonIndex];

        // add marker to the map with debug info
        console.log(`Caught #${foundCount}: ${closestPokemon.species} (ID: ${pokemonLocationData.pokemonId[closestIndex]}) at index ${closestIndex}`);
        
        L.marker([currentLat, currentLng]).addTo(map).bindPopup(`
          <div style="text-align:center;">
            <img src="${image}" width="96" height="96">
            <h3>${closestPokemon.species} (#${foundCount})</h3>
            <p>Distance: ${
              parseFloat(closestPokemon.distance.toFixed(2)) / 1000
            }km</p>
            <p>Total: $${(totalDistance / 1000).toFixed(2)}</p>
          </div>
        `);
      }

      // draw path on the map if there are more than 1 coordinate in there
      if (pathCoordinates.size() > 1) {
        L.polyline(pathCoordinates.toLeafletPath(), {
          color: "blue",
          weight: 3,
        }).addTo(map);
      }

      // show results as a alert
      if (foundCount > 0) {
        alert(
          `Found ${foundCount} ${candiesPokemon}\nTotal distance: ${(
            totalDistance / 1000
          ).toFixed(2)}km\nCost: $${(totalDistance / 1000).toFixed(2)}`
        );
        console.log(
          `Found ${foundCount} ${candiesPokemon}\nTotal distance: ${(
            totalDistance / 1000
          ).toFixed(2)}km\nCost: $${(totalDistance / 1000).toFixed(2)}`
        );
      } else {
        alert(`No ${candiesPokemon} found in the area`);
        console.log(`No ${candiesPokemon} found in the area`);
      }
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      alert("Failed to load pokemon data");
    });

  let endTime = performance.now();
  let time: Triplet = new Triplet(
    "Shortest Candy Distance: ",
    endTime - startTime,
    true
  );
  performanceTime.enqueue(time);
}

/**
 * function to find the shortest distance to catch all the pokemons from the user inputted coordinates (1km = $1)
 * function runs in O(n^2) time, as it loops through all the pokemon location data for each pokemon
 * @returns void
 */
function shortestDist(): void {
  let startTime = performance.now();
  // constants for the user inputted coordinates
  const startLat: number = parseFloat(
    (document.getElementById("SDLatitudeFilter") as HTMLInputElement).value
  );
  const startLng: number = parseFloat(
    (document.getElementById("SDLongitudeFilter") as HTMLInputElement).value
  );

  // ensure the user inputted coordinates are valid
  if (isNaN(startLat) || isNaN(startLng)) {
    alert("Please enter valid coordinates");
    return;
  }

  // clear the markers and polyline on the map
  clearMarkers();
  clearPolyline();

  // set the map view to the user inputted coordinates and zoom level
  map.setView([startLat, startLng], map.getZoom());
  const startMarker = L.marker([startLat, startLng]).addTo(map);
  startMarker.bindPopup(`
    <div style="text-align:center;">
      <h3>Start Location</h3>
      <p>${startLat.toFixed(4)}, ${startLng.toFixed(4)}</p>
    </div>
  `);

  // get the data for the pokedex and pokemon locations
  fetch("../DO_NOT_TOUCH/pokedex.json")
    .then((response) => response.json())
    .then((pokedex) => {
      pokedexData = pokedex;
      return fetch("../DO_NOT_TOUCH/data.json");
    })
    .then((response) => response.json())
    .then((locationData) => {
      pokemonLocationData = locationData;

      // create a list of all unique pokemon using their ID and pokemon names
      const pokemonToCatch = new PokemonToCatch();
      for (let id = 1; id <= 149; id++) {
        for (let i = 0; i < pokedexData.ids.length; i++) {
          if (pokedexData.ids[i] === id) {
            pokemonToCatch.add(id, pokedexData.names_english[i]);
            break;
          }
        }
      }

      // create a list of all the pokemon coordinates
      const pathCoordinates: CoordList = new CoordList([startLat, startLng]);
      let currentLat: number = startLat;
      let currentLng: number = startLng;
      let totalDistance: number = 0;
      // stores the indices of caught pokemons
      const caughtIndices: CaughtIndices = new CaughtIndices(149);

      // while we haven't caught all pokemon
      while (caughtIndices.size() < 149) {
        let closestPokemon: PokemonCoordWithDistance | null = null;
        let closestPokemonIndex: number = -1;
        let closestPokemonDataIndex: number = -1;
        let minDistance: number = Infinity;

        // find the closest remaining pokemon
        for (let i = 0; i < pokemonLocationData.pokemonId.length; i++) {
          // skip already caught spawn points
          if (caughtIndices.containsSpawn(i)) continue;

          const pokemonId: number = pokemonLocationData.pokemonId[i];
          const pokedexIndex: number = pokedexData.ids.indexOf(pokemonId);

          // only consider the first 149 pokemons and ones we haven't caught yet
          if (pokedexIndex !== -1 && pokemonId <= 149 && !caughtIndices.containsPokemon(pokemonId)) {
            const pokemonLat: number = pokemonLocationData.latitude[i];
            const pokemonLng: number = pokemonLocationData.longitude[i];
            const distance: number = map.distance(
              [currentLat, currentLng],
              [pokemonLat, pokemonLng]
            );

            // if the distance is less than the current minimum distance, set the closest pokemon
            if (distance < minDistance) {
              minDistance = distance;
              closestPokemon = new PokemonCoordWithDistance(
                pokemonLat,
                pokemonLng,
                distance,
                pokedexData.names_english[pokedexIndex]
              );
              closestPokemonIndex = i;
              closestPokemonDataIndex = pokedexIndex;
            }
          }
        }

        // if no matching pokemon is found, break the loop
        if (!closestPokemon) break;

        // update path and markers
        caughtIndices.add(closestPokemonIndex, pokemonLocationData.pokemonId[closestPokemonIndex]);
        totalDistance += closestPokemon.distance;
        currentLat = closestPokemon.lat;
        currentLng = closestPokemon.lng;
        pathCoordinates.add(currentLat, currentLng);

        // log the caught pokemon
        console.log(`Caught #${caughtIndices.size()}: ${closestPokemon.species} (ID: ${pokemonLocationData.pokemonId[closestPokemonIndex]}) at index ${closestPokemonIndex}`);

        // add marker to map
        L.marker([currentLat, currentLng]).addTo(map).bindPopup(`
          <div style="text-align:center;">
            <img src="${
              pokedexData.images[closestPokemonDataIndex]
            }" width="96" height="96">
            <h3>${closestPokemon.species} (#${caughtIndices.size()})</h3>
            <p>Distance: ${(closestPokemon.distance / 1000).toFixed(2)}km</p>
            <p>Total: $${(totalDistance / 1000).toFixed(2)}</p>
          </div>
        `);
      }

      // draw path if we caught at least one pokemon
      if (pathCoordinates.size() > 1) {
        L.polyline(pathCoordinates.toLeafletPath(), {
          color: "red",
          weight: 3,
        }).addTo(map);
      }

      alert(
        `Caught ${caughtIndices.size()} unique pokemon\nTotal distance: ${(
          totalDistance / 1000
        ).toFixed(2)}km\nCost: $${(totalDistance / 1000).toFixed(2)}`
      );
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
    let endTime = performance.now();
    let time : Triplet = new Triplet("Shortest Distance to Catch All Pokemons", endTime-startTime, true)
    performanceTime.enqueue(time);
}
/**
 * function to find the nearest pokemon to the given coordinates, helper function for shortestDIst and shortestCandyDist
 * functions runs in O(n) time, as it loops through all the pokemon location data once
 * @param lat latitude coordinates of the inputted location
 * @param lng longitude coordinates of the inputted location
 * @param targetPokemon pokemon name to find
 * @returns returns the closest pokemon coordinates and distance from the inputted location
 *          or null if no pokemon is found
 */
function findNearestPokemon(
  lat: number,
  lng: number,
  targetPokemon: string
): PokemonCoordWithDistance | null {
  
  // variables to store the closest pokemon
  let closest: PokemonCoordWithDistance | null = null;
  let minDistance: number = Infinity;

  // loops through the pokemon location data and finds the closest pokemon to the user inputted coordinates
  for (let i = 0; i < pokemonLocationData.pokemonId.length; i++) {
    const pokemonId: number = pokemonLocationData.pokemonId[i];
    const index: number = pokedexData.ids.indexOf(pokemonId);

    // if the index exists, get the species of the pokemon
    if (index !== -1) {
      const species: string = pokedexData.names_english[index];
      // if the species of pokemon equals that of the target pokemon, get the lat and lng of the pokemon
      if (species.toLowerCase() === targetPokemon.toLowerCase()) {
        const pokemonLat: number = pokemonLocationData.latitude[i];
        const pokemonLng: number = pokemonLocationData.longitude[i];
        // calculate the distance from the inputted coordinates to the pokemon coordinates, map.distance is a method that uses the haversine formula to calculate the distance between two points on the earth
        const distance: number = map.distance(
          [lat, lng],
          [pokemonLat, pokemonLng]
        );

        // if the distance is less than the current minimum distance, set the closest pokemon to the current pokemon
        if (distance < minDistance) {
          minDistance = distance;
          closest = new PokemonCoordWithDistance(
            pokemonLat,
            pokemonLng,
            distance,
            species
          );
        }
      }
    }
  }
  return closest;
}