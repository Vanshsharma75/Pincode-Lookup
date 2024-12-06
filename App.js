async function lookupPincode() {
    const pincode = document.getElementById('pincodeInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const loader = document.getElementById('loader');
    const results = document.getElementById('results');
    const filterInput = document.getElementById('filterInput');

    // Reset previous states
    errorMessage.textContent = '';
    results.innerHTML = '';
    filterInput.value = '';
    loader.style.display = 'block'; // Show loader

    // Validate pincode
    if (pincode.length !== 6 || isNaN(pincode)) {
        errorMessage.textContent = 'The postal code must be a 6-digit number.';
        loader.style.display = 'none'; // Hide loader
        return;
    }

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        if (data[0].Status === 'Success') {
            displayResults(data[0].PostOffice);
        } else {
            errorMessage.textContent = 'No data found for the provided pincode.';
        }
    } catch (error) {
        errorMessage.textContent = `Error fetching data: ${error.message}`;
    } finally {
        loader.style.display = 'none'; // Hide loader
    }
}

function displayResults(postOffices) {
    const results = document.getElementById('results');
    results.innerHTML = postOffices.map(postOffice => `
        <div class="post-office">
            <h2>${postOffice.Name}</h2>
            <p>Pincode: ${postOffice.Pincode}</p>
            <p>District: ${postOffice.District}</p>
            <p>State: ${postOffice.State}</p>
        </div>
    `).join('');
}

function filterResults() {
    const filterValue = document.getElementById('filterInput').value.toLowerCase();
    const postOffices = document.querySelectorAll('.post-office');
    let found = false;

    postOffices.forEach(postOffice => {
        const name = postOffice.querySelector('h2').textContent.toLowerCase();
        if (name.includes(filterValue)) {
            postOffice.style.display = 'block';
            found = true;
        } else {
            postOffice.style.display = 'none';
        }
    });

    if (!found) {
        const results = document.getElementById('results');
        results.innerHTML = `<p class="error">Couldn’t find the postal data you’re looking for...</p>`;
    }
}
