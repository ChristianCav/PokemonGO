// variable for global filter
let globalFilters: any[] | null = null;

// variable for the current name filter
let activeNameFilter: string | null = null;

// variable for the current time filter
let activeTimeFilter: {
  from: string | null;
  to: string | null;
} = { from: null, to: null };

// variable for the current coords filter
let activeCoordFilter: {
  fromLat: number | null;
  toLat: number | null;
  fromLng: number | null;
  toLng: number | null;
} = {
  fromLat: null,
  toLat: null,
  fromLng: null,
  toLng: null,
};

// pokemon coordinates closest to the user inputted coordinates
let pokemonCoords: PokemonCoordWithDistance[] = [];

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

let pokedexData: Pokedex; // Store the Pokedex data
let pokemonLocationData: Data; // Store the pokemon location data

// function that zooms into the country of input
function goToCountry(country: string, filters: any[] | null = globalFilters) {
  // make sure the map is zoomed in enough, pervents overloading of the markers

  clearMarkers();
  clearPolyline();

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
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
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
}

// function that displays all the pokemon markers
function renderPokemonMarkers(
  pokedex: Pokedex,
  locationData: Data,
  filters?: any[] | null
) {
  // clear the markers
  clearMarkers();

  // get the current bounds of the map (what is currently visible)
  const bounds = map.getBounds();

  // cycles through the length of location data
  for (let i = 0; i < locationData.pokemonId.length; i++) {
    // constant for the pokemonId
    const pokemonId = locationData.pokemonId[i];

    // ensures the pokemon is in gen 1 (as the data has up to gen 8)
    if (pokemonId >= 1 && pokemonId <= 149) {
      // set the lat, lng and time of the current pokemon
      const lat = locationData.latitude[i];
      const lng = locationData.longitude[i];
      const time = locationData.localTime?.[i];

      // if the bounds of the map does not contain the pokemon, skip it
      if (!bounds.contains([lat, lng])) continue;

      // if the bounds do contain it, get the index of the pokemonId in the pokedex
      const index = pokedex.ids.indexOf(pokemonId);
      if (index === -1) continue;

      // get the name, image and id of the pokemon
      const name = pokedex.names_english[index];
      const image = pokedex.images[index];
      const id = pokedex.ids[index];

      // apply the filters the user inputted, ensure the filters exist and has parameters within it
      if (filters && filters.length > 0) {
        // set a constant for the first filter
        const f = filters[0];

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
          const fromLat = parseFloat(f.fromLat);
          const toLat = parseFloat(f.toLat);
          if (lat < fromLat || lat > toLat) continue;
        }

        // Longitude filter
        if (f.fromLng && f.toLng) {
          // parse the longitude values to float, works with the decimals in the dataset
          const fromLng = parseFloat(f.fromLng);
          const toLng = parseFloat(f.toLng);
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
}

// function that receives the users filters and applies it
function applyFilters() {
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
}

// clears the markers on the map
function clearMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

// clears the polyline on the map
function clearPolyline() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
}

// converts 12 hours to 24 hours time
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

// class to represent pokemon coordinates with distance and species
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

// function just to toggle visibility of instructions
function toggleInstructions(): void {
  const instructions = document.querySelector(
    ".instructions"
  ) as HTMLElement | null;

  if (instructions) {
    instructions.classList.toggle("hidden");
  }
}

// gets the shortest distance to a pokemon from the point user inputted
function shortestCandyDist(): void {
  // get user inputs
  const latInput: number = parseFloat(
    (document.getElementById("candiesLatitudeFilter") as HTMLInputElement).value
  );
  const lngInput: number = parseFloat(
    (document.getElementById("candiesLongitudeFilter") as HTMLInputElement)
      .value
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
      const pathCoordinates: [number, number][] = [[latInput, lngInput]];
      let currentLat = latInput;
      let currentLng = lngInput;
      let totalDistance = 0;
      let foundCount = 0;
      // stores the indices of caught pokemon
      // this is used to ensure the same pokemon is not caught multiple times
      const caughtIndices = new Array<number>();

      // loop while the number of found pokemon is less than the number of pokemon to find
      while (foundCount < numOfPokemons) {
        let closestIndex = -1;
        let minDistance = Infinity;
        let closestPokemon: PokemonCoordWithDistance | null = null;

        // find nearest matching pokemon that hasn't been caught yet
        for (let i = 0; i < pokemonLocationData.pokemonId.length; i++) {
          // skip already caught pokemon
          if (caughtIndices.indexOf(i) !== -1) continue;

          const pokemonId = pokemonLocationData.pokemonId[i];
          const index = pokedexData.ids.indexOf(pokemonId);

          // if the index exists, get the species of the pokemon
          if (index !== -1) {
            const species = pokedexData.names_english[index];
            if (species.toLowerCase().includes(candiesPokemon)) {
              const pokemonLat = pokemonLocationData.latitude[i];
              const pokemonLng = pokemonLocationData.longitude[i];
              // calculate distance from current location to pokemon
              // using the map's distance method
              const distance = map.distance(
                [currentLat, currentLng],
                [pokemonLat, pokemonLng]
              );

              // if the distance is less than the current minimum distance, set the closest pokemon to the current pokemon
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
        pathCoordinates.push([currentLat, currentLng]);
        caughtIndices.push(closestIndex);

        // get pokemon image
        const pokemonIndex = pokedexData.ids.indexOf(
          pokemonLocationData.pokemonId[closestIndex]
        );
        const image = pokedexData.images[pokemonIndex];

        // add marker to the map
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
      if (pathCoordinates.length > 1) {
        L.polyline(pathCoordinates, { color: "blue", weight: 3 }).addTo(map);
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
}

// function that gets the shortest distance to catch all 149 pokmeons in order from the point user inputted
function shortestDist(): void {
  // constants for the user inputted coordinates
  const startLat = parseFloat(
    (document.getElementById("SDLatitudeFilter") as HTMLInputElement).value
  );
  const startLng = parseFloat(
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
      const pokemonToCatch: { id: number; species: string }[] = []; // array of objects, best to store as I need the info together
      for (let id = 1; id <= 149; id++) {
        const index = pokedexData.ids.indexOf(id);
        if (index !== -1) {
          pokemonToCatch.push({
            id,
            species: pokedexData.names_english[index],
          });
        }
      }

      // create a list of all the pokemon coordinates
      const pathCoordinates: [number, number][] = [[startLat, startLng]];
      let currentLat = startLat;
      let currentLng = startLng;
      let totalDistance = 0;
      const caughtIndices: number[] = [];

      // while we haven't caught all pokemon
      while (caughtIndices.length < pokemonToCatch.length) {
        let closestPokemon: PokemonCoordWithDistance | null = null;
        let closestPokemonIndex = -1;
        let closestPokemonDataIndex = -1;
        let minDistance = Infinity;

        // Find the closest remaining pokemon
        for (let i = 0; i < pokemonLocationData.pokemonId.length; i++) {
          if (caughtIndices.indexOf(i) !== -1) continue;

          const pokemonId = pokemonLocationData.pokemonId[i];
          const pokedexIndex = pokedexData.ids.indexOf(pokemonId);

          // Only consider Gen 1 pokemon
          if (pokedexIndex !== -1 && pokemonId <= 149) {
            const pokemonLat = pokemonLocationData.latitude[i];
            const pokemonLng = pokemonLocationData.longitude[i];
            const distance = map.distance(
              [currentLat, currentLng],
              [pokemonLat, pokemonLng]
            );

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

        if (!closestPokemon) break;

        // Update path and markers
        caughtIndices.push(closestPokemonIndex);
        totalDistance += closestPokemon.distance;
        currentLat = closestPokemon.lat;
        currentLng = closestPokemon.lng;
        pathCoordinates.push([currentLat, currentLng]);

        // Add marker
        L.marker([currentLat, currentLng]).addTo(map).bindPopup(`
          <div style="text-align:center;">
            <img src="${
              pokedexData.images[closestPokemonDataIndex]
            }" width="96" height="96">
            <h3>${closestPokemon.species} (#${caughtIndices.length})</h3>
            <p>Distance: ${(closestPokemon.distance / 1000).toFixed(2)}km</p>
            <p>Total: $${(totalDistance / 1000).toFixed(2)}</p>
          </div>
        `);
      }

      // Draw path if we caught at least one pokemon
      if (pathCoordinates.length > 1) {
        L.polyline(pathCoordinates, { color: "red", weight: 3 }).addTo(map);
      }

      alert(
        `Caught ${caughtIndices.length} pokemon\nTotal distance: ${(
          totalDistance / 1000
        ).toFixed(2)}km\nCost: $${(totalDistance / 1000).toFixed(2)}`
      );
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
}

// function to find the nearest pokemon to the given coordinates, helper function for shortestDIst and shortestCandyDist
function findNearestPokemon(
  lat: number,
  lng: number,
  targetPokemon: string
): PokemonCoordWithDistance | null {
  // variables to store the closest pokemon
  let closest: PokemonCoordWithDistance | null = null;
  let minDistance = Infinity;

  // loops through the pokemon location data and finds the closest pokemon to the user inputted coordinates
  for (let i = 0; i < pokemonLocationData.pokemonId.length; i++) {
    const pokemonId = pokemonLocationData.pokemonId[i];
    const index = pokedexData.ids.indexOf(pokemonId);

    // if the index exists, get the species of the pokemon
    if (index !== -1) {
      const species = pokedexData.names_english[index];
      // if the species of pokemon equals that of the target pokemon, get the lat and lng of the pokemon
      if (species.toLowerCase() === targetPokemon.toLowerCase()) {
        const pokemonLat = pokemonLocationData.latitude[i];
        const pokemonLng = pokemonLocationData.longitude[i];
        const distance = map.distance([lat, lng], [pokemonLat, pokemonLng]);

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

  let pathCoordinates : List<PokemonCoordWithDistance> = new List<PokemonCoordWithDistance>();
  // input mon, starting latitude, longitude, numtargets
  let path : List<Pair> = grindingCandies(candiesPokemon, latInput, lngInput, numOfPokemons);
  for(let i=path.size()-1; i>=0; i--){
    let cur : Pair = path.get(i) as Pair
    let distance : number = cur.val;
    pathCoordinates.push(new PokemonCoordWithDistance(data.latitude[cur.key], data.longitude[cur.key], distance, candiesPokemon));
  }
  let latlng : [number, number][] = []
  for (let i = 0; i < pathCoordinates.size(); i++) {
    let pokemon : PokemonCoordWithDistance = pathCoordinates.get(i) as PokemonCoordWithDistance;
    let lat : number = pokemon.lat;
    let lng : number = pokemon.lng;
    let distance : number = pokemon.distance;
    let species : string = pokemon.species;

    const popupContent = `
      <div style="text-align:center;">
        <h3>${species}</h3>
        <p>Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        <p>Distance: ${distance.toFixed(2)} meters</p>
      </div>
    `;
    latlng.push([lat, lng]) // dont know if this data structure is nessasary for the polyline // must use push
    L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
  }
  // Create a polyline connecting the closest Pokémon
  L.polyline(latlng, { color: 'blue', weight: 3 }).addTo(map);
}


