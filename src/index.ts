//Don't remove this

const data : Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.

const pokedex : Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // Don't delete.

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

// converts indexes to a data set based on order
// so if [1, 3, 2, 4]
// it will return the data value of [data[1], data[3], data[2], data[4]]
function indexToData(indexes : number[], arr : any[]) : Array<any> {
  let result : Array<any> = new Array(indexes.length);
  for(let i=0; i<indexes.length; i++){
      result[i] = arr[indexes[i]];
  }
  return result;
}

let t : MergeSortLL<number> = new MergeSortLL(data.pokemonId);
console.log(data.pokemonId);
let m = (t.sort(ascending));
console.log(m);
let v = (indexToData(m, data.pokemonId));
console.log(v);
let d = binarySearch(1, v, desending);
console.log(d);
console.log(indexToData(d, v));