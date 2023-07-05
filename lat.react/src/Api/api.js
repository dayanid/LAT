export const generateApiKey = () => {
    const currentDate = new Date();
    const year = String(currentDate.getFullYear()).slice(0);
  
    const month = String(currentDate.getMonth() + 1);
  
    const date = String(currentDate.getDate());
    // Add leading zero to date if it is a single digit
    const formattedDate = date.length === 1 ? `0${date}` : date;
    // Add leading zero to month if it is a single digit
    const formattedMonth = month.length === 1 ? `0${month}` : month;
  
    // Store the formatted date, month, and year in an array
    const dateArray = [formattedDate, formattedMonth, year];
  
    // Concatenate the array elements and "DAYA" to form the API key
    let apiKey = `D${dateArray[1][1]}${dateArray[2][2]}${dateArray[0][0]}A${dateArray[1][0]}${dateArray[2][0]}${dateArray[0][1]}Y${dateArray[2][2]}A${dateArray[2][1]}`;
  
    // Reverse the apiKey if the date is even
    if (parseInt(dateArray[0], 10) % 2 === 0) {
      apiKey = apiKey.split("").reverse().join("");
    }
  
    return apiKey;
  };
  export const baseURL = "http://localhost:9000";