// Google Sheets API configuration
const API_KEY = 'AIzaSyBR9KadqpmS6TpR_OdIt6xK3KKOAhKDmEQ';
const SPREADSHEET_ID = '1GjAv-nJP4UIgMVVY5gNlrwuQTDb0aCWi60YpA2vda5c';
const RANGE = 'Sheet1!A2:C';

// Initialize the Google Sheets API
function initClient() {
    console.log('Initializing Google Sheets API...');
    gapi.client.init({
        'apiKey': API_KEY,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        console.log('API initialized successfully');
        loadPointsTable();
    }).catch(function(error) {
        console.error('Error initializing Google Sheets API:', error);
        document.getElementById('loader').innerHTML = 'Error: ' + error.message;
    });
}

// Load the points table data
function loadPointsTable() {
    console.log('Loading points table...');
    const loader = document.getElementById('loader');
    loader.style.display = 'block';  // Make sure loader is visible
    loader.innerHTML = 'Loading data...';

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE
    }).then(function(response) {
        console.log('Data received:', response.result);
        const values = response.result.values;
        updateTable(values);
        loader.style.display = 'none';
    }).catch(function(error) {
        console.error('Error loading data:', error);
        loader.innerHTML = 'Error loading data: ' + error.message;
    });
}

// Update the table with data from Google Sheets
function updateTable(values) {
    console.log('Updating table with values:', values);
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    if (values && values.length) {
        values.sort((a, b) => parseInt(b[2]) - parseInt(a[2]));

        values.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
            `;
            tableBody.appendChild(tr);
        });
    } else {
        console.log('No data received from Google Sheets');
        tableBody.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
    }
}

// Load the Google Sheets API
window.onload = function() {
    console.log('Page loaded, loading GAPI...');
    gapi.load('client', initClient);
};

// Refresh data every 5 minutes
setInterval(loadPointsTable, 300000); 