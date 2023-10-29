const form = document.getElementById('tipCalculatorForm');
const billTotalInput = document.getElementById('billTotal');
const tipInput = document.getElementById('tip');
const tipPercentageInput = document.getElementById('tipPercentage');
const tipAmountInput = document.getElementById('tipAmount');
const totalWithTipInput = document.getElementById('totalWithTip');

form.addEventListener('input', function () {
  const billTotal = parseFloat(billTotalInput.value);
  const tipPercentage = parseFloat(tipInput.value);

  if (isNaN(billTotal)) {
    alert('Please enter valid amount!');
    resetForm();
    return;
  }
  tipInput.disabled = false;
  tipPercentageInput.value = tipPercentage + '%';


  const tipAmount = (billTotal * tipPercentage) / 100;
  tipAmountInput.value = `$ ${tipAmount.toFixed(2)}`;

  const totalWithTip = billTotal + tipAmount;
  totalWithTipInput.value = `$ ${totalWithTip.toFixed(2)}`;
});


function resetForm() {
  billTotalInput.value = '';
  tipInput.value = 0;
  tipPercentageInput.value = '';
  tipAmountInput.value = '';
  totalWithTipInput.value = '';
  tipInput.disabled = true;
}