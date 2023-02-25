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

const entityContainer = document.getElementById("borrowerSpecificDetails");




// base html for individual details
const htmlForFirstIndividual = `
    
  <br><br><br><h2 id="title">Step 6 - Individual Info</h2><br>
  
  <div class="labels">
    <label for="dropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="individualPersonalGuarantorDropdown" name="individualPersonalGuarantorDropdown1" required>
      <option disabled value selected>Select an option</option>
      <option value="individualPersonalGuarantorYes1">Yes</option>
      <option value="individualPersonalGuarantorNo1">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="dropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="individualCitizenDropdown" name="individualCitizenDropdown1" required>
      <option disabled value selected>Select an option</option>
      <option value="individualCitizenYes1">Yes</option>
      <option value="individualCitizenYes1">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="individualFirstName1" for="individualFirstName1">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualFirstName1" name="individualFirstName1" placeholder="First Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualMiddleName1" for="individualMiddleName1">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualMiddleName1" name="individualMiddleName1" placeholder="Middle Name(s)" style="width: 150px;">
  </div>
  
  <div class="labels">
    <label id="individualLastName1" for="individualLastName1">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualLastName1" name="lastName1" placeholder="Last Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="homeBankAddressLabel1" for="homeBankAddressLabel1">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeAddress1" name="homeAddress1" placeholder="Home Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeCountryLabel1" for="individualHomeCountryLabel1">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualhomeCountry1" name="individualhomeCountry1" placeholder="Home Country" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeStreetAddressLabel1" for="individualHomeStreetAddressLabel1">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeStreetAddress1" name="individualHomeStreetAddress1" placeholder="Home Street Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeCityLabel1" for="individualHomeCityLabel1">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeCity1" name="individualHomeCity1" placeholder="Home City" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeStateLabel1" for="individualHomeStateLabel1">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeState1" name="individualHomeState1" placeholder="Home State or Province" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeZipLabel1" for="individualHomeZipLabel1">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeZip1" name="individualHomeZip1" placeholder="Home Zip" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label for="dropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="individualOwnRentDropdown" name="individualOwnRentDropdown1" required>
      <option disabled value selected>Select an option</option>
      <option value="individualOwn1">Own</option>
      <option value="individualRent1">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="individualRentLabel1" for="individualRentLabel1">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualMonthlyRent1" name="individualMonthlyRent1" placeholder="Monthly Mortgage or Rent" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="individualPassportNumberLabel1" for="individualPassportNumberLabel1">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualPassportNumber1" name="individualPassportNumber1" placeholder="Passport Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualSsnLabel1" for="individualSsnLabel1">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualSsn1" name="individualSsn1" placeholder="SSN or ID Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualDobLabel1" for="individualDobLabel1">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="individualDob1" name="individualDob1">
  </div>
  
  <div class="labels">
    <label id="individualEmailLabel1" for="individualEmailLabel1">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="individualEmail1" name="individualEmail1" placeholder="email@email.com" style="width: 350px;" required>
  </div>
  
  <div class="labels">
    <label id="individualPhoneLabel1" for="individualPhoneLabel1">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualPhone1" name="individualPhone1" placeholder="Telephone" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualFicoLabel1" for="individualFicoLabel1">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualFico1" name="individualFico1" placeholder="FICO or NOSIS Score" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="individualIncomeLabel1" for="individualIncomeLabel1">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualIncome1" name="individualIncome1" placeholder="Monthly Income in USD" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="individualPep1" value="individualYesPep1" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="individualPep1" value="individualNoPep1">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="individualCrime1" value="individualYesCrime1" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="individualCrime1" value="individualNoCrime1">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="individualDeclareCheckbox1" value="individualDeclareCheckbox1">I declare that the above information is true and correct.<br>
  </div>

  <div class="labels">
    <label id="individualPassportFileLabel1" for="individualPassportFileLabel1">Passport</label>
  </div>
  <div class="input-tab">
    <label for="individualPassportFile1" class="fileUploadButton">Choose File
      <input id="individualPassportFile1" type="file" name="individualPassportFile1" style="display:none" onchange="displayFileName('individualPassportFile1', 'individualPassportFileNameSpan1')">
    </label>
    <span id="individualPassportFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualDniFrontFileLabel1" for="individualDniFrontFileLabel1">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="individualDniFrontFile1" class="fileUploadButton">Choose File
      <input id="individualDniFrontFile1" type="file" name="individualDniFrontFile1" style="display:none" onchange="displayFileName('individualDniFrontFile1', 'individualDniFrontFileNameSpan1')">
    </label>
    <span id="individualDniFrontFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualDniReverseFileLabel1" for="individualDniReverseFileLabel1">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="individualDniReverseFile1" class="fileUploadButton">Choose File
      <input id="individualDniReverseFile1" type="file" name="individualDniReverseFile1" style="display:none" onchange="displayFileName('individualDniReverseFile1', 'individualDniReverseFileNameSpan1')">
    </label>
    <span id="individualDniReverseFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualBillAddressProofFileLabel1" for="individualBillAddressProofFileLabel1">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="individualBillAddressProofFile1" class="fileUploadButton">Choose File
      <input id="individualBillAddressProofFile1" type="file" name="individualBillAddressProofFile1" style="display:none" onchange="displayFileName('individualBillAddressProofFile1', 'individualBillAddressProofFileNameSpan1')">
    </label>
    <span id="individualBillAddressProofFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualCreditCheckFileLabel1" for="individualCreditCheckFileLabel1">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="individualCreditCheckFile1" class="fileUploadButton">Choose File
      <input id="individualCreditCheckFile1" type="file" name="individualCreditCheckFile1" style="display:none" onchange="displayFileName('individualCreditCheckFile1', 'individualCreditCheckFileNameSpan1')">
    </label>
    <span id="individualCreditCheckFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualWorldCheckFileLabel1" for="individualWorldCheckFileLabel1">World Check</label>
  </div>
  <div class="input-tab">
    <label for="individualWorldCheckFile1" class="fileUploadButton">Choose File
      <input id="individualWorldCheckFile1" type="file" name="individualWorldCheckFile1" style="display:none" onchange="displayFileName('individualWorldCheckFile1', 'individualWorldCheckFileNameSpan1')">
    </label>
    <span id="individualWorldCheckFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualOfacFileLabel1" for="individualOfacFileLabel1">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="individualOfacFile1" class="fileUploadButton">Choose File
      <input id="individualOfacFile1" type="file" name="individualOfacFile1" style="display:none" onchange="displayFileName('individualOfacFile1', 'individualOfacFileNameSpan1')">
    </label>
    <span id="individualOfacFileNameSpan1">Uploaded File: None</span>
  </div>

  <div class="addIndividualContainer">
    <div class="btn">
      <button id="addIndividualButton1" type="button">Add Another Individual</button>
    </div>
  </div>
`;
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
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
  
  <br><br><h3>Upload PDF or Image for Each of the Following</h3>
  
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
    <label id="entityEinFileLabel" for="entityEinFileLabel">EIN</label>
  </div>
  <div class="input-tab">
    <label for="entityEinFile" class="fileUploadButton">Choose File
      <input id="entityEinFile" type="file" name="entityEinFile" style="display:none" onchange="displayFileName('entityEinFile', 'entityEinFileNameSpan')">
    </label>
    <span id="entityEinFileNameSpan">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="entityOtherFileLabel" for="entityOtherFileLabel">Other</label>
  </div>
  <div class="input-tab">
    <label for="entityOtherFile" class="fileUploadButton">Choose File
      <input id="entityOtherFile" type="file" name="entityOtherFile" style="display:none" onchange="displayFileName('entityOtherFile', 'entityOtherFileNameSpan')">
    </label>
    <span id="entityOtherFileNameSpan">Uploaded File: None</span>
  </div>







  <br><br><br><h2 id="title">Step 6 - UBO and Director Info</h2><br>
  
  <br><h3 id="uboInfoSubtitle1">Info for UBO 1</h3>
  
  
  <div class="labels">
    <label for="dropdown">Control Person Authorized to Apply for, Take, and Execute, Loan?</label>
  </div>
  <div class="input-tab">
    <select id="uboControlPersonAuthDropdown" name="uboControlPersonAuthDropdown1" required>
      <option disabled value selected>Select an option</option>
      <option value="controlPersonAuthYes1">Yes</option>
      <option value="controlPersonAuthNo1">No</option>
    </select>
  </div>

  <div class="labels">
  <label for="dropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="uboPersonalGuarantorDropdown" name="uboPersonalGuarantorDropdown1" required>
      <option disabled value selected>Select an option</option>
      <option value="uboPersonalGuarantorYes1">Yes</option>
      <option value="uboPersonalGuarantorNo1">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="dropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="uboCitizenDropdown" name="uboCitizenDropdown1" required>
      <option disabled value selected>Select an option</option>
      <option value="uboCitizenYes1">Yes</option>
      <option value="uboCitizenYes1">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="uboFirstName1" for="uboFirstName1">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboFirstName1" name="uboFirstName1" placeholder="First Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboMiddleName1" for="uboMiddleName1">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboMiddleName1" name="uboMiddleName1" placeholder="Middle Name(s)" style="width: 150px;">
  </div>
  
  <div class="labels">
    <label id="uboLastName1" for="uboLastName1">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboLastName1" name="lastName1" placeholder="Last Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="homeBankAddressLabel1" for="homeBankAddressLabel1">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeAddress1" name="homeAddress1" placeholder="Home Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeCountryLabel1" for="uboHomeCountryLabel1">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="ubohomeCountry1" name="ubohomeCountry1" placeholder="Home Country" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeStreetAddressLabel1" for="uboHomeStreetAddressLabel1">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeStreetAddress1" name="uboHomeStreetAddress1" placeholder="Home Street Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeCityLabel1" for="uboHomeCityLabel1">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeCity1" name="uboHomeCity1" placeholder="Home City" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeStateLabel1" for="uboHomeStateLabel1">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeState1" name="uboHomeState1" placeholder="Home State or Province" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeZipLabel1" for="uboHomeZipLabel1">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeZip1" name="uboHomeZip1" placeholder="Home Zip" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label for="dropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="uboOwnRentDropdown" name="uboOwnRentDropdown1" required>
      <option disabled value selected>Select an option</option>
      <option value="uboOwn1">Own</option>
      <option value="uboRent1">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="uboRentLabel1" for="uboRentLabel1">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboMonthlyRent1" name="uboMonthlyRent1" placeholder="Monthly Mortgage or Rent" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="uboPassportNumberLabel1" for="uboPassportNumberLabel1">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboPassportNumber1" name="uboPassportNumber1" placeholder="Passport Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboSsnLabel1" for="uboSsnLabel1">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboSsn1" name="uboSsn1" placeholder="SSN or ID Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboDobLabel1" for="uboDobLabel1">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="uboDob1" name="uboDob1">
  </div>
  
  <div class="labels">
    <label id="uboEmailLabel1" for="uboEmailLabel1">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="uboEmail1" name="uboEmail1" placeholder="email@email.com" style="width: 350px;" required>
  </div>
  
  <div class="labels">
    <label id="uboPhoneLabel1" for="uboPhoneLabel1">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboPhone1" name="uboPhone1" placeholder="Telephone" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboFicoLabel1" for="uboFicoLabel1">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboFico1" name="uboFico1" placeholder="FICO or NOSIS Score" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="uboIncomeLabel1" for="uboIncomeLabel1">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboIncome1" name="uboIncome1" placeholder="Monthly Income in USD" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="uboPep1" value="uboYesPep1" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="uboPep1" value="uboNoPep1">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="uboCrime1" value="uboYesCrime1" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="uboCrime1" value="uboNoCrime1">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="uboDeclareCheckbox1" value="uboDeclareCheckbox1">I declare that the above information is true and correct.<br>
  </div>

  <div class="labels">
    <label id="uboPassportFileLabel1" for="uboPassportFileLabel1">Passport</label>
  </div>
  <div class="input-tab">
    <label for="uboPassportFile1" class="fileUploadButton">Choose File
      <input id="uboPassportFile1" type="file" name="uboPassportFile1" style="display:none" onchange="displayFileName('uboPassportFile1', 'uboPassportFileNameSpan1')">
    </label>
    <span id="uboPassportFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboDniFrontFileLabel1" for="uboDniFrontFileLabel1">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="uboDniFrontFile1" class="fileUploadButton">Choose File
      <input id="uboDniFrontFile1" type="file" name="uboDniFrontFile1" style="display:none" onchange="displayFileName('uboDniFrontFile1', 'uboDniFrontFileNameSpan1')">
    </label>
    <span id="uboDniFrontFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboDniReverseFileLabel1" for="uboDniReverseFileLabel1">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="uboDniReverseFile1" class="fileUploadButton">Choose File
      <input id="uboDniReverseFile1" type="file" name="uboDniReverseFile1" style="display:none" onchange="displayFileName('uboDniReverseFile1', 'uboDniReverseFileNameSpan1')">
    </label>
    <span id="uboDniReverseFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboBillAddressProofFileLabel1" for="uboBillAddressProofFileLabel1">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="uboBillAddressProofFile1" class="fileUploadButton">Choose File
      <input id="uboBillAddressProofFile1" type="file" name="uboBillAddressProofFile1" style="display:none" onchange="displayFileName('uboBillAddressProofFile1', 'uboBillAddressProofFileNameSpan1')">
    </label>
    <span id="uboBillAddressProofFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboCreditCheckFileLabel1" for="uboCreditCheckFileLabel1">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="uboCreditCheckFile1" class="fileUploadButton">Choose File
      <input id="uboCreditCheckFile1" type="file" name="uboCreditCheckFile1" style="display:none" onchange="displayFileName('uboCreditCheckFile1', 'uboCreditCheckFileNameSpan1')">
    </label>
    <span id="uboCreditCheckFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboWorldCheckFileLabel1" for="uboWorldCheckFileLabel1">World Check</label>
  </div>
  <div class="input-tab">
    <label for="uboWorldCheckFile1" class="fileUploadButton">Choose File
      <input id="uboWorldCheckFile1" type="file" name="uboWorldCheckFile1" style="display:none" onchange="displayFileName('uboWorldCheckFile1', 'uboWorldCheckFileNameSpan1')">
    </label>
    <span id="uboWorldCheckFileNameSpan1">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboOfacFileLabel1" for="uboOfacFileLabel1">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="uboOfacFile1" class="fileUploadButton">Choose File
      <input id="uboOfacFile1" type="file" name="uboOfacFile1" style="display:none" onchange="displayFileName('uboOfacFile1', 'uboOfacFileNameSpan1')">
    </label>
    <span id="uboOfacFileNameSpan1">Uploaded File: None</span>
  </div>

  <div class="addUboContainer">
    <div class="btn">
      <button id="addUboButton1" type="button">Add Another UBO</button>
    </div>
  </div>
  
  <div class="addDirectorContainer">
    <div class="btn">
      <button id="addDirectorButton1" type="button">Add an Entity Director who is not a UBO</button>
    </div>
  </div>
`;

// function for if borrower is an individual or entity
function handleBorrowerSelect() {
  var select = document.getElementById("borrowerDropdown");
  var option = select.options[select.selectedIndex];

  if (option.value == "individualBorrower") {
    entityContainer.innerHTML = htmlForFirstIndividual;
    let individualSelected = true;

  }
  
  if (option.value == "entityBorrower") {
    entityContainer.innerHTML = htmlForEntity;
    let entitySelected = true;
    
  } 
}























const htmlForAdditionalIndividual = `
    
  <br><h3 id="individualInfoSubtitle{{index}}">Info for Individual {{index}}</h3>
  
  <div class="labels">
    <label for="dropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="individualPersonalGuarantorDropdown" name="individualPersonalGuarantorDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="individualPersonalGuarantorYes{{index}}">Yes</option>
      <option value="individualPersonalGuarantorNo{{index}}">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="dropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="individualCitizenDropdown" name="individualCitizenDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="individualCitizenYes{{index}}">Yes</option>
      <option value="individualCitizenYes{{index}}">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="individualFirstName{{index}}" for="individualFirstName{{index}}">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualFirstName{{index}}" name="individualFirstName{{index}}" placeholder="First Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualMiddleName{{index}}" for="individualMiddleName{{index}}">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualMiddleName{{index}}" name="individualMiddleName{{index}}" placeholder="Middle Name(s)" style="width: 150px;">
  </div>
  
  <div class="labels">
    <label id="individualLastName{{index}}" for="individualLastName{{index}}">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualLastName{{index}}" name="lastName{{index}}" placeholder="Last Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="homeBankAddressLabel{{index}}" for="homeBankAddressLabel{{index}}">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeAddress{{index}}" name="homeAddress{{index}}" placeholder="Home Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeCountryLabel{{index}}" for="individualHomeCountryLabel{{index}}">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualhomeCountry{{index}}" name="individualhomeCountry{{index}}" placeholder="Home Country" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeStreetAddressLabel{{index}}" for="individualHomeStreetAddressLabel{{index}}">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeStreetAddress{{index}}" name="individualHomeStreetAddress{{index}}" placeholder="Home Street Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeCityLabel{{index}}" for="individualHomeCityLabel{{index}}">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeCity{{index}}" name="individualHomeCity{{index}}" placeholder="Home City" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeStateLabel{{index}}" for="individualHomeStateLabel{{index}}">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeState{{index}}" name="individualHomeState{{index}}" placeholder="Home State or Province" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualHomeZipLabel{{index}}" for="individualHomeZipLabel{{index}}">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualHomeZip{{index}}" name="individualHomeZip{{index}}" placeholder="Home Zip" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label for="dropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="individualOwnRentDropdown" name="individualOwnRentDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="individualOwn{{index}}">Own</option>
      <option value="individualRent{{index}}">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="individualRentLabel{{index}}" for="individualRentLabel{{index}}">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualMonthlyRent{{index}}" name="individualMonthlyRent{{index}}" placeholder="Monthly Mortgage or Rent" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="individualPassportNumberLabel{{index}}" for="individualPassportNumberLabel{{index}}">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualPassportNumber{{index}}" name="individualPassportNumber{{index}}" placeholder="Passport Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualSsnLabel{{index}}" for="individualSsnLabel{{index}}">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualSsn{{index}}" name="individualSsn{{index}}" placeholder="SSN or ID Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualDobLabel{{index}}" for="individualDobLabel{{index}}">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="individualDob{{index}}" name="individualDob{{index}}">
  </div>
  
  <div class="labels">
    <label id="individualEmailLabel{{index}}" for="individualEmailLabel{{index}}">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="individualEmail{{index}}" name="individualEmail{{index}}" placeholder="email@email.com" style="width: 350px;" required>
  </div>
  
  <div class="labels">
    <label id="individualPhoneLabel{{index}}" for="individualPhoneLabel{{index}}">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualPhone{{index}}" name="individualPhone{{index}}" placeholder="Telephone" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="individualFicoLabel{{index}}" for="individualFicoLabel{{index}}">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualFico{{index}}" name="individualFico{{index}}" placeholder="FICO or NOSIS Score" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="individualIncomeLabel{{index}}" for="individualIncomeLabel{{index}}">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="individualIncome{{index}}" name="individualIncome{{index}}" placeholder="Monthly Income in USD" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="individualPep{{index}}" value="individualYesPep{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="individualPep{{index}}" value="individualNoPep{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="individualCrime{{index}}" value="individualYesCrime{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="individualCrime{{index}}" value="individualNoCrime{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="individualDeclareCheckbox{{index}}" value="individualDeclareCheckbox{{index}}">I declare that the above information is true and correct.<br>
  </div>

  <div class="labels">
    <label id="individualPassportFileLabel{{index}}" for="individualPassportFileLabel{{index}}">Passport</label>
  </div>
  <div class="input-tab">
    <label for="individualPassportFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualPassportFile{{index}}" type="file" name="individualPassportFile{{index}}" style="display:none" onchange="displayFileName('individualPassportFile{{index}}', 'individualPassportFileNameSpan{{index}}')">
    </label>
    <span id="individualPassportFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualDniFrontFileLabel{{index}}" for="individualDniFrontFileLabel{{index}}">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="individualDniFrontFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualDniFrontFile{{index}}" type="file" name="individualDniFrontFile{{index}}" style="display:none" onchange="displayFileName('individualDniFrontFile{{index}}', 'individualDniFrontFileNameSpan{{index}}')">
    </label>
    <span id="individualDniFrontFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualDniReverseFileLabel{{index}}" for="individualDniReverseFileLabel{{index}}">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="individualDniReverseFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualDniReverseFile{{index}}" type="file" name="individualDniReverseFile{{index}}" style="display:none" onchange="displayFileName('individualDniReverseFile{{index}}', 'individualDniReverseFileNameSpan{{index}}')">
    </label>
    <span id="individualDniReverseFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualBillAddressProofFileLabel{{index}}" for="individualBillAddressProofFileLabel{{index}}">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="individualBillAddressProofFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualBillAddressProofFile{{index}}" type="file" name="individualBillAddressProofFile{{index}}" style="display:none" onchange="displayFileName('individualBillAddressProofFile{{index}}', 'individualBillAddressProofFileNameSpan{{index}}')">
    </label>
    <span id="individualBillAddressProofFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualCreditCheckFileLabel{{index}}" for="individualCreditCheckFileLabel{{index}}">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="individualCreditCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualCreditCheckFile{{index}}" type="file" name="individualCreditCheckFile{{index}}" style="display:none" onchange="displayFileName('individualCreditCheckFile{{index}}', 'individualCreditCheckFileNameSpan{{index}}')">
    </label>
    <span id="individualCreditCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualWorldCheckFileLabel{{index}}" for="individualWorldCheckFileLabel{{index}}">World Check</label>
  </div>
  <div class="input-tab">
    <label for="individualWorldCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualWorldCheckFile{{index}}" type="file" name="individualWorldCheckFile{{index}}" style="display:none" onchange="displayFileName('individualWorldCheckFile{{index}}', 'individualWorldCheckFileNameSpan{{index}}')">
    </label>
    <span id="individualWorldCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="individualOfacFileLabel{{index}}" for="individualOfacFileLabel{{index}}">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="individualOfacFile{{index}}" class="fileUploadButton">Choose File
      <input id="individualOfacFile{{index}}" type="file" name="individualOfacFile{{index}}" style="display:none" onchange="displayFileName('individualOfacFile{{index}}', 'individualOfacFileNameSpan{{index}}')">
    </label>
    <span id="individualOfacFileNameSpan{{index}}">Uploaded File: None</span>
  </div>

  <div class="addIndividualContainer">
    <div class="btn">
      <button id="addIndividualButton{{index}}" type="button">Add Another Individual</button>
    </div>
  </div>
`;






// Get references to the add button and the div where the HTML will be added
const additionalIndividualInfoDiv = document.getElementById('additionalIndividualInfo');

// Define a variable to keep track of the number of times the button has been clicked
let individualCount = 2;

function addEventListenersToAddIndividualButtons() {
  for (let i = 1; i <= 9; i++) {
    // Get a reference to the add button for this iteration
    const addIndividualButton = document.getElementById(`addIndividualButton${i}`);
    const testButton = document.getElementById('testButton');
    
    // Add an event listener to the add button
    //  addIndividualButton.addEventListener('click', function() {
    testButton.addEventListener('click', function() {
      // Only add HTML if the click count is less than or equal to 8
      if (individualCount < 9) {
        // Add the base HTML to the div
        const htmlForAdditionalIndividualWithIndex = htmlForAdditionalIndividual.replace(/{{index}}/g, individualCount);
        additionalIndividualInfoDiv.insertAdjacentHTML('beforeend', htmlForAdditionalIndividualWithIndex);
        
        // Increment the click count
        individualCount++;
        
        // Call the function to add event listeners to the buttons again
        addEventListenersToAddIndividualButtons();
      }
    });
  }
}

// Call the function to add event listeners to the buttons initially
addEventListenersToAddIndividualButtons();

// Update uboCount here
individualCount = 3;

// Call the function again to update the event listeners
addEventListenersToAddIndividualButtons();



































// html for additional UBO
const htmlForAdditionalUbo = `

  <br><h3 id="uboInfoSubtitle{{index}}">Info for UBO {{index}}</h3>
  
  
  <div class="labels">
    <label for="dropdown">Control Person Authorized to Apply for, Take, and Execute, Loan?</label>
  </div>
  <div class="input-tab">
    <select id="uboControlPersonAuthDropdown" name="uboControlPersonAuthDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="controlPersonAuthYes{{index}}">Yes</option>
      <option value="controlPersonAuthNo{{index}}">No</option>
    </select>
  </div>

  <div class="labels">
  <label for="dropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="uboPersonalGuarantorDropdown" name="uboPersonalGuarantorDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="uboPersonalGuarantorYes{{index}}">Yes</option>
      <option value="uboPersonalGuarantorNo{{index}}">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="dropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="uboCitizenDropdown" name="uboCitizenDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="uboCitizenYes{{index}}">Yes</option>
      <option value="uboCitizenYes{{index}}">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="uboFirstName{{index}}" for="uboFirstName{{index}}">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboFirstName{{index}}" name="uboFirstName{{index}}" placeholder="First Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboMiddleName{{index}}" for="uboMiddleName{{index}}">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboMiddleName{{index}}" name="uboMiddleName{{index}}" placeholder="Middle Name(s)" style="width: 150px;">
  </div>
  
  <div class="labels">
    <label id="uboLastName{{index}}" for="uboLastName{{index}}">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboLastName{{index}}" name="lastName{{index}}" placeholder="Last Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="homeBankAddressLabel{{index}}" for="homeBankAddressLabel{{index}}">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeAddress{{index}}" name="homeAddress{{index}}" placeholder="Home Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeCountryLabel{{index}}" for="uboHomeCountryLabel{{index}}">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="ubohomeCountry{{index}}" name="ubohomeCountry{{index}}" placeholder="Home Country" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeStreetAddressLabel{{index}}" for="uboHomeStreetAddressLabel{{index}}">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeStreetAddress{{index}}" name="uboHomeStreetAddress{{index}}" placeholder="Home Street Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeCityLabel{{index}}" for="uboHomeCityLabel{{index}}">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeCity{{index}}" name="uboHomeCity{{index}}" placeholder="Home City" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeStateLabel{{index}}" for="uboHomeStateLabel{{index}}">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeState{{index}}" name="uboHomeState{{index}}" placeholder="Home State or Province" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboHomeZipLabel{{index}}" for="uboHomeZipLabel{{index}}">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboHomeZip{{index}}" name="uboHomeZip{{index}}" placeholder="Home Zip" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label for="dropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="uboOwnRentDropdown" name="uboOwnRentDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="uboOwn{{index}}">Own</option>
      <option value="uboRent{{index}}">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="uboRentLabel{{index}}" for="uboRentLabel{{index}}">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboMonthlyRent{{index}}" name="uboMonthlyRent{{index}}" placeholder="Monthly Mortgage or Rent" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="uboPassportNumberLabel{{index}}" for="uboPassportNumberLabel{{index}}">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboPassportNumber{{index}}" name="uboPassportNumber{{index}}" placeholder="Passport Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboSsnLabel{{index}}" for="uboSsnLabel{{index}}">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboSsn{{index}}" name="uboSsn{{index}}" placeholder="SSN or ID Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboDobLabel{{index}}" for="uboDobLabel{{index}}">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="uboDob{{index}}" name="uboDob{{index}}">
  </div>
  
  <div class="labels">
    <label id="uboEmailLabel{{index}}" for="uboEmailLabel{{index}}">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="uboEmail{{index}}" name="uboEmail{{index}}" placeholder="email@email.com" style="width: 350px;" required>
  </div>
  
  <div class="labels">
    <label id="uboPhoneLabel{{index}}" for="uboPhoneLabel{{index}}">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboPhone{{index}}" name="uboPhone{{index}}" placeholder="Telephone" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="uboFicoLabel{{index}}" for="uboFicoLabel{{index}}">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboFico{{index}}" name="uboFico{{index}}" placeholder="FICO or NOSIS Score" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="uboIncomeLabel{{index}}" for="uboIncomeLabel{{index}}">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="uboIncome{{index}}" name="uboIncome{{index}}" placeholder="Monthly Income in USD" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="uboPep{{index}}" value="uboYesPep{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="uboPep{{index}}" value="uboNoPep{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="uboCrime{{index}}" value="uboYesCrime{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="uboCrime{{index}}" value="uboNoCrime{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="uboDeclareCheckbox{{index}}" value="uboDeclareCheckbox{{index}}">I declare that the above information is true and correct.<br>
  </div>

  <div class="labels">
    <label id="uboPassportFileLabel{{index}}" for="uboPassportFileLabel{{index}}">Passport</label>
  </div>
  <div class="input-tab">
    <label for="uboPassportFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboPassportFile{{index}}" type="file" name="uboPassportFile{{index}}" style="display:none" onchange="displayFileName('uboPassportFile{{index}}', 'uboPassportFileNameSpan{{index}}')">
    </label>
    <span id="uboPassportFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboDniFrontFileLabel{{index}}" for="uboDniFrontFileLabel{{index}}">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="uboDniFrontFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboDniFrontFile{{index}}" type="file" name="uboDniFrontFile{{index}}" style="display:none" onchange="displayFileName('uboDniFrontFile{{index}}', 'uboDniFrontFileNameSpan{{index}}')">
    </label>
    <span id="uboDniFrontFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboDniReverseFileLabel{{index}}" for="uboDniReverseFileLabel{{index}}">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="uboDniReverseFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboDniReverseFile{{index}}" type="file" name="uboDniReverseFile{{index}}" style="display:none" onchange="displayFileName('uboDniReverseFile{{index}}', 'uboDniReverseFileNameSpan{{index}}')">
    </label>
    <span id="uboDniReverseFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboBillAddressProofFileLabel{{index}}" for="uboBillAddressProofFileLabel{{index}}">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="uboBillAddressProofFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboBillAddressProofFile{{index}}" type="file" name="uboBillAddressProofFile{{index}}" style="display:none" onchange="displayFileName('uboBillAddressProofFile{{index}}', 'uboBillAddressProofFileNameSpan{{index}}')">
    </label>
    <span id="uboBillAddressProofFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboCreditCheckFileLabel{{index}}" for="uboCreditCheckFileLabel{{index}}">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="uboCreditCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboCreditCheckFile{{index}}" type="file" name="uboCreditCheckFile{{index}}" style="display:none" onchange="displayFileName('uboCreditCheckFile{{index}}', 'uboCreditCheckFileNameSpan{{index}}')">
    </label>
    <span id="uboCreditCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboWorldCheckFileLabel{{index}}" for="uboWorldCheckFileLabel{{index}}">World Check</label>
  </div>
  <div class="input-tab">
    <label for="uboWorldCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboWorldCheckFile{{index}}" type="file" name="uboWorldCheckFile{{index}}" style="display:none" onchange="displayFileName('uboWorldCheckFile{{index}}', 'uboWorldCheckFileNameSpan{{index}}')">
    </label>
    <span id="uboWorldCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="uboOfacFileLabel{{index}}" for="uboOfacFileLabel{{index}}">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="uboOfacFile{{index}}" class="fileUploadButton">Choose File
      <input id="uboOfacFile{{index}}" type="file" name="uboOfacFile{{index}}" style="display:none" onchange="displayFileName('uboOfacFile{{index}}', 'uboOfacFileNameSpan{{index}}')">
    </label>
    <span id="uboOfacFileNameSpan{{index}}">Uploaded File: None</span>
  </div>

  <div class="addUboContainer">
    <div class="btn">
      <button id="addUboButton{{index}}" type="button">Add Another UBO</button>
    </div>
  </div>
  
  <div class="addDirectorContainer">
    <div class="btn">
      <button id="addDirectorButton{{index}}" type="button">Add an Entity Director Who is not a UBO</button>
    </div>
  </div>
`;










// html for additional Director
const htmlForAdditionalDirector = `

  <br><h3 id="directorInfoSubtitle{{index}}">Info for director {{index}}</h3>
  
  
  <div class="labels">
    <label for="dropdown">Control Person Authorized to Apply for, Take, and Execute, Loan?</label>
  </div>
  <div class="input-tab">
    <select id="directorControlPersonAuthDropdown" name="directorControlPersonAuthDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="controlPersonAuthYes{{index}}">Yes</option>
      <option value="controlPersonAuthNo{{index}}">No</option>
    </select>
  </div>

  <div class="labels">
  <label for="dropdown">Personal Guarantor?</label>
  </div>
  <div class="input-tab">
    <select id="directorPersonalGuarantorDropdown" name="directorPersonalGuarantorDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="directorPersonalGuarantorYes{{index}}">Yes</option>
      <option value="directorPersonalGuarantorNo{{index}}">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label for="dropdown">U.S. Citizen or Green Card?</label>
  </div>
  <div class="input-tab">
    <select id="directorCitizenDropdown" name="directorCitizenDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="directorCitizenYes{{index}}">Yes</option>
      <option value="directorCitizenYes{{index}}">No</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="directorFirstName{{index}}" for="directorFirstName{{index}}">First Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorFirstName{{index}}" name="directorFirstName{{index}}" placeholder="First Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorMiddleName{{index}}" for="directorMiddleName{{index}}">Middle Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorMiddleName{{index}}" name="directorMiddleName{{index}}" placeholder="Middle Name(s)" style="width: 150px;">
  </div>
  
  <div class="labels">
    <label id="directorLastName{{index}}" for="directorLastName{{index}}">Last Name(s)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorLastName{{index}}" name="lastName{{index}}" placeholder="Last Name(s)" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="homeBankAddressLabel{{index}}" for="homeBankAddressLabel{{index}}">Home Address (must match recent bill)</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="homeAddress{{index}}" name="homeAddress{{index}}" placeholder="Home Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeCountryLabel{{index}}" for="directorHomeCountryLabel{{index}}">Home Country</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorhomeCountry{{index}}" name="directorhomeCountry{{index}}" placeholder="Home Country" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeStreetAddressLabel{{index}}" for="directorHomeStreetAddressLabel{{index}}">Home Street Address</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeStreetAddress{{index}}" name="directorHomeStreetAddress{{index}}" placeholder="Home Street Address" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeCityLabel{{index}}" for="directorHomeCityLabel{{index}}">Home City</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeCity{{index}}" name="directorHomeCity{{index}}" placeholder="Home City" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeStateLabel{{index}}" for="directorHomeStateLabel{{index}}">Home State or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeState{{index}}" name="directorHomeState{{index}}" placeholder="Home State or Province" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorHomeZipLabel{{index}}" for="directorHomeZipLabel{{index}}">Home Zip or Province</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorHomeZip{{index}}" name="directorHomeZip{{index}}" placeholder="Home Zip" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label for="dropdown">Own or Rent?</label>
  </div>
  <div class="input-tab">
    <select id="directorOwnRentDropdown" name="directorOwnRentDropdown{{index}}" required>
      <option disabled value selected>Select an option</option>
      <option value="directorOwn{{index}}">Own</option>
      <option value="directorRent{{index}}">Rent</option>
    </select>
  </div>
  
  <div class="labels">
    <label id="directorRentLabel{{index}}" for="directorRentLabel{{index}}">Monthly Mortgage or Rent in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorMonthlyRent{{index}}" name="directorMonthlyRent{{index}}" placeholder="Monthly Mortgage or Rent" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="directorPassportNumberLabel{{index}}" for="directorPassportNumberLabel{{index}}">Passport Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorPassportNumber{{index}}" name="directorPassportNumber{{index}}" placeholder="Passport Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorSsnLabel{{index}}" for="directorSsnLabel{{index}}">SSN or ID Number</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorSsn{{index}}" name="directorSsn{{index}}" placeholder="SSN or ID Number" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorDobLabel{{index}}" for="directorDobLabel{{index}}">Date of Birth</label>
  </div>
  <div class="input-tab">
    <input type="date" id="directorDob{{index}}" name="directorDob{{index}}">
  </div>
  
  <div class="labels">
    <label id="directorEmailLabel{{index}}" for="directorEmailLabel{{index}}">Email Address</label></div>
  <div class="input-tab">
    <input class="input-field" type="email" id="directorEmail{{index}}" name="directorEmail{{index}}" placeholder="email@email.com" style="width: 350px;" required>
  </div>
  
  <div class="labels">
    <label id="directorPhoneLabel{{index}}" for="directorPhoneLabel{{index}}">Telephone</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorPhone{{index}}" name="directorPhone{{index}}" placeholder="Telephone" style="width: 150px;" required>
  </div>
  
  <div class="labels">
    <label id="directorFicoLabel{{index}}" for="directorFicoLabel{{index}}">FICO or NOSIS Score</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorFico{{index}}" name="directorFico{{index}}" placeholder="FICO or NOSIS Score" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <div class="labels">
    <label id="directorIncomeLabel{{index}}" for="directorIncomeLabel{{index}}">Monthly Income in USD</label>
  </div>
  <div class="input-tab">
    <input class="input-field" type="text" id="directorIncome{{index}}" name="directorIncome{{index}}" placeholder="Monthly Income in USD" style="width: 150px;" required pattern="[0-9]+" title="Please enter only numbers.">
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    Are you a Politically Exposed Person (PEP) or related to a PEP? <br> A PEP is person who is or has been entrusted with any prominent public function in  the United States of America, a country or territory outside United States of  America, or by an international organization. By “related”, we mean that you are a parent, spouse, sibling or child of a PEP, or closely connected to a PEP either socially  or professionally.
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="directorPep{{index}}" value="directorYesPep{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="directorPep{{index}}" value="directorNoPep{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px;">
    Have you ever been convicted of a crime involving fraud or dishonesty? 
  </div>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab">
    <label><input type="radio" name="directorCrime{{index}}" value="directorYesCrime{{index}}" style="margin-left: 50px;" checked>Yes</label>
    <label><input type="radio" name="directorCrime{{index}}" value="directorNoCrime{{index}}">No</label>
  </div>
  
  <br><br><div style="font-size: 18px; width: 700px; margin-left: 325px; text-align: justify;">
    I declare that the above information is true and correct. I am aware that I may be  subject to prosecution and criminal sanction under written law if I am found to have  made any false statement which I know to be false or which I do not believe to be true,  or if I have intentionally suppressed any material fact. 
  </div><br>
  
  <div class="labels">
    <label></label>
  </div>
  <div class="input-tab" style="margin-left: 20px;">
    <input type="checkbox" name="directorDeclareCheckbox{{index}}" value="directorDeclareCheckbox{{index}}">I declare that the above information is true and correct.<br>
  </div>

  <div class="labels">
    <label id="directorPassportFileLabel{{index}}" for="directorPassportFileLabel{{index}}">Passport</label>
  </div>
  <div class="input-tab">
    <label for="directorPassportFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorPassportFile{{index}}" type="file" name="directorPassportFile{{index}}" style="display:none" onchange="displayFileName('directorPassportFile{{index}}', 'directorPassportFileNameSpan{{index}}')">
    </label>
    <span id="directorPassportFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorDniFrontFileLabel{{index}}" for="directorDniFrontFileLabel{{index}}">DNI/Drivers License (Front)</label>
  </div>
  <div class="input-tab">
    <label for="directorDniFrontFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorDniFrontFile{{index}}" type="file" name="directorDniFrontFile{{index}}" style="display:none" onchange="displayFileName('directorDniFrontFile{{index}}', 'directorDniFrontFileNameSpan{{index}}')">
    </label>
    <span id="directorDniFrontFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorDniReverseFileLabel{{index}}" for="directorDniReverseFileLabel{{index}}">DNI/Drivers License (Reverse)</label>
  </div>
  <div class="input-tab">
    <label for="directorDniReverseFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorDniReverseFile{{index}}" type="file" name="directorDniReverseFile{{index}}" style="display:none" onchange="displayFileName('directorDniReverseFile{{index}}', 'directorDniReverseFileNameSpan{{index}}')">
    </label>
    <span id="directorDniReverseFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorBillAddressProofFileLabel{{index}}" for="directorBillAddressProofFileLabel{{index}}">Bill for Proof of Address</label>
  </div>
  <div class="input-tab">
    <label for="directorBillAddressProofFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorBillAddressProofFile{{index}}" type="file" name="directorBillAddressProofFile{{index}}" style="display:none" onchange="displayFileName('directorBillAddressProofFile{{index}}', 'directorBillAddressProofFileNameSpan{{index}}')">
    </label>
    <span id="directorBillAddressProofFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorCreditCheckFileLabel{{index}}" for="directorCreditCheckFileLabel{{index}}">Credit Check/NOSIS</label>
  </div>
  <div class="input-tab">
    <label for="directorCreditCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorCreditCheckFile{{index}}" type="file" name="directorCreditCheckFile{{index}}" style="display:none" onchange="displayFileName('directorCreditCheckFile{{index}}', 'directorCreditCheckFileNameSpan{{index}}')">
    </label>
    <span id="directorCreditCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorWorldCheckFileLabel{{index}}" for="directorWorldCheckFileLabel{{index}}">World Check</label>
  </div>
  <div class="input-tab">
    <label for="directorWorldCheckFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorWorldCheckFile{{index}}" type="file" name="directorWorldCheckFile{{index}}" style="display:none" onchange="displayFileName('directorWorldCheckFile{{index}}', 'directorWorldCheckFileNameSpan{{index}}')">
    </label>
    <span id="directorWorldCheckFileNameSpan{{index}}">Uploaded File: None</span>
  </div>
  
  <div class="labels">
    <label id="directorOfacFileLabel{{index}}" for="directorOfacFileLabel{{index}}">OFAC Check</label>
  </div>
  <div class="input-tab">
    <label for="directorOfacFile{{index}}" class="fileUploadButton">Choose File
      <input id="directorOfacFile{{index}}" type="file" name="directorOfacFile{{index}}" style="display:none" onchange="displayFileName('directorOfacFile{{index}}', 'directorOfacFileNameSpan{{index}}')">
    </label>
    <span id="directorOfacFileNameSpan{{index}}">Uploaded File: None</span>
  </div>

  <div class="addUboContainer">
    <div class="btn">
      <button id="addUboButton{{index}}" type="button">Add Another UBO</button>
    </div>
  </div>
  
  <div class="addDirectorContainer">
    <div class="btn">
      <button id="addDirectorButton{{index}}" type="button">Add an Entity Director Who is not a director</button>
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

//function formAsPdf() {
//submitButton.addEventListener("click", function () {
//  window.jsPDF = window.jspdf.jsPDF;
//  var docPDF = new jsPDF();
//  var elementHTML = document.querySelector("#entireForm");
//  docPDF.fromHTML(elementHTML, function() {
//    const currentDate = new Date().toISOString().slice(0, 10); // get current date in YYYY-MM-DD format
////    const filename = `${firstName1.value}_${lastName1.value}_${currentDate}.pdf`; // create filename using values from the form and the current date
//    const filename = `${currentDate}.pdf`; // create filename using values from the form and the current date
//    docPDF.save(filename); // save the file with the generated filename
//  });
//});
//}



  