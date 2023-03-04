// footer
const currentYear = new Date().getFullYear();
const copyright = document.getElementById("copyright");
copyright.innerHTML = "&copy; " + currentYear + " Longline Lending LLC. All rights reserved."

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


const submitButton = document.getElementById("submit");


function handleLoanPurposeCheckboxes(checkbox) {
  // If the checkbox was checked, remove the "required" attribute from all other checkboxes
  if (checkbox.checked) {
    const checkboxes = document.getElementsByName('loanPurpose');
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] !== checkbox) {
        checkboxes[i].removeAttribute('required');
      }
    }
  }
}

function handleCollateralCheckboxes(checkbox) {
  // If the checkbox was checked, remove the "required" attribute from all other checkboxes
  if (checkbox.checked) {
    const checkboxes = document.getElementsByName('collateralInfo');
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] !== checkbox) {
        checkboxes[i].removeAttribute('required');
      }
    }
  }
}


// show other text entry box if other button is clicked for Loan Purpose
function otherLoanFunction(cbox) {
  if (cbox.checked) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = "otherLoanText";
    input.name = "otherLoanText";
    input.placeholder = "Other Loan Purpose";
    input.required = true;
    input.style.width = "150px";
    input.style.padding = "5px";
    input.style.border = "1px solid #0000FF";
    input.style.borderRadius = "4px";
    input.style.fontFamily = "inherit";
    input.style.fontSize = "15px";
    input.style.fontWeight = "bold";
    input.style.margin = "0 0 0 -600px";
    
    var div = document.createElement("div");
    div.id = cbox.name;
    div.appendChild(input);
    document.getElementById("insertOtherLoan").appendChild(div);
  } else {
    document.getElementById(cbox.name).remove();
  }
}

// show other text entry box if other button is clicked for Collateral
function otherCollateralFucntion(cbox) {
  if (cbox.checked) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = "otherCollateralText";
    input.name = "otherCollateralText";
    input.placeholder = "Other Collateral";
    input.required = true;
    input.style.width = "150px";
    input.style.padding = "5px";
    input.style.margin = "18px 0 0 10px";
    input.style.border = "1px solid #0000FF";
    input.style.borderRadius = "4px";
    input.style.fontFamily = "inherit";
    input.style.fontSize = "15px";
    input.style.fontWeight = "bold";
    input.style.margin = "0 0 0 -600px";
    
    var div = document.createElement("div");
    div.id = cbox.name;
    div.appendChild(input);
    document.getElementById("insertOtherCollateral").appendChild(div);
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
  const collateralValue = document.getElementById("collateralValue");
  collateralValue.value = loanTotalToCopy.value;
  // local variable for local Collateral Value
  const localCollateralValue = loanTotalToCopy.value.replace(",", "");

  // math for Loan Proceeds
  const orgFeePoints = document.getElementById("orgFeePoints");
  const loanProceeds = document.getElementById("loanProceeds");
  loanProceeds.value = ((Number(localCollateralValue)) - (Number(localCollateralValue) * (Number(orgFeePoints.value.replace("%", "")))/100)).toLocaleString();


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
  orgFeeUSD.value = (Number(localCollateralValue) * (Number(orgFeePoints.value.replace("%", "")))/100).toLocaleString();

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
document.getElementById('orgFeePoints').value = '0.6%';

// lock 0.5% for Interest Rate
document.getElementById('interestRate').value = '2%';

// lock 24% months for APR
document.getElementById('apr').value = '24%';

//lock Interest Rate dropdown as N/A
const interestDropdown = document.getElementById("interestDropdownID");
interestDropdown.value = "N/A";
interestDropdown.disabled = true;

// lock Interest Payment dropdown as On-Maturity
const interestPaymentDropdown = document.getElementById("interestPaymentDropdownID");
interestPaymentDropdown.value = "On-Maturity";
interestPaymentDropdown.disabled = true;

// lock 6 months for Loan Term
document.getElementById('loanTerm').value = '6';

// lock 40 weeks for Bank Fees
document.getElementById('bankFees').value = '40';


// container for bankOtherInputContainer
const bankOtherInputContainer = document.getElementById("bankOtherInputContainer");
const otherBankAccountHtml = `
      <div class="labels">
        <label id="bankAccountOtherTextLabel" for="bankAccountOtherText">Please Specify</label>
      </div>
      <div class="input-tab">
        <input class="input-field" type="text" id="bankAccountOther" name="bankAccountOther" placeholder="Other Bank Account Type" style="width: 150px;">
      </div>
    </div>
    `;

// show above html if other is selected for bank account type
function otherBankAccountType() {
  var select = document.getElementById("bankAccountTypeDropdown");
  var option = select.options[select.selectedIndex];
  
  if (option.value == "Other") {
    bankOtherInputContainer.innerHTML = otherBankAccountHtml;
  } else {
    bankOtherInputContainer.innerHTML = "";
  }
}

const entityContainer = document.getElementById("borrowerSpecificDetails");

// html for individual Step 6 title
const htmlForIndividualTitle = `
    
  <br><br><br><h2 id="stepSixIndividualTitle">Step 6 - Individual Info</h2><br>
  <br><h2 id="stepSixIndividualSubtitle1"> At Least ONE Individual is Required</h2><br>
  <br><h3 id="stepSixIndividualSubtitle2">There is a max of 8 Individuals</h3>


`;
  
// base html for entity details
const htmlForEntity = `
  <div class="labels">
      <label id="entityNameLabel" for="entityName">Entity Name</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityName" name="entityName" placeholder="Entity Name" required style="width: 250px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityCountryLabel" for="entityCountry">Entity Country of Formation</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityCountry" name="entityCountry" placeholder="Entity Country" required style="width: 250px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityStreetAddressLabel" for="entityStreetAddress">Entity Street Address</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityStreetAddress" name="entityStreetAddress" placeholder="Entity Street Address" required style="width: 250px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityCityLabel" for="entityCity">Entity City</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityCity" name="entityCity" placeholder="Entity City" required style="width: 250px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityStateLabel" for="entityState">Entity State or Province</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityState" name="entityState" placeholder="Entity State or Province" required style="width: 250px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityZipLabel" for="entityZip">Entity Zip</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityZip" name="entityZip" placeholder="Entity Zip" required style="width: 250px;">
    </div>
  </div>

  <div class="labels">
      <label id="entityWebsiteLabel" for="entityWebsite">Entity Website</label>
    </div>
    <div class="input-tab">
      <input class="input-field" type="text" id="entityWebsite" name="entityWebsite" placeholder="Entity Website" required style="width: 250px;">
    </div>
  </div>
  
  <br><br><h3>Upload PDF or Image for Each of the Following</h3>
  
  <div class="labels">
    <label id="entityArticlesLabel" for="entityArticles">Articles of Organization</label>
  </div>
  <div class="input-tab">
    <label for="entityArticlesFile" class="fileUploadButton">Choose File
    <input id="entityArticlesFile" type="file" name="entityArticlesFile" style="position:absolute; left:-999999px;" onchange="displayFileName('entityArticlesFile', 'entityArticlesFileNameSpan')" required>
  </label>
    <span id="entityArticlesFileNameSpan">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="entityCertFileLabel" for="entityCertFile">Certificate of Formation</label>
  </div>
  <div class="input-tab">
    <label for="entityCertFile" class="fileUploadButton">Choose File
    <input id="entityCertFile" type="file" name="entityCertFile" style="position:absolute; left:-999999px;" required onchange="displayFileName('entityCertFile', 'entityCertFileNameSpan')" required>
  </label>
    <span id="entityCertFileNameSpan">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="entityEinFileLabel" for="entityEinFile">EIN</label>
  </div>
  <div class="input-tab">
    <label for="entityEinFile" class="fileUploadButton">Choose File
      <input id="entityEinFile" type="file" name="entityEinFile" style="position:absolute; left:-999999px;" onchange="displayFileName('entityEinFile', 'entityEinFileNameSpan')">
    </label>
    <span id="entityEinFileNameSpan">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="entityOtherFileLabel" for="entityOtherFile">Other</label>
  </div>
  <div class="input-tab">
    <label for="entityOtherFile" class="fileUploadButton">Choose File
      <input id="entityOtherFile" type="file" name="entityOtherFile" style="position:absolute; left:-999999px;" onchange="displayFileName('entityOtherFile', 'entityOtherFileNameSpan')">
    </label>
    <span id="entityOtherFileNameSpan">Uploaded File: None</span>
  </div>

  <br><br><br><h2 id="stepSixUboTitle">Step 6 - UBO and Director Info</h2><br>  
  <br><h2 id="stepSixUboSubtitle"> At Least ONE UBO is Required</h2><br>
  <br><h3 id="uboInfoSubtitle1">Please add UBOs THEN Directors</h3>
  <br><h3 id="uboInfoSubtitle2">There is a max of 8 UBOs and 8 Directors</h3>
  
`;

const htmlForAdditionalIndividual = `
    
  <br><br><h3 id="individualInfoSubtitle{{index}}">Info for Individual {{index}}</h3>
  
  <div class="labels">
    <label for="individualPersonalGuarantorDropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="individualPersonalGuarantorDropdown" name="individualPersonalGuarantorDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="individualCitizenDropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="individualCitizenDropdown" name="individualCitizenDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div class="labels">
    <label for="individualSDResidentDropdown">South Dakota Resident?</label>
  </div>
  <div class="input-tab">
    <select id="individualSDResidentDropdown" name="individualSDResidentDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="individualFirstNameLabel{{index}}" for="individualFirstName{{index}}">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualFirstName{{index}}" name="individualFirstName{{index}}" placeholder="First Name(s)" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualMiddleNameLabel{{index}}" for="individualMiddleName{{index}}">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualMiddleName{{index}}" name="individualMiddleName{{index}}" placeholder="Middle Name(s)" style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualLastNameLabel{{index}}" for="individualLastName{{index}}">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualLastName{{index}}" name="individualLastName{{index}}" placeholder="Last Name(s)" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualHomeBankAddressLabel{{index}}" for="individualHomeBankAddress{{index}}">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeBankAddress{{index}}" name="individualHomeBankAddress{{index}}" placeholder="Home Address" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualHomeStreetAddressLabel{{index}}" for="individualHomeStreetAddress{{index}}">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeStreetAddress{{index}}" name="individualHomeStreetAddress{{index}}" placeholder="Home Street Address" style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualHomeCityLabel{{index}}" for="individualHomeCity{{index}}">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeCity{{index}}" name="individualHomeCity{{index}}" placeholder="Home City" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualHomeStateLabel{{index}}" for="individualHomeState{{index}}">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeState{{index}}" name="individualHomeState{{index}}" placeholder="Home State or Province" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualHomeZipLabel{{index}}" for="individualHomeZip{{index}}">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeZip{{index}}" name="individualHomeZip{{index}}" placeholder="Home Zip" required style="width: 250px;">
  </div>

  <div class="labels">
    <label id="individualHomeCountryLabel{{index}}" for="individualHomeCountry{{index}}">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualhomeCountry{{index}}" name="individualhomeCountry{{index}}" placeholder="Home Country" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label for="individualOwnRentDropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="individualOwnRentDropdown" name="individualOwnRentDropdown{{index}}" style="width: 262px;">
      <option disabled value selected>Select an option</option>
      <option value="Own">Own</option>
      <option value="Rent">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="individualRentLabel{{index}}" for="individualRent{{index}}">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualMonthlyRent{{index}}" name="individualMonthlyRent{{index}}" placeholder="Monthly Mortgage or Rent" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="individualPassportNumberLabel{{index}}" for="individualPassportNumber{{index}}">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualPassportNumber{{index}}" name="individualPassportNumber{{index}}" placeholder="Passport Number" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualSsnLabel{{index}}" for="individualSsn{{index}}">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualSsn{{index}}" name="individualSsn{{index}}" placeholder="SSN or ID Number" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualDobLabel{{index}}" for="individualDob{{index}}">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="individualDob{{index}}" name="individualDob{{index}}" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualEmailLabel{{index}}" for="individualEmail{{index}}">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="individualEmail{{index}}" name="individualEmail{{index}}" placeholder="email@email.com" required style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualPhoneLabel{{index}}" for="individualPhone{{index}}">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualPhone{{index}}" name="individualPhone{{index}}" placeholder="Telephone" style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="individualFicoLabel{{index}}" for="individualFico{{index}}">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualFico{{index}}" name="individualFico{{index}}" placeholder="FICO or NOSIS Score" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="individualIncomeLabel{{index}}" for="individualIncome{{index}}">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualIncome{{index}}" name="individualIncome{{index}}" placeholder="Monthly Income in USD" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="individualPep{{index}}" value="Yes" style="margin-left: 50px;" required>Yes</label>
    <label><input type="radio" name="individualPep{{index}}" value="No">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="individualCrime{{index}}" value="Yes" style="margin-left: 50px;" required>Yes</label>
    <label><input type="radio" name="individualCrime{{index}}" value="No">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="individualDeclareCheckbox{{index}}" value="Yes" required>I declare that the above information is true and correct.<br>
  </div>

  <br><br><h3>Upload a PDF or Image for Each of the Following</h3>

  <div class="labels">
    <label id="individualPassportFileLabel{{index}}" for="individualPassportFile{{index}}">Passport</label>
  </div>
  <div class="input-tab">
    <label for="individualPassportFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualPassportFile{{index}}" type="file" name="individualPassportFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('individualPassportFile{{index}}', 'individualPassportFileNameSpan{{index}}')" required>
    </label>
    <span id="individualPassportFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualDniFrontFileLabel{{index}}" for="individualDniFrontFile{{index}}">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="individualDniFrontFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualDniFrontFile{{index}}" type="file" name="individualDniFrontFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('individualDniFrontFile{{index}}', 'individualDniFrontFileNameSpan{{index}}')" required>
    </label>
    <span id="individualDniFrontFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualDniReverseFileLabel{{index}}" for="individualDniReverseFile{{index}}">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="individualDniReverseFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualDniReverseFile{{index}}" type="file" name="individualDniReverseFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('individualDniReverseFile{{index}}', 'individualDniReverseFileNameSpan{{index}}')" required>
    </label>
    <span id="individualDniReverseFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualBillAddressProofFileLabel{{index}}" for="individualBillAddressProofFile{{index}}">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="individualBillAddressProofFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualBillAddressProofFile{{index}}" type="file" name="individualBillAddressProofFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('individualBillAddressProofFile{{index}}', 'individualBillAddressProofFileNameSpan{{index}}')" required>
    </label>
    <span id="individualBillAddressProofFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualCreditCheckFileLabel{{index}}" for="individualCreditCheckFile{{index}}">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="individualCreditCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualCreditCheckFile{{index}}" type="file" name="individualCreditCheckFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('individualCreditCheckFile{{index}}', 'individualCreditCheckFileNameSpan{{index}}')" required>
    </label>
    <span id="individualCreditCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualWorldCheckFileLabel{{index}}" for="individualWorldCheckFile{{index}}">World Check</label>
  </div>
  <div class="input-tab">
    <label for="individualWorldCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualWorldCheckFile{{index}}" type="file" name="individualWorldCheckFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('individualWorldCheckFile{{index}}', 'individualWorldCheckFileNameSpan{{index}}')" required>
    </label>
    <span id="individualWorldCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualOfacFileLabel{{index}}" for="individualOfacFile{{index}}">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="individualOfacFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualOfacFile{{index}}" type="file" name="individualOfacFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('individualOfacFile{{index}}', 'individualOfacFileNameSpan{{index}}')" required>
    </label>
    <span id="individualOfacFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
`;

// html for additional UBO
const htmlForAdditionalUbo = `

  <br><br><h3 id="uboInfoSubtitle{{index}}">Info for UBO {{index}}</h3>
  
  <div class="labels">
    <label for="uboControlPersonAuthDropdown">Control Person Authorized to Apply for, Take, and Execute, Loan?</label>
  </div>
  <div class="input-tab">
    <select id="uboControlPersonAuthDropdown" name="uboControlPersonAuthDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div class="labels">
  <label for="uboPersonalGuarantorDropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="uboPersonalGuarantorDropdown" name="uboPersonalGuarantorDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="uboCitizenDropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="uboCitizenDropdown" name="uboCitizenDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div class="labels">
    <label for="uboSDResidentDropdown">South Dakota Resident?</label>
  </div>
  <div class="input-tab">
    <select id="uboSDResidentDropdown" name="uboSDResidentDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="uboFirstName{{index}}" for="uboFirstName{{index}}">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboFirstName{{index}}" name="uboFirstName{{index}}" placeholder="First Name(s)" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboMiddleName{{index}}" for="uboMiddleName{{index}}">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboMiddleName{{index}}" name="uboMiddleName{{index}}" placeholder="Middle Name(s)" style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="uboLastName{{index}}" for="uboLastName{{index}}">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboLastName{{index}}" name="lastName{{index}}" placeholder="Last Name(s)" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeBankAddressLabel{{index}}" for="uboHomeBankAddress{{index}}">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeBankAddress{{index}}" name="uboHomeBankAddress{{index}}" placeholder="Home Address" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeStreetAddressLabel{{index}}" for="uboHomeStreetAddress{{index}}">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeStreetAddress{{index}}" name="uboHomeStreetAddress{{index}}" placeholder="Home Street Address" style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="uboHomeCityLabel{{index}}" for="uboHomeCity{{index}}">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeCity{{index}}" name="uboHomeCity{{index}}" placeholder="Home City" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeStateLabel{{index}}" for="uboHomeState{{index}}">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeState{{index}}" name="uboHomeState{{index}}" placeholder="Home State or Province" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeZipLabel{{index}}" for="uboHomeZip{{index}}">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeZip{{index}}" name="uboHomeZip{{index}}" placeholder="Home Zip" style="width: 250px;" required>
  </div>

  <div class="labels">
    <label id="uboHomeCountryLabel{{index}}" for="uboHomeCountry{{index}}">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="ubohomeCountry{{index}}" name="ubohomeCountry{{index}}" placeholder="Home Country" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label for="uboOwnRentDropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="uboOwnRentDropdown" name="uboOwnRentDropdown{{index}}" style="width: 262px;">
      <option disabled value selected>Select an option</option>
      <option value="Own">Own</option>
      <option value="Rent">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="uboRentLabel{{index}}" for="uboRent{{index}}">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboMonthlyRent{{index}}" name="uboMonthlyRent{{index}}" placeholder="Monthly Mortgage or Rent" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="uboPassportNumberLabel{{index}}" for="uboPassportNumber{{index}}">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboPassportNumber{{index}}" name="uboPassportNumber{{index}}" placeholder="Passport Number" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboSsnLabel{{index}}" for="uboSsn{{index}}">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboSsn{{index}}" name="uboSsn{{index}}" placeholder="SSN or ID Number" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboDobLabel{{index}}" for="uboDob{{index}}">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="uboDob{{index}}" name="uboDob{{index}}" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboEmailLabel{{index}}" for="uboEmail{{index}}">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="uboEmail{{index}}" name="uboEmail{{index}}" placeholder="email@email.com" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="uboPhoneLabel{{index}}" for="uboPhone{{index}}">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboPhone{{index}}" name="uboPhone{{index}}" placeholder="Telephone" style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="uboFicoLabel{{index}}" for="uboFico{{index}}">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboFico{{index}}" name="uboFico{{index}}" placeholder="FICO or NOSIS Score" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="uboIncomeLabel{{index}}" for="uboIncome{{index}}">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboIncome{{index}}" name="uboIncome{{index}}" placeholder="Monthly Income in USD" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="uboPep{{index}}" value="uboYesPep{{index}}" style="margin-left: 50px;" required>Yes</label>
    <label><input type="radio" name="uboPep{{index}}" value="uboNoPep{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="uboCrime{{index}}" value="uboYesCrime{{index}}" style="margin-left: 50px;" required>Yes</label>
    <label><input type="radio" name="uboCrime{{index}}" value="uboNoCrime{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact.
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="uboDeclareCheckbox{{index}}" value="uboDeclareCheckbox{{index}}" required>I declare that the above information is true and correct.<br>
  </div>

  <br><br><h3>Upload a PDF or Image for Each of the Following</h3>

  <div class="labels">
    <label id="uboPassportFileLabel{{index}}" for="uboPassportFile{{index}}">Passport</label>
  </div>
  <div class="input-tab">
    <label for="uboPassportFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboPassportFile{{index}}" type="file" name="uboPassportFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('uboPassportFile{{index}}', 'uboPassportFileNameSpan{{index}}')" required>
    </label>
    <span id="uboPassportFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboDniFrontFileLabel{{index}}" for="uboDniFrontFile{{index}}">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="uboDniFrontFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboDniFrontFile{{index}}" type="file" name="uboDniFrontFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('uboDniFrontFile{{index}}', 'uboDniFrontFileNameSpan{{index}}')" required>
    </label>
    <span id="uboDniFrontFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboDniReverseFileLabel{{index}}" for="uboDniReverseFile{{index}}">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="uboDniReverseFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboDniReverseFile{{index}}" type="file" name="uboDniReverseFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('uboDniReverseFile{{index}}', 'uboDniReverseFileNameSpan{{index}}')" required>
    </label>
    <span id="uboDniReverseFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboBillAddressProofFileLabel{{index}}" for="uboBillAddressProofFile{{index}}">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="uboBillAddressProofFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboBillAddressProofFile{{index}}" type="file" name="uboBillAddressProofFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('uboBillAddressProofFile{{index}}', 'uboBillAddressProofFileNameSpan{{index}}')" required>
    </label>
    <span id="uboBillAddressProofFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboCreditCheckFileLabel{{index}}" for="uboCreditCheckFile{{index}}">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="uboCreditCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboCreditCheckFile{{index}}" type="file" name="uboCreditCheckFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('uboCreditCheckFile{{index}}', 'uboCreditCheckFileNameSpan{{index}}')" required>
    </label>
    <span id="uboCreditCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboWorldCheckFileLabel{{index}}" for="uboWorldCheckFile{{index}}">World Check</label>
  </div>
  <div class="input-tab">
    <label for="uboWorldCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboWorldCheckFile{{index}}" type="file" name="uboWorldCheckFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('uboWorldCheckFile{{index}}', 'uboWorldCheckFileNameSpan{{index}}')" required>
    </label>
    <span id="uboWorldCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboOfacFileLabel{{index}}" for="uboOfacFile{{index}}">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="uboOfacFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboOfacFile{{index}}" type="file" name="uboOfacFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('uboOfacFile{{index}}', 'uboOfacFileNameSpan{{index}}')" required>
    </label>
    <span id="uboOfacFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
`;
  
  // html for additional Director
  const htmlForAdditionalDirector = `

  <br><br><h3 id="directorInfoSubtitle{{index}}">Info for Director {{index}}</h3>
  
  <div class="labels">
    <label for="directorControlPersonAuthDropdown">Control Person Authorized to Apply for, Take, and Execute, Loan?</label>
  </div>
  <div class="input-tab">
    <select id="directorControlPersonAuthDropdown" name="directorControlPersonAuthDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div class="labels">
  <label for="directorPersonalGuarantorDropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="directorPersonalGuarantorDropdown" name="directorPersonalGuarantorDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="directorCitizenDropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="directorCitizenDropdown" name="directorCitizenDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div class="labels">
    <label for="directorSDResidentDropdown">South Dakota Resident?</label>
  </div>
  <div class="input-tab">
    <select id="directorSDResidentDropdown" name="directorSDResidentDropdown{{index}}" style="width: 262px;" required>
      <option disabled value selected>Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="directorFirstName{{index}}" for="directorFirstName{{index}}">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorFirstName{{index}}" name="directorFirstName{{index}}" placeholder="First Name(s)" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorMiddleName{{index}}" for="directorMiddleName{{index}}">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorMiddleName{{index}}" name="directorMiddleName{{index}}" placeholder="Middle Name(s)" style="width: 250px;">
  </div>
  
  <div class="labels">
    <label id="directorLastNameLabel{{index}}" for="directorLastName{{index}}">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorLastName{{index}}" name="directorLastName{{index}}" placeholder="Last Name(s)" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeBankAddressLabel{{index}}" for="directorHomeBankAddress{{index}}">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeBankAddress{{index}}" name="directorHomeBankAddress{{index}}" placeholder="Home Address" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeStreetAddressLabel{{index}}" for="directorHomeStreetAddress{{index}}">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeStreetAddress{{index}}" name="directorHomeStreetAddress{{index}}" placeholder="Home Street Address" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeCityLabel{{index}}" for="directorHomeCity{{index}}">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeCity{{index}}" name="directorHomeCity{{index}}" placeholder="Home City" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeStateLabel{{index}}" for="directorHomeState{{index}}">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeState{{index}}" name="directorHomeState{{index}}" placeholder="Home State or Province" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeZipLabel{{index}}" for="directorHomeZip{{index}}">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeZip{{index}}" name="directorHomeZip{{index}}" placeholder="Home Zip" style="width: 250px;">
  </div>

  <div class="labels">
    <label id="directorHomeCountryLabel{{index}}" for="directorHomeCountry{{index}}">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorhomeCountry{{index}}" name="directorhomeCountry{{index}}" placeholder="Home Country" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label for="directorOwnRentDropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="directorOwnRentDropdown" name="directorOwnRentDropdown{{index}}" style="width: 262px;">
      <option disabled value selected>Select an option</option>
      <option value="directorOwn{{index}}">Own</option>
      <option value="directorRent{{index}}">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="directorRentLabel{{index}}" for="directorRent{{index}}">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorMonthlyRent{{index}}" name="directorMonthlyRent{{index}}" placeholder="Monthly Mortgage or Rent" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="directorPassportNumberLabel{{index}}" for="directorPassportNumber{{index}}">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorPassportNumber{{index}}" name="directorPassportNumber{{index}}" placeholder="Passport Number" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorSsnLabel{{index}}" for="directorSsn{{index}}">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorSsn{{index}}" name="directorSsn{{index}}" placeholder="SSN or ID Number" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorDobLabel{{index}}" for="directorDob{{index}}">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="directorDob{{index}}" name="directorDob{{index}}" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorEmailLabel{{index}}" for="directorEmail{{index}}">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="directorEmail{{index}}" name="directorEmail{{index}}" placeholder="email@email.com" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorPhoneLabel{{index}}" for="directorPhone{{index}}">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorPhone{{index}}" name="directorPhone{{index}}" placeholder="Telephone" style="width: 250px;" required>
  </div>
  
  <div class="labels">
    <label id="directorFicoLabel{{index}}" for="directorFico{{index}}">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorFico{{index}}" name="directorFico{{index}}" placeholder="FICO or NOSIS Score" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="directorIncomeLabel{{index}}" for="directorIncome{{index}}">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorIncome{{index}}" name="directorIncome{{index}}" placeholder="Monthly Income in USD" style="width: 250px;" pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="directorPep{{index}}" value="directorYesPep{{index}}" style="margin-left: 50px;" required>Yes</label>
    <label><input type="radio" name="directorPep{{index}}" value="directorNoPep{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="directorCrime{{index}}" value="directorYesCrime{{index}}" style="margin-left: 50px;" required>Yes</label>
    <label><input type="radio" name="directorCrime{{index}}" value="directorNoCrime{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 425px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="directorDeclareCheckbox{{index}}" value="directorDeclareCheckbox{{index}}" required>I declare that the above information is true and correct.<br>
  </div>
  
  <br><br><h3>Upload a PDF or Image for Each of the Following</h3>

  <div class="labels">
    <label id="directorPassportFileLabel{{index}}" for="directorPassportFile{{index}}">Passport</label>
  </div>
  <div class="input-tab">
    <label for="directorPassportFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorPassportFile{{index}}" type="file" name="directorPassportFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('directorPassportFile{{index}}', 'directorPassportFileNameSpan{{index}}')" required>
    </label>
    <span id="directorPassportFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorDniFrontFileLabel{{index}}" for="directorDniFrontFile{{index}}">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="directorDniFrontFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorDniFrontFile{{index}}" type="file" name="directorDniFrontFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('directorDniFrontFile{{index}}', 'directorDniFrontFileNameSpan{{index}}')" required>
    </label>
    <span id="directorDniFrontFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorDniReverseFileLabel{{index}}" for="directorDniReverseFile{{index}}">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="directorDniReverseFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorDniReverseFile{{index}}" type="file" name="directorDniReverseFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('directorDniReverseFile{{index}}', 'directorDniReverseFileNameSpan{{index}}')" required>
    </label>
    <span id="directorDniReverseFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorBillAddressProofFileLabel{{index}}" for="directorBillAddressProofFile{{index}}">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="directorBillAddressProofFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorBillAddressProofFile{{index}}" type="file" name="directorBillAddressProofFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('directorBillAddressProofFile{{index}}', 'directorBillAddressProofFileNameSpan{{index}}')" required>
    </label>
    <span id="directorBillAddressProofFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorCreditCheckFileLabel{{index}}" for="directorCreditCheckFile{{index}}">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="directorCreditCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorCreditCheckFile{{index}}" type="file" name="directorCreditCheckFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('directorCreditCheckFile{{index}}', 'directorCreditCheckFileNameSpan{{index}}')" required>
    </label>
    <span id="directorCreditCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorWorldCheckFileLabel{{index}}" for="directorWorldCheckFile{{index}}">World Check</label>
  </div>
  <div class="input-tab">
    <label for="directorWorldCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorWorldCheckFile{{index}}" type="file" name="directorWorldCheckFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('directorWorldCheckFile{{index}}', 'directorWorldCheckFileNameSpan{{index}}')" required>
    </label>
    <span id="directorWorldCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorOfacFileLabel{{index}}" for="directorOfacFile{{index}}">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="directorOfacFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorOfacFile{{index}}" type="file" name="directorOfacFile{{index}}" style="position:absolute; left:-999999px;" onchange="displayFileName('directorOfacFile{{index}}', 'directorOfacFileNameSpan{{index}}')" required>
    </label>
    <span id="directorOfacFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
`;

function addIndividualEventListeners() {
  individualCount = 1;
  
  for (let i = 1; i <= 8; i++) {
    const addIndividualButton = document.getElementById(`addIndividualButton${i}`);
    addIndividualButton.addEventListener('click', function() {
      if (individualCount <= 8) {
        const additionalIndividualInfoID = 'additionalIndividualInfo' + individualCount;
        const additionalIndividualInfo = document.getElementById(additionalIndividualInfoID);
        const htmlForAdditionalIndividualWithIndex = htmlForAdditionalIndividual.replace(/{{index}}/g, individualCount);
        additionalIndividualInfo.insertAdjacentHTML('beforeend', htmlForAdditionalIndividualWithIndex);
        
        
        if (individualCount === 1) {
          removeIndividualButton.style.display = 'none';
        } else {
          removeIndividualButton.style.display = 'block';
          removeIndividualButton.style.margin = "0 auto";
        }
        
//      if (individualCount > 1){
//        
//      }
        
        if (individualCount === 8) {
          const addIndividualButton1 = document.getElementById('addIndividualButton1');
          addIndividualButton1.style.display = 'none';
        } 
        
        individualCount++;
      }
    });
    
    const removeIndividualButton = document.getElementById(`removeIndividualButton${i}`);
    removeIndividualButton.addEventListener('click', function() {
      if (individualCount > 2 && individualCount <= 9) {
        const additionalIndividualInfoToRemove = document.getElementById(`additionalIndividualInfo${individualCount-1}`);
        additionalIndividualInfoToRemove.remove();
        
        const replacementDiv = document.createElement("div");
        replacementDiv.setAttribute("id", `additionalIndividualInfo${individualCount-1}`);
        // Add any content or attributes you need to the replacement div here
        
        const divAfterOneJustRemoved = document.getElementById(`additionalIndividualInfo${individualCount}`);
        const parentDiv = additionalIndividualInfo1.parentNode;
        parentDiv.insertBefore(replacementDiv, divAfterOneJustRemoved);
        
        individualCount--;
      }
      
      // Check if additionalIndividualInfo1 is present, and if it should be removed
      const additionalIndividualInfo1Present = document.getElementById("additionalIndividualInfo1");
      if (additionalIndividualInfo1Present && individualCount === 1) {
        const additionalIndividualInfoToRemove = additionalIndividualInfo1Present;
        additionalIndividualInfoToRemove.remove();
        
        const replacementDiv = document.createElement("div");
        replacementDiv.setAttribute("id", "additionalIndividualInfo1");
        // Add any content or attributes you need to the replacement div here
        
        const firstDiv = document.getElementById("additionalIndividualInfo");
        const parentDiv = firstDiv.parentNode;
        parentDiv.insertBefore(replacementDiv, firstDiv);
        
        individualCount--;
      }
    });
  }
}


function addUboEventListeners() {
  uboCount = 1;
  for (let i = 1; i <= 8; i++) {
    const addUboButton = document.getElementById(`addUboButton${i}`);
    addUboButton.addEventListener('click', function() {
      if (uboCount <= 8) {
        const additionalUboInfoID = 'additionalUboInfo' + uboCount;
        const additionalUboInfo = document.getElementById(additionalUboInfoID);
        const htmlForAdditionalUboWithIndex = htmlForAdditionalUbo.replace(/{{index}}/g, uboCount);
        additionalUboInfo.insertAdjacentHTML('beforeend', htmlForAdditionalUboWithIndex);
        
        if (uboCount === 1) {
          removeUboButton.style.display = 'none';
        } else {
          removeUboButton.style.display = 'block';
          removeUboButton.style.margin = "0 auto";
        }
        
        if (uboCount === 8) {
          const addUboButton1 = document.getElementById('addUboButton1');
          addUboButton1.style.display = 'none';
        } 
        
        uboCount++;
      }
    });
    
    const removeUboButton = document.getElementById(`removeUboButton${i}`);
    removeUboButton.addEventListener('click', function() {
      if (uboCount > 2 && uboCount <= 9) {
        const additionalUboInfoToRemove = document.getElementById(`additionalUboInfo${uboCount-1}`);
        additionalUboInfoToRemove.remove();
        
        const replacementDiv = document.createElement("div");
        replacementDiv.setAttribute("id", `additionalUboInfo${uboCount-1}`);
        // Add any content or attributes you need to the replacement div here
        
        const divAfterOneJustRemoved = document.getElementById(`additionalUboInfo${uboCount}`);
        const parentDiv = additionalUboInfo1.parentNode;
        parentDiv.insertBefore(replacementDiv, divAfterOneJustRemoved);
        
        uboCount--;
      }
      
      // Check if additionalUboInfo1 is present, and if it should be removed
      const additionalUboInfo1Present = document.getElementById("additionalUboInfo1");
      if (additionalUboInfo1Present && uboCount === 1) {
        const additionalUboInfoToRemove = additionalUboInfo1Present;
        additionalUboInfoToRemove.remove();
        
        const replacementDiv = document.createElement("div");
        replacementDiv.setAttribute("id", "additionalUboInfo1");
        // Add any content or attributes you need to the replacement div here
        
        const firstDiv = document.getElementById("additionalUboInfo");
        const parentDiv = firstDiv.parentNode;
        parentDiv.insertBefore(replacementDiv, firstDiv);
        
        uboCount--;
      }
    });
  }
}

function addDirectorEventListeners() {
  directorCount = 1;
  for (let i = 1; i <= 8; i++) {
    const addDirectorButton = document.getElementById(`addDirectorButton${i}`);
    addDirectorButton.addEventListener('click', function() {
      if (directorCount <= 8) {
        const additionalDirectorInfoID = 'additionalDirectorInfo' + directorCount;
        const additionalDirectorInfo = document.getElementById(additionalDirectorInfoID);
        const htmlForAdditionalDirectorWithIndex = htmlForAdditionalDirector.replace(/{{index}}/g, directorCount);
        additionalDirectorInfo.insertAdjacentHTML('beforeend', htmlForAdditionalDirectorWithIndex);
        
        if (directorCount === 1) {
          removeDirectorButton.style.display = 'none';
        } else {
          removeDirectorButton.style.display = 'block';
          removeDirectorButton.style.margin = "0 auto";
        }
        
        if (directorCount === 8) {
          const addDirectorButton1 = document.getElementById('addDirectorButton1');
          addDirectorButton1.style.display = 'none';
        } 
        
        directorCount++;
      }
    });
    
    const removeDirectorButton = document.getElementById(`removeDirectorButton${i}`);
    removeDirectorButton.addEventListener('click', function() {
      if (directorCount > 2 && directorCount <= 9) {
        const additionalDirectorInfoToRemove = document.getElementById(`additionalDirectorInfo${directorCount-1}`);
        additionalDirectorInfoToRemove.remove();
        
        const replacementDiv = document.createElement("div");
        replacementDiv.setAttribute("id", `additionalDirectorInfo${directorCount-1}`);
        // Add any content or attributes you need to the replacement div here
        
        const divAfterOneJustRemoved = document.getElementById(`additionalDirectorInfo${directorCount}`);
        const parentDiv = additionalDirectorInfo1.parentNode;
        parentDiv.insertBefore(replacementDiv, divAfterOneJustRemoved);
        
        directorCount--;
      }
      
      // Check if additionalDirectorInfo1 is present, and if it should be removed
      const additionalDirectorInfo1Present = document.getElementById("additionalDirectorInfo1");
      if (additionalDirectorInfo1Present && directorCount === 1) {
        const additionalDirectorInfoToRemove = additionalDirectorInfo1Present;
        additionalDirectorInfoToRemove.remove();
        
        const replacementDiv = document.createElement("div");
        replacementDiv.setAttribute("id", "additionalDirectorInfo1");
        // Add any content or attributes you need to the replacement div here
        
        const firstDiv = document.getElementById("additionalDirectorInfo");
        const parentDiv = firstDiv.parentNode;
        parentDiv.insertBefore(replacementDiv, firstDiv);
        
        directorCount--;
      }
    });
  }
}

var addIndividualButton = document.getElementById("addIndividualButton1");
addIndividualButton.style.display = "none"; // hide the button by default
var addUboButton = document.getElementById("addUboButton1");
addUboButton.style.display = "none"; // hide the button by default
var addDirectorButton = document.getElementById("addDirectorButton1");
addDirectorButton.style.display = "none"; // hide the button by default

var removeIndividualButton = document.getElementById("removeIndividualButton1");
removeIndividualButton.style.display = "none"; // hide the button by default
var removeUboButton = document.getElementById("removeUboButton1");
removeUboButton.style.display = "none"; // hide the button by default
var removeDirectorButton = document.getElementById("removeDirectorButton1");
removeDirectorButton.style.display = "none"; // hide the button by default

function handleBorrowerSelect() {
  var select = document.getElementById("borrowerDropdown");
  var option = select.options[select.selectedIndex];
  var individualCount = 1;
  var uboCount = 1;
  var directorCount = 1;
  submitButton.disabled = true;
  
  if (option.value == "Individual") {   
    
    submitButton.disabled = true;
    
    document.getElementById("borrowerSpecificDetails").innerHTML = "";
    document.getElementById("additionalUboInfo1").innerHTML = "";
    document.getElementById("additionalUboInfo2").innerHTML = "";
    document.getElementById("additionalUboInfo3").innerHTML = "";
    document.getElementById("additionalUboInfo4").innerHTML = "";
    document.getElementById("additionalUboInfo5").innerHTML = "";
    document.getElementById("additionalUboInfo6").innerHTML = "";
    document.getElementById("additionalUboInfo7").innerHTML = "";
    document.getElementById("additionalUboInfo8").innerHTML = "";
    
    document.getElementById("additionalDirectorInfo1").innerHTML = "";
    document.getElementById("additionalDirectorInfo2").innerHTML = "";
    document.getElementById("additionalDirectorInfo3").innerHTML = "";
    document.getElementById("additionalDirectorInfo4").innerHTML = "";
    document.getElementById("additionalDirectorInfo5").innerHTML = "";
    document.getElementById("additionalDirectorInfo6").innerHTML = "";
    document.getElementById("additionalDirectorInfo7").innerHTML = "";
    document.getElementById("additionalDirectorInfo8").innerHTML = "";
    
    entityContainer.innerHTML = htmlForIndividualTitle;
    addUboButton.style.display = "none"; // hide the button
    addDirectorButton.style.display = "none"; // hide the button
    removeUboButton.style.display = "none"; // hide the button
    removeDirectorButton.style.display = "none"; // hide the button
    addIndividualButton.style.display = "block"; // show the button
    addIndividualButton.style.margin = "0 auto";
    addIndividualEventListeners();
    
    additionalUboInfo1.style.display = 'none';
    additionalUboInfo1.style.display = 'none';
    additionalUboInfo2.style.display = 'none';
    additionalUboInfo3.style.display = 'none';
    additionalUboInfo4.style.display = 'none';
    additionalUboInfo5.style.display = 'none';
    additionalUboInfo6.style.display = 'none';
    additionalUboInfo7.style.display = 'none';
    additionalUboInfo8.style.display = 'none';
    
    additionalDirectorInfo1.style.display = 'none';
    additionalDirectorInfo2.style.display = 'none';
    additionalDirectorInfo3.style.display = 'none';
    additionalDirectorInfo4.style.display = 'none';
    additionalDirectorInfo5.style.display = 'none';
    additionalDirectorInfo6.style.display = 'none';
    additionalDirectorInfo7.style.display = 'none';
    additionalDirectorInfo8.style.display = 'none';
    
    additionalIndividualInfo1.style.display = 'block';
    additionalIndividualInfo2.style.display = 'block';
    additionalIndividualInfo3.style.display = 'block';
    additionalIndividualInfo4.style.display = 'block';
    additionalIndividualInfo5.style.display = 'block';
    additionalIndividualInfo6.style.display = 'block';
    additionalIndividualInfo7.style.display = 'block';
    additionalIndividualInfo8.style.display = 'block';
    
  }
  
  if (option.value == "Entity") {
    
    submitButton.disabled = true;
    
    document.getElementById("additionalIndividualInfo1").innerHTML = "";
    document.getElementById("additionalIndividualInfo2").innerHTML = "";
    document.getElementById("additionalIndividualInfo3").innerHTML = "";
    document.getElementById("additionalIndividualInfo4").innerHTML = "";
    document.getElementById("additionalIndividualInfo5").innerHTML = "";
    document.getElementById("additionalIndividualInfo6").innerHTML = "";
    document.getElementById("additionalIndividualInfo7").innerHTML = "";
    document.getElementById("additionalIndividualInfo8").innerHTML = "";
    
    entityContainer.innerHTML = htmlForEntity;
    addIndividualButton.style.display = "none"; // hide the button
    removeIndividualButton.style.display = "none"; // hide the button
    addUboButton.style.display = "block"; // show the button
    addUboButton.style.margin = "0 auto";
    addDirectorButton.style.display = "block"; // show the button
    addDirectorButton.style.margin = "0 auto";
    addUboEventListeners();
    
    additionalUboInfo1.style.display = 'block';
    additionalUboInfo2.style.display = 'block';
    additionalUboInfo3.style.display = 'block';
    additionalUboInfo4.style.display = 'block';
    additionalUboInfo5.style.display = 'block';
    additionalUboInfo6.style.display = 'block';
    additionalUboInfo7.style.display = 'block';
    additionalUboInfo8.style.display = 'block';
    
    additionalDirectorInfo1.style.display = 'block';
    additionalDirectorInfo2.style.display = 'block';
    additionalDirectorInfo3.style.display = 'block';
    additionalDirectorInfo4.style.display = 'block';
    additionalDirectorInfo5.style.display = 'block';
    additionalDirectorInfo6.style.display = 'block';
    additionalDirectorInfo7.style.display = 'block';
    additionalDirectorInfo8.style.display = 'block';
    
  }
}

// Get references to the addIndividualButton1 and addUboButton1 buttons
const addIndividualButton1ForBoolean = document.getElementById("addIndividualButton1");
const addUboButton1ForBoolean = document.getElementById("addUboButton1");

const removeIndividualButton1ForBoolean = document.getElementById("removeIndividualButton1");
const removeUboButton1ForBoolean = document.getElementById("removeUboButton1");
const removeDirectorButton1ForBoolean = document.getElementById("removeDirectorButton1");

// Add event listeners to the buttons to set buttonsClicked to true when clicked
addIndividualButton1ForBoolean.addEventListener("click", function() {
  buttonsClicked = true;
  if (buttonsClicked) {
    // Enable the submit button
    removeIndividualButton1ForBoolean.disabled = false;
    submitButton.disabled = false;
  }
});

addUboButton1ForBoolean.addEventListener("click", function() {
  buttonsClicked = true;
  if (buttonsClicked) {
    // Enable the submit button
    removeUboButton1ForBoolean.disabled = false;
    removeDirectorButton1ForBoolean.disabled = false;
    submitButton.disabled = false;
  }
});
buttonsClicked = false;


addDirectorEventListeners();
// NO JAVASCRIPT BELOW THIS LINE
// JAVASCRIPT BREAKS PAST THIS LINE