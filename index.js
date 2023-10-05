/* Get list of breweries from the API */ 
function getBrewery() {
  return fetch("https://api.openbrewerydb.org/breweries")
  .then(response => response.json())              // Convert the response to a JSON object
  .then(object => window.renderStates(object))    // Call renderStates function to manipulate data
}
  
function renderStates(states) {
  const stateTable = document.querySelector('#stateTable');
  const uniqueStates = new Set();       // Create a Set to store unique states
  const stateBreweries = {};            // To store breweries by state
  let currentRow;                       // To keep track of the current row being built
  let cellsInCurrentRow = 0;            // To count the cells in the current row

  states.forEach(brewery => {
    const state = brewery.state;
    if (!uniqueStates.has(state)){      // Check if the state is not in the Set
      if (cellsInCurrentRow === 0) {
        currentRow = document.createElement('tr');
        stateTable.appendChild(currentRow);
      }
      
      const cell = document.createElement('td');
      cell.textContent = state;
      cell.classList.add('state-cell'); // Add a class to the cell for styling
      
      cell.addEventListener('click', () => {
        handleStateClick(state, stateBreweries); // Handle the click event
      });

      // Add event listeners for mouseover and mouseout
      cell.addEventListener('mouseover', () => {
        cell.style.backgroundColor = 'lightblue'; // Change the background color on mouseover
      });

      cell.addEventListener('mouseout', () => {
        cell.style.backgroundColor = ''; // Reset the background color on mouseout
      });

      currentRow.appendChild(cell);
      uniqueStates.add(state); // Add the state to the Set to mark it as encountered
      cellsInCurrentRow++;
      
      if (cellsInCurrentRow === 5) {
        cellsInCurrentRow = 0;
      }
      
      // Initialize the breweries array for the state
      stateBreweries[state] = [];
    }
    
    // Add the brewery to the state's breweries array
    stateBreweries[state].push({ name: brewery.name, address: brewery.address_1});
  });
  
  // Store state breweries data for later use
  stateTable.dataset.stateBreweries = JSON.stringify(stateBreweries);
}

// Function to handle the click event for states
function handleStateClick(state, stateBreweries) {
  const breweryInfo = document.querySelector('#breweryInfo');
  const breweries = stateBreweries[state];

  if (breweries) {
      breweryInfo.innerHTML = `<h3>Breweries in ${state}:</h3>`;
      const ul = document.createElement('ul');
      breweries.forEach(brewery => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${brewery.name}</strong><br>${brewery.address}`;
          ul.appendChild(li);
      });
      breweryInfo.appendChild(ul);
  } else {
      breweryInfo.innerHTML = `<p>No breweries found for ${state}.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  getBrewery();
});