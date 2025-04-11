// some global variables
let activeNameFilter: string | null = null;

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

function goToCountry() {
  if (map.getZoom() > 3) {
    const country = (document.getElementById("countryInput") as HTMLInputElement)
    .value;
  if (!country) {
    alert("Please enter a valid country name.");
    return;
  }

  // Get the map data from Nominatim
  fetch(
    `https://nominatim.openstreetmap.org/search?country=${country}&format=json&addressdetails=1`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        // Center the map on the country's coordinates
        map.setView([lat, lon], map.getZoom()); // Keep the current zoom level

        // Fetch the Pokémon data after entering the country name
        fetch("../DO_NOT_TOUCH/pokedex.json") // Replace with actual path
          .then((response) => response.json())
          .then((pokedex) => {
            pokedexData = pokedex; // Store Pokedex data
            fetch("../DO_NOT_TOUCH/data.json") // Replace with actual path
              .then((response) => response.json())
              .then((locationData) => {
                pokemonLocationData = locationData; // Store Pokémon location data

                // Wait for 0.5s to ensure map zoom is settled before rendering markers
                setTimeout(() => {
                  renderPokemonMarkers(pokedexData, pokemonLocationData);
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

function renderPokemonMarkers(pokedex: Pokedex, locationData: Data) {
  // Clear any existing markers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Get the current bounds of the map
  const bounds = map.getBounds();

  // Iterate through the location data (locationData.pokemonId) to render markers for Gen 1 Pokémon
  for (let i = 0; i < locationData.pokemonId.length; i++) {
    const pokemonId = locationData.pokemonId[i];

    // Check if the Pokémon is Gen 1 (ID between 1 and 151)
    if (pokemonId >= 1 && pokemonId <= 151) {
      const lat = locationData.latitude[i];
      const lng = locationData.longitude[i];

      // Check if the Pokémon's location is within the map's bounds
      if (bounds.contains([lat, lng])) {
        // Find the corresponding Pokémon in the Pokedex data
        const index = pokedex.ids.indexOf(pokemonId);
        if (index !== -1) {
          const name = pokedex.names_english[index];
          const image = pokedex.images[index];
          const id = pokedex.ids[index];

          // Create a popup content with the Pokémon's name and image
          const popupContent = `
                        <div style="text-align:center;">
                            <h3>${name} (#${id})</h3>
                            <img src="${image}" alt="${name}" style="width:100px;height:auto;" />
                            <p> Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                        </div>
                    `;

          // Create a marker and bind the popup to it
          L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
        }
      }
    }
  }
}

