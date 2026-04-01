const billInput = document.getElementById('bill');
const tipRadios = document.querySelectorAll('input[name="tip"]');
const customTip = document.querySelector('[name="tip-custom"]');
const numPeopleInput = document.getElementById('num-people');

const tipResult = document.getElementById('tip-amount');
const totalResult = document.getElementById('total');
const resetBtn = document.querySelector('.c-bill-splitter__reset');

let activeCustomBtn;

const handleChange = () => {
    const billValue = Number(billInput.value);
    const numPersons = Number(numPeopleInput.value);
    let tip;

    if (Number(customTip.value) > 0) {
        tip = Number(customTip.value);
    } else if(document.querySelector('input[name="tip"]:checked')){
        tip = Number(document.querySelector('input[name="tip"]:checked').value);
    }

    activateResetButton();
    calcSplitBill(billValue, numPersons, tip)
}

const handleButton = (e) => {
    if(e.target === activeCustomBtn){
        activeCustomBtn.checked = false;
        activeCustomBtn.parentElement.classList.remove('is-active');
        activeCustomBtn = null;
        handleChange();
        return;
    }
    
    if (activeCustomBtn){
        activeCustomBtn.parentElement.classList.remove('is-active');
    }
    e.target.parentElement.classList.add('is-active');
    activeCustomBtn = e.target;
    customTip.value = '';

    handleChange()
}

const handleCustomTip = () => {
    if (activeCustomBtn){
        activeCustomBtn.checked = false;
        activeCustomBtn.parentElement.classList.remove('is-active');
    }
    
    handleChange()
}

const activateResetButton = () =>{
    if (!resetBtn.disabled){
        return
    } 
    resetBtn.disabled = false;
    resetBtn.classList.replace('is-disabled', 'is-active');
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

    tipRadios.forEach((button) => {
        button.parentElement.classList.remove('is-active');
        button.checked = false;
    });

    resetBtn.classList.replace('is-active', 'is-disabled');
    resetBtn.disabled = true;
}

billInput.addEventListener('input', handleChange);
numPeopleInput.addEventListener('input', handleChange);
tipRadios.forEach((button) => button.addEventListener('click', handleButton));
customTip.addEventListener('input', handleCustomTip);
resetBtn.addEventListener('click', resetResultValues);