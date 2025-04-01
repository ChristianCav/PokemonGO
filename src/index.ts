//Don't remove this
interface Data {
    localTime: string[];
    pokemonId: string[];
    longitude: number[];
    latitude: number[];
  }
  
  const data: Data = loadJSON("../DO_NOT_TOUCH/data.json") as Data; //Don't delete this line. All your data is here. 
  
  //This below just shows you how to access the data. You can remove these.
  console.log(data);
  console.log(data.pokemonId);
  