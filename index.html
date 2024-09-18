document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);
document.getElementById('submitButton').addEventListener('click', handleSubmit, false);

let columns = {}; // To store parsed CSV data
let headers = []; // To store headers globally for access
let csvData = []; // To store the entire CSV data

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        parseCSV(text); // Parse CSV file via function

        document.getElementById('csvFileInput').style.display = 'none'; // Hide file input
        document.getElementById('continueButton').style.display = 'block'; // Show "continue" button
        document.getElementById('step').innerText = 'Step 2'; // Change step and subtitle
        document.getElementById('sub').innerText = "Uncheck any unverified votes, then hit continue at the bottom.";
    };
    reader.readAsText(file);
}

function parseCSV(csv) {
    const rows = csv.trim().split('\n');
    if (rows.length === 0) return;

    headers = rows[0].split(',').map(header => header.replace(/(^"|"$)/g, '').trim()); // Remove quotes from headers
    csvData = rows.slice(1).map(row => row.split(',').map(cell => cell.replace(/(^"|"$)/g, '').trim())); // Remove quotes from data
    displayCSVTable(csvData);

    columns = {};
    headers.forEach(header => {
        columns[header] = [];
    });

    rows.slice(1).forEach(row => {
        const cells = row.split(',').map(cell => cell.replace(/(^"|"$)/g, '').trim()); // Split by commas and remove quotes again just in case
        cells.forEach((cell, index) => {
            const header = headers[index];
            if (header) {
                columns[header].push(cell); // Stores table headers to global array
            }
        });
    });
}

function displayCSVTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous content
    // Construct table to remove unverified
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    // Adds headers from file
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    // Add checkbox column
    const checkboxHeader = document.createElement('th');
    checkboxHeader.textContent = 'Include';
    headerRow.appendChild(checkboxHeader);
    thead.appendChild(headerRow);
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });

        const checkboxTd = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkboxTd.appendChild(checkbox);
        tr.appendChild(checkboxTd);
        tbody.appendChild(tr);
    });
    // Fill table
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    document.getElementById('continueButton').style.display = 'block'; // Show continue button
}
// Check for verify complete + change step, sub, and element visibity
document.getElementById('continueButton').addEventListener('click', function () {
    const filteredData = filterCSVRows();
    displayDropdownMenu(filteredData);
    document.getElementById('continueButton').style.display = 'none';
    document.getElementById("tableContainer").style.display = 'none';
    document.getElementById('submitButton').style.display = 'block';
    document.getElementById('step').innerText = 'Step 3';
    document.getElementById('sub').innerText = "Choose the voting formula for each column. Choose \"Ignore\" for any non-voting columns.";
});
// Filters out unverified votes
function filterCSVRows() {
    const rows = document.querySelectorAll('#tableContainer tbody tr');
    const filteredData = [];

    rows.forEach((row, rowIndex) => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            const rowData = csvData[rowIndex];
            filteredData.push(rowData);
        }
    });

    return filteredData;
}
// Creates dropdowns for formula selection
function displayDropdownMenu(filteredData) {
    const dropdownContainer = document.getElementById('dropdownContainer');
    dropdownContainer.innerHTML = ''; 

    headers.forEach(header => {
        const label = document.createElement('label');
        const dropdown = document.createElement('select');

        dropdown.id = `dropdown-${header.replace(/\s+/g, '-')}`;

        const option1 = document.createElement('option');
        option1.value = 'Ignore';
        option1.text = 'Ignore';

        const option2 = document.createElement('option');
        option2.value = 'FPTP';
        option2.text = 'FPTP (single winner)';

        const option3 = document.createElement('option');
        option3.value = 'Sainte-Lague';
        option3.text = 'Sainte-Laguë (seat allocation)';

        dropdown.appendChild(option1);
        dropdown.appendChild(option2);
        dropdown.appendChild(option3);

        label.htmlFor = dropdown.id;
        label.textContent = header + ' '; 
        label.appendChild(dropdown);
        dropdownContainer.appendChild(label);
        dropdownContainer.appendChild(document.createElement('br'));
    });

    columns = {};
    headers.forEach((header, index) => {
        columns[header] = filteredData.map(row => row[index]);
    });
}

function handleSubmit() {
    // Makes sure at least one formula is used
    let allIgnored = true;
    headers.forEach(header => {
        const dropdown = document.getElementById(`dropdown-${header.replace(/\s+/g, '-')}`);
        if (dropdown.value !== 'Ignore') {
            allIgnored = false;
        }
    });
    if (allIgnored) {
        alert("Error: You must select at least one column for processing.");
        return;
    }
    // Displays results
    document.getElementById('submitButton').style.display = 'none';
    document.getElementById('dropdownContainer').style.display = 'none';
    document.getElementById('reloadButton').style.display = 'block';
    document.getElementById('step').innerText = 'Results';
    document.getElementById('sub').style.display = 'none';
    
    const results = {};
    headers.forEach(header => {
        const dropdown = document.getElementById(`dropdown-${header.replace(/\s+/g, '-')}`); // Removes quotes YET AGAIN
        results[header] = dropdown.value;
    });

    headers.forEach(header => {
        const dropdownValue = results[header]; // Checks dropdown values, runs relevant formula function
        if (dropdownValue === 'FPTP') {
            testFPTP(columns[header]);
            document.getElementById("title1").append(`FPTP Result for "${header}":`);
        } else if (dropdownValue === 'Sainte-Lague') {
            testSL(columns[header]);
        }
    });
}
// FPTP function
function testFPTP(columnArray) {
    const nameCounts = {};
    columnArray.forEach(name => {
        name = name.trim(); 
        if (name) {
            nameCounts[name] = (nameCounts[name] || 0) + 1;
        }
    });

    const namesArray = [];
    const countsArray = [];

    for (const [name, count] of Object.entries(nameCounts)) {
        namesArray.push(name);
        countsArray.push(count);
    }
    // Creates chart
    pieChart(namesArray, countsArray, "chart1");
    // Iterates results
    namesArray.forEach((name, index) => {
        const count = countsArray[index];
        const percentage = ((count / columnArray.length) * 100).toFixed(2);
        document.getElementById("display1").append(`${name}: ${count} vote(s) (${percentage}%)`);
        document.getElementById("display1").appendChild(document.createElement('br'));
    });
    // Display winner
    let winner = null;
    let maxVotes = 0;
    for (const [name, count] of Object.entries(nameCounts)) {
        if (count > maxVotes) {
            maxVotes = count;
            winner = name;
        }
    }   
    if (winner) {
        document.getElementById("display1").append('Winner: ' + winner);
    }
    return result;
}
// Sainte-Laguë function
function testSL(columnArray) {
    const partyCounts = {};
    columnArray.forEach(party => {
        party = party.trim(); 
        if (party) {
            partyCounts[party] = (partyCounts[party] || 0) + 1;
        }
    });

    const partiesArray = [];
    const countsArray = [];

    for (const [party, count] of Object.entries(partyCounts)) {
        partiesArray.push(party);
        countsArray.push(count);
    }
    // Creates chart
    pieChart(partiesArray, countsArray, "chart2");
    // Sets title2
    const display2 = document.getElementById("display2");
    display2.innerHTML = ''; 
    title2.appendChild(document.createElement('br'));
    title2.append("Party Vote Counts:");
    // Iterates results
    partiesArray.forEach((party, index) => {
        const count = countsArray[index];
        const percentage = ((count / columnArray.length) * 100).toFixed(2);
        display2.append(`${party}: ${count} vote(s) (${percentage}%)`);
        display2.appendChild(document.createElement('br'));
    });
    // S-L formaula
    const eligibleParties = {};
    for (const [party, count] of Object.entries(partyCounts)) {
        const percentage = (count / columnArray.length) * 100;
        if (percentage >= 5) {
            eligibleParties[party] = count;
        }
    }

    const totalSeats = Math.floor(columnArray.length / 5);
    const partySeats = {};
    const divisors = {};
    Object.keys(eligibleParties).forEach(party => {
        partySeats[party] = 0;
        divisors[party] = 1;
    });

    for (let i = 0; i < totalSeats; i++) {
        let highestParty = null;
        let highestValue = 0;

        for (const [party, votes] of Object.entries(eligibleParties)) {
            const value = votes / divisors[party];
            if (value > highestValue) {
                highestValue = value;
                highestParty = party;
            }
        }

        if (highestParty) {
            partySeats[highestParty]++;
            divisors[highestParty] += 2;
        }
    }
    // Sets title3
    document.getElementById("title3").appendChild(document.createElement('br'));
    document.getElementById("title3").append("Seat allocation:");
    const allocatedPartiesArray = [];
    const seatsArray = [];

    for (const [party, seats] of Object.entries(partySeats)) {
        allocatedPartiesArray.push(party);
        seatsArray.push(seats);
    }
    // Creates chart
    pieChart(allocatedPartiesArray, seatsArray, "chart3");

    const display3 = document.getElementById("display3");
    display3.innerHTML = ''; 
    // Iterates results
    allocatedPartiesArray.forEach((party, index) => {
        const seats = seatsArray[index];
        display3.append(`${party}: ${seats} seat(s)`);
        display3.appendChild(document.createElement('br'));
    });
}
// Chart draw function
function pieChart(labels, values, location){
    var data = [{
        values: values,
        labels: labels,
        type: 'pie',
        textinfo: "percent+value",
        textposition: "inside",
        automargin: true
    }];
      
    var layout = {
        height: 500,
        width: 800,
        margin: {"t": 0, "b": 0, "l": 0, "r": 0},
        showlegend: true,
        legend: {
            x: 1,
            y: 0.5
            }
    };
      
    Plotly.newPlot(location, data, layout);
}
