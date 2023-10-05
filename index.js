function getBrewery() {
    return fetch("https://api.openbrewerydb.org/breweries")
      .then(response => response.json())
      .then(object => window.renderStates(object))
  }
  
  function renderStates(states) {
    const stateTable = document.querySelector('#stateTable');
    const uniqueStates = new Set(); // Create a Set to store unique states
    let currentRow; // To keep track of the current row being built
    let cellsInCurrentRow = 0; // To count the cells in the current row
    const stateBreweries = {}; // To store breweries by state

    states.forEach(brewery => {
        const state = brewery.state;
        if (!uniqueStates.has(state)) { // Check if the state is not in the Set
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
    /*
    const body = document.querySelector('#content');
    states.forEach(brewery => {
      const h2 = document.createElement('h2');
      h2.innerHTML = brewery.state_province;
      body.appendChild(h2);
    });
    */
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