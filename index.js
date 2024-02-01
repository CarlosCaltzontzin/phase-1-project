/*************************************************************************************/
/* The DOMContentLoaded event listener triggers when the webpage is fully loaded.    */
/* It fetches the list of breweries from an API and calls the renderStates function. */
/*************************************************************************************/
document.addEventListener('DOMContentLoaded', function(){
  fetch("https://api.openbrewerydb.org/breweries")
  .then(response => response.json())                        // Convert the response to a JSON object
  .then(data => renderStates(data))                         // Call renderStates function to manipulate data
});

/*******************************************************************************/
/* Function that displays brewery states                                       */ 
/*******************************************************************************/
function renderStates(states){
  // Select the HTML table with the id stateTable where the states will be displayed
  const stateTable = document.querySelector('#stateTable');
  const uniqueStates = new Set();                           // Create an empty Set (object) to store unique states
  const stateBreweries = {};                                // Create an empty object to store breweries by state
  let currentRow;                                           // To keep track of the current row being built
  let cellsInCurrentRow = 0;                                // To count the cells in the current row

  // Iterate through the brewery data obtained from the API and process each brewery one by one
  states.forEach(brewery => {
    const state = brewery.state;        // Get state

    if (!uniqueStates.has(state)){      // If the state is not in the Set, do the following

      // If the current cell is 0, create a new table row
      if (cellsInCurrentRow === 0){
        currentRow = document.createElement('tr'); 
        stateTable.appendChild(currentRow);
      }
      
      const cell = document.createElement('td');  // Create a new table cell for the state name
      cell.textContent = state;                   // Set the content of the cell to the state name
      
      // Click event listener, when a state is clicked call the function handleStateClick
      cell.addEventListener('click', () => { handleStateClick(state, stateBreweries); });

      // Mouseover event listener, change background color of a state cell
      cell.addEventListener('mouseover', () => { cell.style.backgroundColor = 'lightblue'; });

      // Mouseout event listener, Reset the state cell background color
      cell.addEventListener('mouseout', () => { cell.style.backgroundColor = ''; });

      currentRow.appendChild(cell); // Append the cell to the current row in the table
      uniqueStates.add(state);      // Add the state to the Set of unique states
      cellsInCurrentRow++;          // Increment counter
      
      // Reset the cell counter if cell === 5, indicating a new row
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
  // Select the HTML list with the id breweryInfo where brewery information will be displayed
  const breweryInfo = document.querySelector('#breweryInfo');
  const breweries = stateBreweries[state]; // Breweries for the clicked state from the stateBreweries object

  //Display all breweries name and address for the state clicked
  breweryInfo.innerHTML = `<h3>Breweries in ${state}:</h3>`; // Heading indicating the state
  const ul = document.createElement('ul');       // Create an unordered list element to hold the brewery information
  breweries.forEach(brewery => {                 // For each brewery,
    const li = document.createElement('li');     // Create a list item element for each brewery
    li.innerHTML = `<strong>${brewery.name}</strong><br>${brewery.address}`; // Set the item with the name & address
    ul.appendChild(li);                          // Append the list item to the unordered list  
  });

  //Append the unordered list to the breweryInfo section, displaying the list of breweries for the clicked state
  breweryInfo.appendChild(ul);
}
