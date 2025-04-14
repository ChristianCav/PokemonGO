//Don't remove this
const data : Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex: Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

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
        <img src="${pokedex.images[i]}" alt="${pokedex.names_english[i]}" class="pokemonImage">
        <div class="pokemonInfo">
          <h3 class="pokemonName">${pokedex.names_english[i]}</h3>
          <p class="pokemonNumber">${formatNumber(pokedex.ids[i])}</p>
          <div class="pokemonTypes">
            ${types}
          </div>
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

  const query = input.value.trim();

  if (query.length === 0) {
    alert("Please enter a Pokémon name before searching.");
    return;
  }

  window.location.href = `../html/table.html`;

  // const encodedQuery = encodeURIComponent(query);
  // window.location.href = `../html/table.html?search=${encodedQuery}`;
}


// call function when the DOM is loaded (webpage starts)
// ! Only runs when in index.html file
document.addEventListener("DOMContentLoaded", (): void => {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);

  if (page === "index.html" || page === "") {
    displayPokedex(pokedex);
  }
});

/* HOW TO USE BINARY SEARCH AND MERGE SORT
they have to be opposite
let t : MergeSortLL<number> = new MergeSortLL(data.pokemonId);
console.log(data.pokemonId);
let m = (t.sort(ascending));
console.log(m);
let v = (indexToData(m, data.pokemonId));
console.log(v);
let d = binarySearch(1, v, desending);
console.log(d);
console.log(indexToData(d, v));
*/