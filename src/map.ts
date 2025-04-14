// some global variables
let activeNameFilter: string | null = null;
let globalFilters: any[] | null = null;

let activeTimeFilter: {
  from: string | null;
  to: string | null;
} = { from: null, to: null };

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

// start the map at a default location
var map = L.map("map").setView([20, 0], 3);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const zoomControl = new L.Control({ position: "bottomleft" });

zoomControl.onAdd = function () {
  const div = L.DomUtil.create("div", "zoom-display");
  div.innerHTML = `Zoom Level: ${map.getZoom()}`;
  return div;
};

zoomControl.addTo(map);

map.on("zoomend", () => {
  const zoomDiv = document.querySelector(".zoom-display");
  if (zoomDiv) zoomDiv.innerHTML = `Zoom Level: ${map.getZoom()}`;
});

let pokedexData: Pokedex; // Store the Pokedex data
let pokemonLocationData: Data; // Store the Pokémon location data

function goToCountry(country: string, filters: any[] | null = globalFilters) {
  if (map.getZoom() > 3) {
    let location = (
      country ||
      (document.getElementById("countryInput") as HTMLInputElement).value
    )
      .trim()
      .toLowerCase();
    if (!location) {
      alert("Please enter a valid country name.");
      return;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?country=${location}&format=json&addressdetails=1`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          map.setView([lat, lng], map.getZoom());

          fetch("../DO_NOT_TOUCH/pokedex.json")
            .then((response) => response.json())
            .then((pokedex) => {
              pokedexData = pokedex;
              fetch("../DO_NOT_TOUCH/data.json")
                .then((response) => response.json())
                .then((locationData) => {
                  pokemonLocationData = locationData;

                  setTimeout(() => {
                    renderPokemonMarkers(
                      pokedexData,
                      pokemonLocationData,
                      filters
                    );
                  }, 500);
                })
                .catch((error) =>
                  console.error("Error loading Pokémon location data:", error)
                );
            })
            .catch((error) =>
              console.error("Error loading Pokedex data:", error)
            );
        } else {
          alert("Country not found. Try a different name.");
        }
      })
      .catch((err) => {
        console.error("Geocoding error:", err);
        alert("Something went wrong. Try again later.");
      });
  } else {
    alert("Please zoom in to at least level 4 before entering a country name.");
  }
}

function renderPokemonMarkers(
  pokedex: Pokedex,
  locationData: Data,
  filters?: any[] | null
) {
  clearMarkers();

  const bounds = map.getBounds();

  for (let i = 0; i < locationData.pokemonId.length; i++) {
    const pokemonId = locationData.pokemonId[i];

    if (pokemonId >= 1 && pokemonId <= 151) {
      const lat = locationData.latitude[i];
      const lng = locationData.longitude[i];
      const time = locationData.localTime?.[i];

      if (!bounds.contains([lat, lng])) continue;

      const index = pokedex.ids.indexOf(pokemonId);
      if (index === -1) continue;

      const name = pokedex.names_english[index];
      const image = pokedex.images[index];
      const id = pokedex.ids[index];

      // Filtering
      if (filters && filters.length > 0) {
        const f = filters[0];

        // Name filter
        if (f.name && !name.toLowerCase().includes(f.name.toLowerCase()))
          continue;

        // Time filter
        if (f.fromTime && f.toTime && time) {
          const convertedTime = convert12to24(time); // Convert 12-hour to 24-hour
          if (convertedTime < f.fromTime || convertedTime > f.toTime) continue;
        }

        // Latitude filter
        if (f.fromLat && f.toLat) {
          const fromLat = parseFloat(f.fromLat);
          const toLat = parseFloat(f.toLat);
          if (lat < fromLat || lat > toLat) continue;
        }

        // Longitude filter
        if (f.fromLng && f.toLng) {
          const fromLng = parseFloat(f.fromLng);
          const toLng = parseFloat(f.toLng);
          if (lng < fromLng || lng > toLng) continue;
        }
      }

      //marker rendering
      const popupContent = `
        <div style="text-align:center;">
          <h3>${name} (#${id})</h3>
          <img src="${image}" alt="${name}" style="width:100px;height:auto;" />
          <p>Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
          <p>Time: ${time}</p>
        </div>
      `;

      L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
    }
  }
}

function applyFilters() {
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

  globalFilters = [
    {
      name: nameInput.value.trim(),
      fromTime: fromTimeInput.value.trim(),
      toTime: toTimeInput.value.trim(),
      fromLat: fromLatInput.value.trim(),
      toLat: toLatInput.value.trim(),
      fromLng: fromLngInput.value.trim(),
      toLng: toLngInput.value.trim(),
    },
  ];

  console.log("Filters applied:", globalFilters);
  if (countryInput.value.trim() === "") {
    alert("Please enter a valid country name.");
    return;
  } else {
    let country: string = countryInput.value.trim();
    goToCountry(country, globalFilters);
  }
}

function clearMarkers() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

function convert12to24(time12h: string): string {
  // Split 12 hour format into its components
  let [time, AMorPM] = time12h.split(" ");
  let [hours, minutes, seconds] = time.split(":");

  // Convert hours to 24-hour format
  if (AMorPM === "PM" && parseInt(hours) < 12) {
    hours = (parseInt(hours) + 12).toString();
  }
  if (AMorPM === "AM" && parseInt(hours) === 12) {
    hours = "00";
  }

  // Return the time in 24-hour format
  return `${hours}:${minutes}:${seconds}`;
}

// Class to represent Pokémon coordinates with distance and species
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
  const instructions = document.querySelector(".instructions") as HTMLElement | null;

  if (instructions) {
    instructions.classList.toggle("hidden");
  }
}