// utility functions

// converts indexes to a data set based on order
// so if [1, 3, 2, 4]
// it will return the data value of [data[1], data[3], data[2], data[4]]
// O(n), as it loops through all inputted indexes once
function indexToData(indexes : number[], arr : any[]) : Array<any> {
    let result : Array<any> = new Array(indexes.length);
    for(let i=0; i<indexes.length; i++){
        result[i] = arr[indexes[i]];
    }
    return result;
}

// returns number of decimal places of a given number
// takes number as a string as input Ex: "1.23"
// O(1), as there are no loops, only simple operations
function numDecimals(input: string): number{
    // If no period, there are no decimals
    if(!input.includes('.')) return 0;
    // Split the string into two parts, from before and after the decimal
    // Access the part after the decimal using [1]
    // Return the number of digits after the decimal, using .length
    return input.split('.')[1].length;  
}

// rounds an inputted number to an inputted number of decimal places
// returns as number
function roundToDecimal(input: number, numDecimals: number): number{
    return Number(input.toFixed(numDecimals));
}

// finds names of all 99333 pokemon
// returns array of strings
// O(n), since it loops through all pokemon once
function findNames(): string[]{
    let namesArr: string[] = new Array(99333)
    for(let i=0;i<data.pokemonId.length;i++){
        let index: number = data.pokemonId[i]-1;
        namesArr[i] = pokedex.names_english[index];
    }
    return namesArr;
}   

// Converts time to seconds
// Takes in time ex.("11:23:40 AM") and converts it to seconds after midnight
// returns seconds as a number
// O(1), since there are no loops, just simple operations
function toSeconds(time: string): number{
    // Split "11:23:40 AM" to ["11:23:40", "AM"]
    let [timePart, modifierPart] = time.split(' ');
    // Split "11:23:40" to [11, 23, 40]
    let [hours, seconds, minutes] = timePart.split(':').map(Number);
    // Add 12 hours if the time is PM
    if(modifierPart === "PM" && hours !== 12){
        hours+=12
    }
    // Make hours 0, if it is 12:xx:xx AM
    if(modifierPart === "AM" && hours === 12){
        hours = 0;
    }
    return (hours*3600 + minutes*60 + seconds);
}