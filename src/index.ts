//Don't remove this

const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex : Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

class Algorithms {
  // Merge sort
  public mergeSort(dataArray: number[], l: number, m: number,r: number): number[] {
    return dataArray;
  }

  public merge() {}
}

fetch("../DO_NOT_TOUCH/pokedex.json")
  .then(response => response.json())
  .then((data: Pokedex) => {
    displayPokedex(data);
  })
  .catch(error => {
    console.error("Failed to load Pokédex JSON:", error);
  });


  function displayPokedex(pokedex: Pokedex) {
    const gridContainer = document.querySelector(".pokemon-grid") as HTMLElement;
  
    function formatNumber(id: number): string {
      if (id < 10) return "#00" + id;
      else if (id < 100) return "#0" + id;
      else return "#" + id;
    }
  
    for (let i = 0; i < pokedex.ids.length; i++) {
      const types = pokedex.types[i].split(/[ ,]+/).map(type => {
        return `<span class="type ${type.toLowerCase()}">${type}</span>`;
      }).join("");
  
      const cardHTML = `
        <div class="pokemon-card">
          <img src="${pokedex.images[i]}" alt="${pokedex.names[i]}" class="pokemon-image">
          <div class="pokemon-info">
            <h3 class="pokemon-name">${pokedex.names[i]}</h3>
            <p class="pokemon-number">${formatNumber(pokedex.ids[i])}</p>
            <div class="pokemon-types">
              ${types}
            </div>
          </div>
        </div>
      `;
  
      gridContainer.innerHTML += cardHTML;
    }
  }
  
