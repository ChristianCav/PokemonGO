//Don't remove this
interface Data {
    localTime: string[];
    pokemonId: string[];
    longitude: number[];
    latitude: number[];
  }
  
  const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here.
  
  interface Pokedex{
    ids: number[];
    names: string[];
    types: string[];
    stats: number[];
    species: string[];
    descriptions: string[];
    evolutions_prev: string[];
    evolutions_next: string[];
    heights: number[];
    weights: number[];
    abilities: string[];
    genders: number[];
    images: string[];
  }

  const pokedex : Pokedex = loadJSON("../DO_NOT_TOUCH/pokedex.json") as Pokedex; // DONT DELETE BAKAS

  // Merge sort
  function mergeSort(dataArray : number[], l : number, m : number, r : number) : number[]{
    
    return dataArray;
  }
  
  