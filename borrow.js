// footer
const currentYear = new Date().getFullYear();
const copyright = document.getElementById("copyright");
copyright.innerHTML = "&copy; " + currentYear + " Longline Lending LLC. All rights reserved."

// show other text entry box if other button is clicked for Loan Purpose
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

// show other text entry box if other button is clicked for Escrow
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

// function to do the math for Loan Total and copy values around
function updateLoanAmount() {
  // get tranche amount as a str
  const trancheAmtStr = document.getElementById('trancheAmt').value;
  // replace the , to make tranche amount a number to do operations on
  const trancheAmt = parseFloat(trancheAmtStr.replace(",", ""));

  const numTranches = document.getElementById('numTranches').value;
  // hold variable for Loan Total
  const loanTotalToCopy = document.getElementById("loanTotal");
  const escrowAmt = document.getElementById("escrowAmt");
  escrowAmt.value = loanTotalToCopy.value;
  // local variable for Escrow Amount
  const localEscrowAmt = loanTotalToCopy.value.replace(",", "");

  // math for Loan Proceeds
  const orgFee = document.getElementById("orgFee");
  const loanProceeds = document.getElementById("loanProceeds");
  loanProceeds.value = ((Number(localEscrowAmt)) - (Number(localEscrowAmt) * (Number(orgFee.value.replace("%", "")))/100)).toLocaleString();


  if (isNaN(numTranches)) {
    return;
  }

  // math for Loan Total
  const loanTotal = parseInt(trancheAmt) * parseInt(numTranches);
  document.getElementById('loanTotal').value = Number(loanTotal).toLocaleString();

  // math for Disbursed Total
  const bankFees = document.getElementById("bankFees");
  const disbursedTotal = document.getElementById("disbursedTotal");
  disbursedTotal.value = (Number(loanProceeds.value.replace(",", "")) - Number(bankFees.value)).toLocaleString();

  // math for Origination Fee 
  const orgFeeUSD = document.getElementById("orgFeeUSD");
  orgFeeUSD.value = (Number(localEscrowAmt) * (Number(orgFee.value.replace("%", "")))/100).toLocaleString();

}

// set trancheAmt to 20,000
document.getElementById('trancheAmt').value = "20,000";
// change update the loan amount based on numTranches
document.getElementById('numTranches').addEventListener('change', updateLoanAmount);
document.getElementById('loanTotal').addEventListener('change', updateLoanAmount);

const loanTotalInput = document.getElementById('loanTotal');
const trancheAmtInput = document.getElementById('trancheAmt');
const numTranchesInput = document.getElementById('numTranches');

// Replace the , to make tranche amount a number to do operations on
const trancheAmt = parseFloat(trancheAmtInput.value.replace(",", ""));

// Function to calculate loan total and update loanTotalInput
function updateLoanTotal() {
  // Calculate loan total
  const loanTotal = trancheAmt * parseInt(numTranchesInput.value);
  
  // Update loan total input field with formatted loan total value
  loanTotalInput.value = Number(loanTotal).toLocaleString();
}

// Function to calculate number of tranches and update numTranchesInput
function updateNumTranches() {
  // Calculate number of tranches
  const numTranches = parseInt(loanTotalInput.value.replace(",", "")) / trancheAmt;
  
  // Update numTranches input field with formatted number of tranches value
  numTranchesInput.value = Number(numTranches).toLocaleString();
}

// Event listener for loan total input field
loanTotalInput.addEventListener('input', function() {
  // Check if the loanTotalInput input field has a value
  if (loanTotalInput.value) {
    const quotient = parseInt(loanTotalInput.value.replace(",", "")) / trancheAmt;
    if (Number.isInteger(quotient)) {
      // Update numTranches based on loanTotal/trancheAmt
      updateNumTranches();
    }
  } else {
    // Clear numTranches input field if loan total is empty
    numTranchesInput.value = "";
  }
});


// Event listener for number of tranches input field
numTranchesInput.addEventListener('input', function() {
  // Check if the numTranchesInput input field has a value
  if (numTranchesInput.value) {
    // Update loanTotal based on trancheAmt*numTranches
    updateLoanTotal();
  } else {
    // Clear loanTotal if numTranchesInput is empty
    loanTotalInput.value = '';
  }
});

// Event listener for tranche amount input field
trancheAmtInput.addEventListener('input', function() {
  // Replace the , to make tranche amount a number to do operations on
  trancheAmt = parseFloat(trancheAmtInput.value.replace(",", ""));
  
  // Check if the loanTotalInput input field has a value
  if (loanTotalInput.value) {
    // Update numTranches based on loanTotal/trancheAmt
    updateNumTranches();
  } else {
    // Update loanTotal based on trancheAmt*numTranches
    updateLoanTotal();
  }
});

// lock 0.6% for Origination Fee
document.getElementById('orgFee').value = '0.6%';

// lock 0.5% for Interest Rate
document.getElementById('interestRate').value = '2%';

// lock 24% months for APR
document.getElementById('apr').value = '24%';

//lock Interest Rate dropdown as N/A
const intrestBinaryDropdown = document.getElementById("intrestBinaryDropdownID");
intrestBinaryDropdown.value = "interestNA";
intrestBinaryDropdown.disabled = true;

// lock Interest Payment dropdown as On-Maturity
const intrestPaymentDropdown = document.getElementById("intrestPaymentDropdownID");
intrestPaymentDropdown.value = "interestDueMat";
intrestPaymentDropdown.disabled = true;

// lock 6 months for Loan Term
document.getElementById('loanTerm').value = '6';

// lock 40 weeks for Bank Fees
document.getElementById('bankFees').value = '40';

const entityContainer = document.getElementById("entityBorrowerDetails");
// base html for entity details
const htmlForEntity = `
    <div class="labels">
      <label id="entityNameLabel" for="entityNameLabel">Entity Name</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityName" name="entityName" placeholder="Entity Name" required style="width: 150px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityCountryLabel" for="entityCountryLabel">Entity Country of Formation</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityCountry" name="entityCountry" placeholder="Entity Country" required style="width: 150px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityStreetAddressLabel" for="entityStreetAddressLabel">Entity Street Address</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityStreetAddress" name="entityStreetAddress" placeholder="Entity Street Address" required style="width: 150px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityCityLabel" for="entityCityLabel">Entity City</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityCity" name="entityCity" placeholder="Entity City" required style="width: 150px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityStateLabel" for="entityStateLabel">Entity State or Province</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityState" name="entityState" placeholder="Entity State or Province" required style="width: 150px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityZipLabel" for="entityZipLabel">Entity Zip</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityZip" name="entityZip" placeholder="Entity Zip" required style="width: 150px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityWebsiteLabel" for="entityWebsiteLabel">Entity Website</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityWebsite" name="entityWebsite" placeholder="Entity Website" required style="width: 150px;">
    </div>
  </div>
  
  <br><br><h3>Upload PDF or Image for each of the Following</h3>
  
  <div class="labels">
    <label id="entityArticlesLabel" for="entityArticlesLabel">Articles of Organization</label>
  </div>
  <div class="input-tab">
    <label for="entityArticlesFile" class="fileUploadButton">Choose File
    <input id="entityArticlesFile" type="file" name="entityArticlesFile" style="display:none" onchange="displayFileName('entityArticlesFile', 'entityArticlesFileNameSpan')">
  </label>
    <span id="entityArticlesFileNameSpan">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="entityCertFileLabel" for="entityCertFileLabel">Certificate of Formation</label>
  </div>
  <div class="input-tab">
    <label for="entityCertFile" class="fileUploadButton">Choose File
    <input id="entityCertFile" type="file" name="entityCertFile" style="display:none" onchange="displayFileName('entityCertFile', 'entityCertFileNameSpan')">
  </label>
    <span id="entityCertFileNameSpan">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="entityEinFileLabel" for="entityEinFileLabel">EIN / Other</label>
  </div>
  <div class="input-tab">
    <label for="entityEinFile" class="fileUploadButton">Choose File
      <input id="entityEinFile" type="file" name="entityEinFile" style="display:none" onchange="displayFileName('entityEinFile', 'entityEinFileNameSpan')">
    </label>
    <span id="entityEinFileNameSpan">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="entityBankAcctFileLabel" for="entityBankAcctFileLabel">Bank Account Statement of Entity</label>
  </div>
  <div class="input-tab">
    <label for="entityBankAcctFile" class="fileUploadButton">Choose File
      <input id="entityBankAcctFile" type="file" name="entityBankAcctFile" style="display:none" onchange="displayFileName('entityBankAcctFile', 'entityBankAcctFileNameSpan')">
    </label>
    <span id="entityBankAcctFileNameSpan">Uploaded File: None</span>
  </div>

`;
// function for if borrower is an entity
function handleBorrowerSelect() {
  var select = document.getElementById("borrowerDropdown");
  var option = select.options[select.selectedIndex];
  
  if (option.value == "entityBorrower") {
    entityContainer.innerHTML = htmlForEntity;
  } else {
    entityContainer.innerHTML = "";
  }
}

// function to display file name of uploaded file
function displayFileName(inputId, spanId) {
  var fileInput = document.getElementById(inputId);
  var fileNameSpan = document.getElementById(spanId);
  if (fileInput.files.length > 0) {
    fileNameSpan.innerHTML = 'Uploaded File: ' + fileInput.files[0].name;
  } else {
    fileNameSpan.innerHTML = 'Uploaded File: None';
  }
}



// base html for UBO
const baseHtml = `

  <br><h3 id="subtitle">Info for UBO {{index}}</h3>

  <div class="labels">
    <label for="dropdown">Control Person Authorized to Apply for, Take, and Execute, Loan?</label>
  </div>
  <div class="input-tab">
    <select id="controlPersonAuthDropdown" name="controlPersonAuthDropdown{{index}}">
      <option disabled value selected>Select an option</option>
      <option value="controlPersonAuthYes{{index}}">Yes</option>
      <option value="controlPersonAuthNo{{index}}">No</option>
    </select>
  </div>

  <div class="labels">
    <label for="dropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="personalGuarantorDropdown" name="personalGuarantorDropdown{{index}}">
      <option disabled value selected>Select an option</option>
      <option value="personalGuarantorYes{{index}}">Yes</option>
      <option value="personalGuarantorNo{{index}}">No</option>
    </select>
  </div>

  <div class="labels">
    <label for="dropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="usCitizenDropdown" name="usCitizenDropdown{{index}}">
      <option disabled value selected>Select an option</option>
      <option value="usCitizenYes{{index}}">Yes</option>
      <option value="usCitizenYes{{index}}">No</option>
    </select>
  </div>

  <div class="labels">
    <label id="firstName" for="firstName">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="firstName{{index}}" name="firstName{{index}}" placeholder="First Name(s)" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="middleName" for="middleName">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="middleName{{index}}" name="middleName{{index}}" placeholder="Middle Name(s)" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="name-label" for="name">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="lastName{{index}}" name="lastName{{index}}" placeholder="Last Name(s)" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="homeBankAddressLabel" for="homeBankAddressLabel">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeAddress{{index}}" name="homeAddress{{index}}" placeholder="Home Address" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="homeCountryLabel" for="homeCountryLabel">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeCountry{{index}}" name="homeCountry{{index}}" placeholder="Home Country" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="homeStreetAddressLabel" for="homeStreetAddressLabel">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeStreetAddress{{index}}" name="homeStreetAddress{{index}}" placeholder="Home Street Address" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="homeCityLabel" for="homeCityLabel">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeCity{{index}}" name="homeCity{{index}}" placeholder="Home City" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="homeStateLabel" for="homeStateLabel">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeState{{index}}" name="homeState{{index}}" placeholder="Home State or Province" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="homeZipLabel" for="homeZipLabel">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeZip{{index}}" name="homeZip{{index}}" placeholder="Home Zip" style="width: 150px;">
  </div>

  <div class="labels">
    <label for="dropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="ownRentDropdown" name="ownRentDropdown{{index}}">
      <option disabled value selected>Select an option</option>
      <option value="own{{index}}">Own</option>
      <option value="rent{{index}}">Rent</option>
    </select>
  </div>

  <div class="labels">
    <label id="mortgageLabel" for="mortgageLabel">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="monthlyRent{{index}}" name="monthlyRent{{index}}" placeholder="Monthly Mortgage or Rent" style="width: 150px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>

  <div class="labels">
    <label id="passportNumberLabel" for="passportNumberLabel">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="passportNumber{{index}}" name="passportNumber{{index}}" placeholder="Passport Number" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="ssnLabel" for="ssnLabel">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="ssn{{index}}" name="ssn{{index}}" placeholder="SSN or ID Number" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="dobLabel" for="dobLabel">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="dob{{index}}" name="dob{{index}}">
  </div>

  <div class="labels">
    <label id="emailLabel" for="emailLabel">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="email{{index}}" name="email{{index}}" placeholder="email@email.com" style="width: 350px;">
  </div>

  <div class="labels">
    <label id="phoneLabel" for="phoneLabel">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="phone{{index}}" name="phone{{index}}" placeholder="Telephone" style="width: 150px;">
  </div>

  <div class="labels">
    <label id="ficoLabel" for="ficoLabel">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="ficoScore{{index}}" name="ficoScore{{index}}" placeholder="FICO or NOSIS Score" style="width: 150px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>

  <div class="labels">
    <label id="incomeLabel" for="incomeLabel">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="income{{index}}" name="income{{index}}" placeholder="Monthly Income in USD" style="width: 150px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>

  <br><br><div style="font-size: 18px; width: 600px; margin-left: 375px;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>

  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="pep{{index}}" value="yesPep{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="pep{{index}}" value="no{{index}}">No</label>
  </div>

  <br><br><div style="font-size: 18px; width: 600px; margin-left: 375px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>

  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="crime{{index}}" value="yesCrime{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="crime{{index}}" value="noCrime{{index}}">No</label>
  </div>

  <br><br><div style="font-size: 18px; width: 600px; margin-left: 375px;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>

  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="declareCheckbox{{index}}" value="declareCheckbox">I declare that the above information is true and correct.<br>
  </div> 

  <div class="addUboContainer">
    <div class="btn">
      <button id="addUboButton{{index}}" type="button">Add Another UBO</button>
    </div>
  </div>
`;

// Get references to the add button and the div where the HTML will be added
const uboInfoDiv = document.getElementById('uboInfo');


// Define a variable to keep track of the number of times the button has been clicked
let uboCount = 2;

function addEventListenersToButtons() {
  for (let i = 1; i <= 9; i++) {
    // Get a reference to the add button for this iteration
    const addButton = document.getElementById(`addUboButton${i}`);
    const removeButton = document.getElementById(`removeUboButton${i}`);
    
    // Add an event listener to the add button
    addButton.addEventListener('click', function() {
      // Only add HTML if the click count is less than or equal to 8
      if (uboCount < 9) {
        // Add the base HTML to the div
        const htmlWithIndex = baseHtml.replace(/{{index}}/g, uboCount);
        uboInfoDiv.insertAdjacentHTML('beforeend', htmlWithIndex);
        
        // Increment the click count
        uboCount++;
        
        // Call the function to add event listeners to the buttons again
        addEventListenersToButtons();
      }
    });
  }
}

// Call the function to add event listeners to the buttons initially
addEventListenersToButtons();

// Update uboCount here
uboCount = 3;
addEventListenersToButtons(); // Call the function again to update the event listeners


// container for bankOtherInputContainer
const bankOtherInputContainer = document.getElementById("bankOtherInputContainer");
const otherBankAccountHtml = `
      <div class="labels">
        <label id="bankAccountOtherText" for="bankAccountOtherText">Please Specify</label>
      </div>
      <div class="input-tab">
        <input class="input-field" type="text" id="bankAccountOther" name="bankAccountOther" placeholder="Other Bank Account Type" required style="width: 150px;">
      </div>
    </div>
    `;

// show above html if other is selected for bank account type
function otherBankAccountType() {
  var select = document.getElementById("bankAccountTypeDropdown");
  var option = select.options[select.selectedIndex];
  
  if (option.value == "bankOther") {
    bankOtherInputContainer.innerHTML = otherBankAccountHtml;
  } else {
    bankOtherInputContainer.innerHTML = "";
  }
}


const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", function () {
  window.jsPDF = window.jspdf.jsPDF;
  var docPDF = new jsPDF();
  var elementHTML = document.querySelector("#entireForm");
  docPDF.html(elementHTML, {
    callback: function () {
      const currentDate = new Date().toISOString().slice(0, 10); // get current date in YYYY-MM-DD format
      const filename = `${firstName1.value}_${lastName1.value}_${currentDate}.pdf`; // create filename using values from the form and the current date
      docPDF.save(filename); // save the file with the generated filename
    },
    width: 50,
    windowWidth: 450,
  });
});





//const submitButton = document.getElementById("submit");
//submitButton.addEventListener("click", function () {
//window.jsPDF = window.jspdf.jsPDF;
//var docPDF = new jsPDF();
//var elementHTML = document.querySelector("#entireForm");
//});


