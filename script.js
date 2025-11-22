let isUpdating = false;
const currencyToCountry = {};
const dropdowns = document.querySelectorAll('.dropdown');
let rates = {};


async function loadAllCurrencies(){
const res = await fetch("https://open.er-api.com/v6/latest/USD");
const data = await res.json();
rates = data.rates;
const codes = Object.keys(rates);


codes.forEach(code => currencyToCountry[code] = code.slice(0,2));
dropdowns.forEach(dd => {
const menu = dd.querySelector('.dropdown-content');
codes.forEach(code => {
const div = document.createElement('div');
div.dataset.code = code;
div.innerHTML = `<img src="https://flagsapi.com/${currencyToCountry[code]}/flat/64.png" class="flag"> ${code}`;
menu.appendChild(div);
});
});
}
loadAllCurrencies();


dropdowns.forEach(dd => {
const btn = dd.querySelector('.dropdown-btn');
btn.addEventListener('click', () => dd.classList.toggle('show'));
dd.addEventListener('click', e => {
if(e.target.closest('div[data-code]')){
const code = e.target.closest('div[data-code]').dataset.code;
updateFlag(btn, code);
convert();
}
});
});


function updateFlag(btn, code){
btn.dataset.code = code;
btn.innerHTML = `<img src="https://flagsapi.com/${currencyToCountry[code]}/flat/64.png" class="flag"> ${code} <span class='arrow'>▼</span>`;
}
// function convert(){
// const amount = parseFloat(document.querySelector('.amount:not([readonly])').value) || 0;
// const from = document.querySelector('.from-dropdown .dropdown-btn').dataset.code;
// const to = document.querySelector('.to-dropdown .dropdown-btn').dataset.code;
// if(!rates[from] || !rates[to]) return;
// const result = amount * (rates[to] / rates[from]);
// document.querySelector('.amount[readonly]').value = result.toFixed(2);
// document.querySelector('.exchange-rate strong').textContent = `1 ${from} = ${(rates[to] / rates[from]).toFixed(4)} ${to}`;
// }
function convert(direction = "from") {
    if (isUpdating) return;
    isUpdating = true;

    const inputs = document.querySelectorAll('.amount');
    const inputFrom = inputs[0];
    const inputTo = inputs[1];

    const from = document.querySelector('.from-dropdown .dropdown-btn').dataset.code;
    const to = document.querySelector('.to-dropdown .dropdown-btn').dataset.code;

    if (!rates[from] || !rates[to]) {
        isUpdating = false;
        return;
    }

    let result;

    if (direction === "from") {
        const amount = parseFloat(inputFrom.value) || 0;
        result = amount * (rates[to] / rates[from]);
        inputTo.value = result.toFixed(2);
    } else {
        const amount = parseFloat(inputTo.value) || 0;
        result = amount * (rates[from] / rates[to]);
        inputFrom.value = result.toFixed(2);
    }

    document.querySelector('.exchange-rate strong').textContent =
        `1 ${from} = ${(rates[to] / rates[from]).toFixed(4)} ${to}`;

    isUpdating = false;
}



document.getElementById('swap-btn').addEventListener('click', () => {
const fromBtn = document.querySelector('.from-dropdown .dropdown-btn');
const toBtn = document.querySelector('.to-dropdown .dropdown-btn');
const temp = fromBtn.innerHTML;
const tempCode = fromBtn.dataset.code;
fromBtn.innerHTML = toBtn.innerHTML;
fromBtn.dataset.code = toBtn.dataset.code;
toBtn.innerHTML = temp;
toBtn.dataset.code = tempCode;
convert();
});
const inputs = document.querySelectorAll('.amount');

inputs[0].addEventListener("input", () => convert("from"));
inputs[1].addEventListener("input", () => convert("to"));
