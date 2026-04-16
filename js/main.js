// DOM + STATE
const billInput = document.getElementById('bill');
const tipRadios = document.querySelectorAll('input[name="tip"]');
const customTip = document.querySelector('[name="tip-custom"]');
const numPeopleInput = document.getElementById('num-people');

const tipResult = document.getElementById('tip-amount');
const totalResult = document.getElementById('total');
const resetBtn = document.querySelector('.c-bill-splitter__reset');

const numPeopleError = document.querySelector('.c-bill-splitter__error--num-people')

let activeTipButton;

// EVENT LISTENERS
billInput.addEventListener('input', handleChange);
numPeopleInput.addEventListener('input', () => {
    toggleResetButton();
    validateNumberOfPeople();
});
tipRadios.forEach((button) => button.addEventListener('click', handleButton));
customTip.addEventListener('input', handleCustomTip);
resetBtn.addEventListener('click', resetResultValues);

// HANDLERS
function handleChange() {
    const { billValue, numPeople, tip} = getFormValues();
    toggleResetButton();
    updateSplitBill(billValue, numPeople, tip)
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

    handleChange()
}

function handleCustomTip() {
    deactivateTipButton()
    handleChange()
}

// VALIDATION
function validateNumberOfPeople() {
    const v = numPeopleInput.validity
    const value = Number(numPeopleInput.value)

    if (v.rangeUnderflow){
        if (value === 0) {
            showError("Can't be zero");
            return;
        } else {
            showError("Can't be negative");
            return;
        }
    }

    if(v.stepMismatch){
        showError('No decimals allowed');
        return;
    }

    clearError();
    handleChange();
}

// CORE LOGIC
function updateSplitBill(billValue, numPeople, tipPercentage) {
    if (billValue <= 0 || numPeople <= 0){
        showValue(0, 0);
        return
    }

    const billPerPerson = billValue / numPeople;
    const tipPerPerson = billPerPerson * (tipPercentage / 100);
    const totalPerPerson = billPerPerson + tipPerPerson;

    showValue(tipPerPerson, totalPerPerson)
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
function showValue(tip, total) {
    tipResult.textContent = `$${tip.toFixed(2)}`;
    totalResult.textContent = `$${total.toFixed(2)}`;
}

function showError(msg){
    numPeopleInput.classList.add('is-error');
    numPeopleError.textContent = msg;
}

function clearError(){
    numPeopleInput.classList.remove('is-error');
    numPeopleError.textContent = '';
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
    showValue(0, 0);

    billInput.value = '';
    numPeopleInput.value = '';
    customTip.value = '';
    
    deactivateTipButton()
    toggleResetButton();
}