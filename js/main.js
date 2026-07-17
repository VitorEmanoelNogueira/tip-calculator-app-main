// DOM + STATE
const billInput = document.getElementById('bill');
const tipRadios = document.querySelectorAll('input[name="tip"]');
const customTip = document.querySelector('[name="tip-custom"]');
const numPeopleInput = document.getElementById('num-people');

const tipResult = document.getElementById('tip-amount');
const totalResult = document.getElementById('total');
const resetBtn = document.querySelector('.c-bill-splitter__reset');
const resultAnnouncement = document.getElementById('results-announcement');

const billError = document.getElementById('bill-error');
const numPeopleError = document.getElementById('num-people-error')

let activeTipButton;
let annoucementTimeOut;

// EVENT LISTENERS
[billInput, numPeopleInput].forEach((input) => {
    input.addEventListener('input', (e) => {
        validateInput(e.target)
    })
})

tipRadios.forEach((button) => button.addEventListener('change', handleButton));
customTip.addEventListener('input', handleCustomTip);
resetBtn.addEventListener('click', resetResultValues);

// HANDLERS
function handleChange() {
    const { billValue, numPeople, tip } = getFormValues();
    toggleResetButton();
    updateSplitBill(billValue, numPeople, tip);
}

function handleButton(e) {
    if(e.target === activeTipButton){
        deactivateTipButton();
        handleChange();
        return;
    }
    
    if (activeTipButton){
        deactivateTipButton();
    }
    e.target.parentElement.classList.add('is-active');
    activeTipButton = e.target;
    customTip.value = '';

    handleChange();
}

function handleCustomTip() {
    deactivateTipButton();
    handleChange();
}

// VALIDATION
function validateInput(input) {
    const v = input.validity;
    const value = Number(input.value);
    toggleResetButton();
    

    if (v.rangeUnderflow){
        if (value === 0) {
            showError(input, "Can't be zero");
            return;
        } else {
            showError(input, "Can't be negative");
            return;
        }
    }

    if(v.stepMismatch){
        if(input === billInput){
        showError(input, 'No more than 2 decimals');
        return;
        } else{
            showError(input, 'No decimals allowed');
            return;
        }
    }

    clearError(input);
    handleChange();
}

// CORE LOGIC
function updateSplitBill(billValue, numPeople, tipPercentage) {
    if (billValue <= 0 || numPeople <= 0){
        updateResults(0, 0);
        return
    }

    const billPerPerson = billValue / numPeople;
    const tipPerPerson = billPerPerson * (tipPercentage / 100);
    const totalPerPerson = billPerPerson + tipPerPerson;

    updateResults(tipPerPerson, totalPerPerson);
}

function getFormValues() {
    return {
        billValue: Number(billInput.value),
        numPeople: Number(numPeopleInput.value),
        tip: Number(customTip.value) > 0 
            ? Number(customTip.value)
            : getSelectedTip()
    }
}

function getSelectedTip() {
    return activeTipButton ? Number(activeTipButton.value) : 0;
}

// UI HELPERS
function updateResults(tip, total) {
    tipResult.textContent = `$${tip.toFixed(2)}`;
    totalResult.textContent = `$${total.toFixed(2)}`;

    // Delay result announcement to allow screen reader to announce input changes first
    clearTimeout(annoucementTimeOut)
    annoucementTimeOut = setTimeout(() => {
        resultAnnouncement.textContent = `Tip amount per person ${tip.toFixed(2)}. Total per person ${total.toFixed(2)}.`;
    }, 500)
}

function showError(input, msg){
    if (input === billInput){
        billInput.classList.add('is-error');
        billError.textContent = msg;
    }
    
    if (input === numPeopleInput){
        numPeopleInput.classList.add('is-error');
        numPeopleError.textContent = msg;
    }
}

function clearError(input){
    if (input === billInput){
        billInput.classList.remove('is-error');
        billError.textContent = '';
    }

    if (input === numPeopleInput){
    numPeopleInput.classList.remove('is-error');
    numPeopleError.textContent = '';
    }
}

function deactivateTipButton() {
    if (!activeTipButton) return;
    activeTipButton.checked = false;
    activeTipButton.parentElement.classList.remove('is-active');
    activeTipButton = null;
}

function toggleResetButton() {
    if (isFormEmpty()){
        resetBtn.classList.replace('is-active', 'is-disabled');
        resetBtn.disabled = true;
    } else{
        resetBtn.disabled = false;
        resetBtn.classList.replace('is-disabled', 'is-active');
    }

}

function isFormEmpty() {
    return (
        billInput.value === '' &&
        numPeopleInput.value === '' &&
        !activeTipButton &&
        customTip.value === ''
    );
}

function resetResultValues() {
    if (resetBtn.disabled) return;
    updateResults(0, 0);

    billInput.value = '';
    numPeopleInput.value = '';
    customTip.value = '';
    
    deactivateTipButton();
    toggleResetButton();
}