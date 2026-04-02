const billInput = document.getElementById('bill');
const tipRadios = document.querySelectorAll('input[name="tip"]');
const customTip = document.querySelector('[name="tip-custom"]');
const numPeopleInput = document.getElementById('num-people');

const tipResult = document.getElementById('tip-amount');
const totalResult = document.getElementById('total');
const resetBtn = document.querySelector('.c-bill-splitter__reset');

let activeTipButton;

const handleChange = () => {
    const billValue = Number(billInput.value);
    const numPersons = Number(numPeopleInput.value);
    let tip;

    if (Number(customTip.value) > 0) {
        tip = Number(customTip.value);
    } else if(document.querySelector('input[name="tip"]:checked')){
        tip = Number(document.querySelector('input[name="tip"]:checked').value);
    }

    toggleResetButton();
    calcSplitBill(billValue, numPersons, tip)
}

const handleButton = (e) => {
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

const deactivateTipButton = () => {
    if (!activeTipButton) return;
    activeTipButton.checked = false;
    activeTipButton.parentElement.classList.remove('is-active');
    activeTipButton = null;
}

const handleCustomTip = () => {
    deactivateTipButton()
    handleChange()
}

const calcSplitBill = (billValue, numPersons, tipPercentage = 0) => {
    if (billValue <=0 || numPersons <= 0){
        return
    }

    const billPerPerson = billValue / numPersons;
    const tipPerPerson = billPerPerson * (tipPercentage / 100);
    const totalPerPerson = billPerPerson + tipPerPerson;

    console.log(`$Total: ${totalPerPerson} Tip: ${tipPerPerson}`);
    showValue(tipPerPerson, totalPerPerson)
}

const showValue = (tip, total) => {
    tipResult.textContent = `$${tip.toFixed(2)}`;
    totalResult.textContent = `$${total.toFixed(2)}`;
}

const resetResultValues = () => {
    if (!resetBtn.classList.contains('is-active')){
        return
    }
    
    tipResult.textContent = `$0.00`;
    totalResult.textContent = `$0.00`;

    billInput.value = '';
    numPeopleInput.value = '';
    customTip.value = '';
    deactivateTipButton()
    
    toggleResetButton();
}


const toggleResetButton = () => {
    if (
        billInput.value === '' &&
        numPeopleInput.value === '' &&
        !activeTipButton &&
        customTip.value === ''
      ){
        resetBtn.classList.replace('is-active', 'is-disabled');
        resetBtn.disabled = true;
    } else{
        resetBtn.disabled = false;
        resetBtn.classList.replace('is-disabled', 'is-active');
    }

}


billInput.addEventListener('input', handleChange);
numPeopleInput.addEventListener('input', handleChange);
tipRadios.forEach((button) => button.addEventListener('click', handleButton));
customTip.addEventListener('input', handleCustomTip);
resetBtn.addEventListener('click', resetResultValues);