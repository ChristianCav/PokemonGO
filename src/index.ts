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

// call function when the DOM is loaded (webpage starts)
document.addEventListener("DOMContentLoaded", (): void => {
  displayPokedex(pokedex);
});

// test stuff

let f: mergeSort<string> = new mergeSort(compareAlphaAscendingSort)
// array of indexes 
let g = f.sort(findPokedex(pokedex.names_english));
console.log(g)
let h = indexToData(g, findPokedex(pokedex.names_english));
console.log(h)
let k = binarySearch("P",h, compareAlphaAscendingSearch)
console.log(k);
console.log(indexToData(k,h));

const mainNames = pokedex.names_english.slice(0,149)
let l: MergeSortLL<string> = new MergeSortLL(mainNames);
// array of indexes 
let m = l.sort(compareAlphaAscendingSort);
console.log(m)
let n = indexToData(m, mainNames);
console.log(n)
let o = binarySearch("P", n, compareAlphaAscendingSearch)
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