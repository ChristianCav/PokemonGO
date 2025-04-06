// data classes for different data

interface Data {
    localTime: string[];
    pokemonId: number[];
    longitude: number[];
    latitude: number[];
}  

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
