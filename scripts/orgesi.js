document.getElementById('home').addEventListener('click', function() {
    window.location.href = "index.html";
});

async function readMultipleSheets() {
    var params = {
        spreadsheetId: '1hF08kPfRv9za8Gc9NrHVmqv0_p-VH2UBmANW598rdKc',
        ranges: ['Sheet1!A2:A20', 'Sheet2!A2:A20', 'Sheet3!A2:A20', 'Sheet4!A2:A20', 'Sheet5!A2:A20', 'Sheet6!A2:A20', 'Sheet7!A2:A20'],
        key: 'AIzaSyBAK47B66GmXhM2cYU43C_9kMo-TD2h0iM'
    };

    var url = `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values:batchGet?ranges=${params.ranges.join('&ranges=')}&key=${params.key}`;
    
    try {
        let response = await fetch(url);
        let data = await response.json();
        var sheetsData = data.valueRanges.map(valueRange => valueRange.values || []);
        return sheetsData;
    } catch (error) {
        console.error('Error: ', error);
        return [];  
    }
}

async function populateTable() {
    const tableBody = document.getElementById('table') ? document.getElementById('table').getElementsByTagName('tbody')[0] : null;
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }

    try {
        let data = await readMultipleSheets();
        const maxLength = Math.max(...data.map(rows => rows.length));
        for (let i = 0; i < maxLength; i++) {
            const newRow = tableBody.insertRow();
            data.forEach((col, index) => {
                newRow.insertCell(index).textContent = col[i] ? col[i].toString() : '';
            });
        }
    } catch (error) {
        console.error('Error populating table:', error);
    }
}

populateTable();
