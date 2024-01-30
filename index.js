/*************************************************************************************/
/* The DOMContentLoaded event listener triggers when the webpage is fully loaded.    */
/* It fetches the list of breweries from an API and calls the renderStates function. */
/*************************************************************************************/
document.addEventListener('DOMContentLoaded', function(){
  fetch("https://api.openbrewerydb.org/breweries")
  .then(response => response.json())                        // Convert the response to a JSON object
  .then(data => renderStates(data))                         // Call renderStates function to manipulate data
})

/**********************************************************************************/
/* The DOMContentLoaded event listener triggers when the webpage is fully loaded. */
/* It calls the getBrewery function to start fetching brewery data.               */
/*                                                                                */
/* Syntax: document.addEventListener(eventType, callbackFunction);                */
/*                                                                                */
/* Arrow function is the same as:                                                 */
/* document.addEventListener('DOMContentLoaded', function() {                     */
/*   getBrewery();                                                                */
/* });                                                                            */
/**********************************************************************************/
//document.addEventListener('DOMContentLoaded', () => getBrewery());

/*******************************************************************************/
/* Get the list of breweries from the API                                      */
/*******************************************************************************/

/*
function getBrewery(){
  return fetch("https://api.openbrewerydb.org/breweries")
  .then(response => response.json())                        // Convert the response to a JSON object
  .then(object => renderStates(object))                     // Call renderStates function to manipulate data
}
*/

/*******************************************************************************/
/* Function that displays brewery states                                       */ 
/*******************************************************************************/
function renderStates(states){
  const stateTable = document.querySelector('#stateTable'); // Select HTML table where states will be displayed
  const uniqueStates = new Set();                           // Create empty Set to store unique states
  const stateBreweries = {};                                // Create empty object to store breweries by state
  let currentRow;                                           // To keep track of the current row being built
  let cellsInCurrentRow = 0;                                // To count the cells in the current row

  // Iterate through the brewery data obtained from the API and process each brewery one by one
  states.forEach(brewery => {
    const state = brewery.state;        // Get state

    if (!uniqueStates.has(state)){      // Check if the state is not in the Set

      // If the current cell is 0, create a new table row
      if (cellsInCurrentRow === 0){
        currentRow = document.createElement('tr'); 
        stateTable.appendChild(currentRow);
      }
      
      const cell = document.createElement('td');  // Create a new table cell 
      cell.textContent = state;                   // Cell content is the state name
      
      // Click event listener, call function handleStateClick when a state is clicked
      cell.addEventListener('click', () => {
        handleStateClick(state, stateBreweries);
      });

      // Mouseover event listener, change background color of a state cell
      cell.addEventListener('mouseover', () => {
        cell.style.backgroundColor = 'lightblue';
      });

      // Mouseout event listener, Reset the state cell background color
      cell.addEventListener('mouseout', () => {
        cell.style.backgroundColor = '';
      });

      currentRow.appendChild(cell); // Append the cell to the current row in the table
      uniqueStates.add(state);      // Add the state to the Set to mark it as encountered
      cellsInCurrentRow++;          // Increment counter
      
      // Reset cell counter if cell === 5
      if (cellsInCurrentRow === 5){
        cellsInCurrentRow = 0;
      }
      
      // Initialize the breweries array for the state
      stateBreweries[state] = [];
    }
    
    // Add the brewery's name and address to the state's breweries array
    stateBreweries[state].push({ name: brewery.name, address: brewery.address_1});
  });
}


/*******************************************************************************/
/* Function to handle the click event for states                               */ 
/* When a state is clicked a list of breweries for that state appears          */
/*******************************************************************************/
function handleStateClick(state, stateBreweries){
  const breweryInfo = document.querySelector('#breweryInfo'); // Select HTML list where brewery info will be displayed
  const breweries = stateBreweries[state]; // Breweries for the clicked state from the stateBreweries object

  //Display all breweries name and address for the state clicked
  breweryInfo.innerHTML = `<h3>Breweries in ${state}:</h3>`;
  const ul = document.createElement('ul');
  breweries.forEach(brewery => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${brewery.name}</strong><br>${brewery.address}`;
    ul.appendChild(li);
  });
  breweryInfo.appendChild(ul);
}
