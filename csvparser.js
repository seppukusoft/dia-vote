document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);
document.getElementById('submitButton').addEventListener('click', handleSubmit, false);
document.getElementById('usernameFileInput').addEventListener('change', handleUsernameFileSelect, false);
document.getElementById('skipVerificationButton').addEventListener('click', skipVerification, false);

let validUsernames = []; // To store the list of valid usernames
let usernameColumnIndex = -1; // Modify global variables to identify the username column
let columns = {}; // To store parsed CSV data
let headers = []; // To store headers globally for access
let csvData = []; // To store the entire CSV data

// Handle the selection of the usernames CSV file
function handleUsernameFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        parseUsernamesCSV(text); // Parse the usernames CSV file

        // Show the election file upload input
        document.getElementById('csvFileInput').style.display = 'block';
        document.getElementById('sub').style.display = 'block';
        document.getElementById('skipVerificationButton').style.display = 'none';
    };
    reader.readAsText(file);
}

// Parse the usernames CSV file and store the list
function parseUsernamesCSV(csv) {
    const rows = csv.trim().split('\n');
    validUsernames = rows.map(row => row.trim().toLowerCase()); // Store usernames in lowercase for easy comparison
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        parseCSV(text); // Parse the election CSV file
        document.getElementById('csvFileInput').style.display = 'none'; // Hide file input
        document.getElementById('usernameFileInput').style.display = 'none';
        document.getElementById('ver').style.display = 'none';
        document.getElementById('continueButton').style.display = 'block'; // Show "continue" button
        document.getElementById('step').innerText = 'Step 2'; // Change step and subtitle
        document.getElementById('sub').innerText = "Uncheck any unverified votes, then hit continue at the bottom.";
    };
    reader.readAsText(file);
}

function skipVerification() {
    // Hide verification elements
    document.getElementById('usernameFileInput').style.display = 'none';
    document.getElementById('ver').style.display = 'none';
    document.getElementById('skipVerificationButton').style.display = 'none';
    
    // Show the election file upload input
    document.getElementById('csvFileInput').style.display = 'block';
    document.getElementById('sub').style.display = 'block';

    // Assume all rows are verified
    validUsernames = []; // Clear valid usernames to skip verification
    usernameColumnIndex = -1; // Reset username column index
}

function parseCSV(csv) {
    const rows = csv.trim().split('\n');
    if (rows.length === 0) return;

    // Parse headers
    headers = splitCSVLine(rows[0]);
    headers = headers.map(header => header.replace(/(^"|"$)/g, '').trim());
    columns = {};
    headers.forEach(header => {
        columns[header] = [];
    });

    usernameColumnIndex = headers.findIndex(header => header.toLowerCase().includes('username'));
    if (usernameColumnIndex === -1) {
        alert("No column with 'username' in the header found. Please select the username column manually.");
        return;
    }

    // Parse data rows
    csvData = rows.slice(1).map(row => {
        const cells = splitCSVLine(row).map(cell => cell.replace(/(^"|"$)/g, '').trim());
        cells.forEach((cell, index) => {
            const header = headers[index];
            if (header) {
                columns[header].push(cell);
            }
        });
        return cells;
    });

    validateUsernames();
    displayCSVTable(csvData);
}

function validateUsernames() {
    if (usernameColumnIndex === -1) return; // No username column selected

    csvData = csvData.map((row, rowIndex) => {
        if (validUsernames.length === 0) {
            // If skipping verification, mark all rows as valid
            return { data: row, invalid: false };
        }
    
        const username = row[usernameColumnIndex].toLowerCase();
        if (!validUsernames.includes(username)) {
            // Mark this row as invalid
            return { data: row, invalid: true };
        } else {
            return { data: row, invalid: false };
        }
    });
}

// Helper function to split a CSV line into fields
function splitCSVLine(line) {
    const result = [];
    let inQuotes = false;
    let field = '';

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            // Handle escaped double quotes
            field += '"';
            i++; // Skip the next quote
        } else if (char === '"') {
            // Toggle the inQuotes flag
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(field);
            field = '';
        } else {
            // Regular character
            field += char;
        }
    }
    
    // Add the last field
    result.push(field);
    return result;
}

function displayCSVTable(data, verificationSkipped = false) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous content
    
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

    // Create table rows
    data.forEach((rowObj, rowIndex) => {
        const row = rowObj.data;
        const isInvalid = rowObj.invalid;
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;

            // Apply red text for initially invalid rows only if verification was not skipped
            if (isInvalid && !verificationSkipped) {
                td.style.color = 'red';
            }
            tr.appendChild(td);
        });

        const checkboxTd = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Automatically check all rows if verification was skipped
        checkbox.checked = verificationSkipped || !isInvalid;

        // Add an event listener to the checkbox for dynamic row color change
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // Reset color to default when checked
                row.forEach((cell, index) => {
                    tr.children[index].style.color = '';
                });
            } else {
                // Change text color to red when unchecked
                row.forEach((cell, index) => {
                    tr.children[index].style.color = 'red';
                });
            }
        });
        checkboxTd.appendChild(checkbox);
        tr.appendChild(checkboxTd);
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    document.getElementById('continueButton').style.display = 'block'; // Show continue button
}

// Check for verify complete + change step, sub, and element visibility
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
            const rowData = csvData[rowIndex].data; // Extract the data part of the row
            filteredData.push(rowData);
        }
    });

    // Update columns with only the filtered data
    headers.forEach((header, index) => {
        columns[header] = filteredData.map(row => row[index]);
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

        label.textContent = header;
        dropdownContainer.appendChild(label);
        dropdownContainer.appendChild(dropdown);
    });
}

function handleSubmit() {
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

    document.getElementById('submitButton').style.display = 'none';
    document.getElementById('dropdownContainer').style.display = 'none';
    document.getElementById('reloadButton').style.display = 'block';
    document.getElementById('step').innerText = 'Results';
    document.getElementById('sub').style.display = 'none';
    
    const results = {};
    headers.forEach(header => {
        const dropdown = document.getElementById(`dropdown-${header.replace(/\s+/g, '-')}`);
        results[header] = dropdown.value;
    });

    headers.forEach(header => {
        const dropdownValue = results[header];
        if (dropdownValue === 'FPTP') {
            document.getElementById("title1").append(`FPTP Result for "${header}":`);
            testFPTP(columns[header]);
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
    // Count blank votes
    let blankVotes = 0;
    columnArray.forEach(name => {
        if (name.trim() === "") {
            blankVotes++;
        }
    });

    // If blank votes exist, add them to the results
    if (blankVotes > 0) {
        const blankPercentage = ((blankVotes / columnArray.length) * 100).toFixed(2);
        // Add to pie chart data
        namesArray.push("Blank/Invalid");
        countsArray.push(blankVotes);
    }
    // Creates chart
    pieChart(namesArray, countsArray, "chart1", 300, 500);
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
        document.getElementById("display1").appendChild(document.createElement('br'));
    }
}

// Sainte-Laguë function
function testSL(columnArray) {
    if (!Array.isArray(columnArray) || columnArray.length === 0) {
        console.error("Invalid column array passed to testSL:", columnArray); // Error handling
        return;
    }

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
    pieChart(partiesArray, countsArray, "chart2", 500, 800);

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

    // S-L formula
    const eligibleParties = {};
    for (const [party, count] of Object.entries(partyCounts)) {
        const percentage = (count / columnArray.length) * 100;
        if (percentage >= 5) {
            eligibleParties[party] = count;
        }
    }

    const totalSeats = Math.round(columnArray.length / 5);
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
    pieChart(allocatedPartiesArray, seatsArray, "chart3", 500, 800);

    const display3 = document.getElementById("display3");
    display3.innerHTML = ''; 

    // Iterates results
    allocatedPartiesArray.forEach((party, index) => {
        const seats = seatsArray[index];
        display3.append(`${party}: ${seats} seat(s)`);
        display3.appendChild(document.createElement('br'));
    });

    confetti({
        particleCount: 1000,
        spread: 180,
        gravity: 0.8,
        origin: { y: 0.6 },
        colors: [
            '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080',
            '#808000', '#800080', '#008080', '#FF8080', '#80FF80', '#8080FF', '#FFFF80', '#FF80FF', '#80FFFF',
            '#C0C0C0', '#FF6347', '#4682B4', '#DAA520', '#32CD32', '#BA55D3', '#3CB371', '#FF4500', '#1E90FF',
            '#D2691E', '#ADFF2F', '#9932CC', '#8B4513', '#6495ED', '#FF1493', '#00FA9A', '#FFD700', '#7CFC00',
            '#8A2BE2', '#FF69B4', '#87CEFA', '#40E0D0', '#CD5C5C', '#20B2AA', '#7B68EE', '#FA8072', '#B22222',
            '#00BFFF', '#DC143C', '#48D1CC', '#9370DB', '#FFDAB9'
          ],
        startVelocity: 40,      
        scalar: 1.2,              
        drift: 0.05,              
        shapes: ['circle', 'square'],  
        zIndex: 9999 
      });
}

// Chart draw function
function pieChart(labels, values, location, h, w){
    var data = [{
        values: values,
        labels: labels,
        type: 'pie',
        textinfo: "percent+value",
        textposition: "inside",
        automargin: true
    }];
      
    var layout = {
        height: h,
        width: w,
        margin: {"t": 0, "b": 0, "l": 0, "r": 0},
        showlegend: true,
        legend: {
            x: 1,
            y: 0.5
            },
        paper_bgcolor: '#13171f',
        font: {
            color: 'white'
          }
    };
      
    Plotly.newPlot(location, data, layout);
}
