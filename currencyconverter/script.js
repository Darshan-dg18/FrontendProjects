const dropdowns = document.querySelectorAll("select");
const btn = document.querySelector("button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const amount = document.querySelector(".amount input");
const result = document.querySelector(".result");
const swapIcon = document.querySelector(".swap-icon");

// Add currency options to select elements
for (let select of dropdowns) {
    for (let currency_code in country_codes) {
        let option = document.createElement("option");
        option.value = currency_code;
        option.text = `${currency_code} - ${country_codes[currency_code].name}`;
        select.add(option);
        
        if (select.className === "from-currency" && currency_code === "USD") {
            option.selected = "selected";
        } else if (select.className === "to-currency" && currency_code === "INR") {
            option.selected = "selected";
        }
    }
    
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag when currency is changed
function updateFlag(element) {
    let currency_code = element.value;
    let country_code = country_codes[currency_code].flag;
    let imgTag = element.parentElement.querySelector("img");
    imgTag.src = `https://flagcdn.com/48x36/${country_code}.png`;
}

// Swap currencies
swapIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    updateFlag(fromCurrency);
    updateFlag(toCurrency);
    getExchangeRate();
});

// Get exchange rate from API
async function getExchangeRate() {
    let amountVal = amount.value || 1;
    result.innerText = "Getting exchange rate...";
    
    try {
        const response = await fetch(`https://api.exchangerate.host/convert?from=${fromCurrency.value}&to=${toCurrency.value}&amount=${amountVal}`);
        const data = await response.json();
        
        if (data.success) {
            const totalExchangeRate = data.result.toFixed(2);
            result.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        } else {
            throw new Error('Conversion failed');
        }
    } catch (error) {
        result.innerText = "Something went wrong... Please try again later.";
        console.error(error);
    }
}

// Event listeners
btn.addEventListener("click", getExchangeRate);
amount.addEventListener("input", getExchangeRate);

// Initial exchange rate calculation
getExchangeRate();
