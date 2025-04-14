// utility functions

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

// returns number of decimal places
// takes number as a string as input Ex: "1.23"
function numDecimals(input: string): number{
    // If no period, there are no decimals
    if(!input.includes('.')) return 0;
    // Split the string into two parts, from before and after the decimal
    // Access the part after the decimal using [1]
    // Return the number of digits after the decimal
    return input.split('.')[1].length;  
}

function roundToDecimal(input: number, numDecimals: number): number{
    return Number(input.toFixed(numDecimals));
}

// returns an array of the specific value of the pokemon using the pokemon id
// if inputted pokedex.names_english --> will return array of names_englsh
// O(n) time
function findPokedex(arr : any[]): string[]{
    let newArr : string[] = new Array(data.pokemonId.length)
    for(let i=0;i<data.pokemonId.length;i++){
        // id is 1 above 0
        newArr[i] = arr[data.pokemonId[i]-1];
    }
    return newArr;
}   

function toSeconds(time: string): number{
    const [timePart, modifier] = time.split(' ');
    let [hours, seconds, minutes] = timePart.split(':').map(Number);
    if(modifier === "PM" && hours !== 12){
        hours+=12
    }
    if(modifier === "AM" && hours === 12){
        hours = 0;
    }
    return (hours*3600 + minutes*60 + seconds);
}