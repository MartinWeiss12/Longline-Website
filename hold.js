//show other text entry box if other button is clicked for Loan Purpose
function otherLoanFunction(cbox) {
  if (cbox.checked) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = "otherLoanText";
    input.name = "otherLoanText";
    input.placeholder = "Loan Purpose";
    input.required = true;
    input.autofocus = true;
    input.style.width = "150px";
    input.style.padding = "5px";
    input.style.border = "1px solid #0000FF";
    input.style.borderRadius = "4px";
    input.style.fontFamily = "inherit";
    input.style.fontSize = "15px";
    input.style.fontWeight = "bold";
    input.style.margin = "0 0 0 -410px";
    
    var div = document.createElement("div");
    div.id = cbox.name;
    div.appendChild(input);
    document.getElementById("insertOtherLoan").appendChild(div);
  } else {
    document.getElementById(cbox.name).remove();
  }
}

//show other text entry box if other button is clicked for Escrow
function otherEscrowFucntion(cbox) {
  if (cbox.checked) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = "otherEscrowText";
    input.name = "otherEscrowText";
    input.placeholder = "Escrow";
    input.required = true;
    input.autofocus = true;
    input.style.width = "150px";
    input.style.padding = "5px";
    input.style.margin = "18px 0 0 10px";
    input.style.border = "1px solid #0000FF";
    input.style.borderRadius = "4px";
    input.style.fontFamily = "inherit";
    input.style.fontSize = "15px";
    input.style.fontWeight = "bold";
    input.style.margin = "0 0 0 -410px";
    
    var div = document.createElement("div");
    div.id = cbox.name;
    div.appendChild(input);
    document.getElementById("insertOtherEscrow").appendChild(div);
  } else {
    document.getElementById(cbox.name).remove();
  }
}

//function to do the math for Loan Total and copy values around
function updateLoanAmount() {
  const trancheAmt = document.getElementById('trancheAmt').value;
  const numTranches = document.getElementById('numTranches').value;
  const loanTotalToCopy = document.getElementById("loanTotal");
  const escrowAmt = document.getElementById("escrowAmt");
  escrowAmt.value = loanTotalToCopy.value;
  
  //math for Loan Proceeds
  //will escrow always == loan??
  const orgFee = document.getElementById("orgFee");
  const loanProceeds = document.getElementById("loanProceeds");
  loanProceeds.value = escrowAmt.value * (1 - orgFee.value);
  
  if (isNaN(numTranches)) {
    return;
  }
  
  //math for Loan Total
  const loanTotal = parseInt(trancheAmt) * parseInt(numTranches);
  document.getElementById('loanTotal').value = loanTotal;
  
  //math for Disbursed Total
  const bankFees = document.getElementById("bankFees");
  const disbursedTotal = document.getElementById("disbursedTotal");
  disbursedTotal.value = loanProceeds.value - bankFees.value;

}

//set trancheAmt to 20,000
document.getElementById('trancheAmt').value = 20000;
//change update the loan amount based on numTranches
document.getElementById('numTranches').addEventListener('change', updateLoanAmount);

//lock 0.6% for Origination Fee
document.getElementById('orgFee').value = '0.6';
//lock 0.5% for Interest Rate
document.getElementById('interestRate').value = '0.5';

//lock Interest Rate dropdown as N/A
const intrestBinaryDropdown = document.getElementById("intrestBinaryDropdownID");
intrestBinaryDropdown.value = "interestNA";
intrestBinaryDropdown.disabled = true;

//lock Interest Payment dropdown as On-Maturity
const intrestPaymentDropdown = document.getElementById("intrestPaymentDropdownID");
intrestPaymentDropdown.value = "interestDueMat";
intrestPaymentDropdown.disabled = true;

//lock 24 weeks for Loan Term
document.getElementById('loanTerm').value = '24';

//lock 40 weeks for Bank Fees
document.getElementById('bankFees').value = '40';


const borrowerDropdown = document.getElementById("borrowerDropdown");
const individualBorrowerForm = document.getElementById("individualBorrowerForm");




//show other text entry box if other button is clicked for Loan Purpose
function handleBorrowerSelect() {
  const select = document.getElementById('borrowerDropdown');
  const selectedOption = select.options[select.selectedIndex].value;
  
  if (selectedOption === 'individualBorrower') {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "individualBorrowerText";
    input.name = "individualBorrowerText";
    input.placeholder = "Loan Purpose";
    input.required = true;
    input.autofocus = true;
    input.style.width = "150px";
    input.style.padding = "5px";
    input.style.border = "1px solid #0000FF";
    input.style.borderRadius = "4px";
    input.style.fontFamily = "inherit";
    input.style.fontSize = "15px";
    input.style.fontWeight = "bold";
    input.style.margin = "0 0 0 -443px";
    
    const div = document.createElement("div");
    div.id = "individualBorrowerDiv";
    div.appendChild(input);
    document.getElementById("insertIndividualBorrower").appendChild(div);
  } else {
    const div = document.getElementById("individualBorrowerDiv");
    if (div) {
      div.remove();
    }
  }
}




//footer
const currentYear = new Date().getFullYear();
const copyright = document.getElementById("copyright");
copyright.innerHTML = "&copy; " + currentYear + " Longline Lending LLC. All rights reserved."
