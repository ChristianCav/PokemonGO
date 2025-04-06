//Don't remove this

// const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

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
    const card = document.createElement("div");
    card.className = "pokemon-card";

    const img = document.createElement("img");
    img.src = pokedex.images[i];
    img.alt = pokedex.names[i];
    img.className = "pokemon-image";

    const info = document.createElement("div");
    info.className = "pokemon-info";

    const name = document.createElement("h3");
    name.className = "pokemon-name";
    name.textContent = pokedex.names[i];

    const number = document.createElement("p");
    number.className = "pokemon-number";
    number.textContent = formatNumber(pokedex.ids[i]);

    const typesDiv = document.createElement("div");
    typesDiv.className = "pokemon-types";

    const types = pokedex.types[i].split(/[ ,]+/);
    for (let t = 0; t < types.length; t++) {
      const typeSpan = document.createElement("span");
      typeSpan.className = `type ${types[t].toLowerCase()}`;
      typeSpan.textContent = types[t];
      typesDiv.appendChild(typeSpan);
    }

    info.appendChild(name);
    info.appendChild(number);
    info.appendChild(typesDiv);
    card.appendChild(img);
    card.appendChild(info);
    gridContainer.appendChild(card);
  }
}
