// data classes for different data

interface Data {
    localTime: string[];
    pokemonId: number[];
    longitude: number[];
    latitude: number[];
}  

class Pokedex{
    ids: number[];
    names_english: string[];
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

// class to hold parrallel sorted data
// pairs of sorted data
// first sorted values
// second sorted indexes
class AllSorted{
    localTime : Pair
    pokemonId: Pair;
    longitude: Pair;
    latitude: Pair;
    ids: Pair;
    names_english: Pair;
    types: Pair;
    stats: Pair;
    species: Pair;
    descriptions: Pair;
    evolutions_prev: Pair;
    evolutions_next: Pair;
    heights: Pair;
    weights: Pair;
    abilities: Pair;
    genders: Pair;
    images: Pair;
}