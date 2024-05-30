const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const result = document.getElementById('result');
const convertButton = document.getElementById('convert-button');

let currencyRates = {}; // Store currency rates

// Function to fetch currency rates from the NBU API
async function fetchCurrencyRates() {
    try {
        const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        currencyRates = await response.json();
        populateCurrencySelects(); // Populate the dropdowns after fetching rates
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        // Handle errors gracefully (e.g., display an error message)
    }
}

// Function to populate currency dropdown options
function populateCurrencySelects() {
    const currencies = Object.values(currencyRates);

    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.cc;
        option.text = currency.txt;

        fromCurrencySelect.appendChild(option.cloneNode(true));
        toCurrencySelect.appendChild(option.cloneNode(true));
    });

    // Set default values (e.g., UAH as the initial currency)
    fromCurrencySelect.value = 'UAH';
    toCurrencySelect.value = 'USD';
}

// Function to convert currency
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (amount && fromCurrency && toCurrency) {
        // Corrected logic:
        const fromRate = currencyRates.find(rate => rate.cc === fromCurrency).rate;
        const toRate = currencyRates.find(rate => rate.cc === toCurrency).rate;

        // Correctly divide by the 'from' rate and multiply by the 'to' rate
        const convertedAmount = (amount * fromRate) / toRate;
        result.textContent = convertedAmount.toFixed(2);
    } else {
        result.textContent = 'Invalid input';
    }
}

// Event listeners
convertButton.addEventListener('click', convertCurrency);

// Fetch currency rates on page load
fetchCurrencyRates();