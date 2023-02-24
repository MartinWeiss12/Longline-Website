const form = document.getElementById('investForm')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const email = document.getElementById('email')
const ssn1 = document.getElementById('ssn1')
const ssn2 = document.getElementById('ssn2')
const ssn3 = document.getElementById('ssn3')
const address1 = document.getElementById('address1')
const address2 = document.getElementById('address2')
const city = document.getElementById('city')
const homePhone1 = document.getElementById('homePhone1')
const homePhone2 = document.getElementById('homePhone2')
const homePhone3 = document.getElementById('homePhone3')
const cellPhone1 = document.getElementById('cellPhone1')
const cellPhone2 = document.getElementById('cellPhone2')
const cellPhone3 = document.getElementById('cellPhone3')
const driverID = document.getElementById('driverID')




const fileInput = document.querySelector('input[type="file"]');
const fileDisplay = document.querySelector('.file-name');


const errorElement = document.getElementById('error')

form.addEventListener('submit', (event) => {
  let messages = []
  
  errorElement.style.color = 'red'
  
  if (isNaN(Number(ssn1.value)) || isNaN(Number(ssn2.value)) || isNaN(Number(ssn3.value))) {
    messages.push('SSN needs to be a number')
  }
  
  if (ssn1.value.length !== 3 || ssn2.value.length !== 2 || ssn3.value.length !== 4) {
    messages.push('SSN needs to be in the format xxx-xx-xxxx')
  }
  
  if (isNaN(Number(homePhone1.value)) || isNaN(Number(homePhone2.value)) || isNaN(Number(homePhone3.value))) {
    messages.push('Home Phone needs to be a number')
  }
  
  if (homePhone1.value.length !== 3 || homePhone2.value.length !== 3 || homePhone3.value.length !== 4) {
    messages.push('Home Phone needs to be in the format xxx-xxx-xxxx')
  }
  
  if (isNaN(Number(cellPhone1.value)) || isNaN(Number(cellPhone2.value)) || isNaN(Number(cellPhone3.value))) {
    messages.push('Cell Phone needs to be a number')
  }
  
  if (cellPhone1.value.length !== 3 || cellPhone2.value.length !== 3 || cellPhone3.value.length !== 4) {
    messages.push('Cell Phone needs to be in the format xxx-xxx-xxxx')
  }
  
  if (usCitizen.value === "No") {
    messages.push('Must be a U.S. Citizen.');
  }
  
  if (messages.length > 0) {
    errorElement.innerHTML = '<strong>Please Fix The Following Errors:</strong><br>' + messages.join('<br>')
    event.preventDefault()
  }
})


fileInput.addEventListener('change', function() {
  fileDisplay.textContent = fileInput.files[0].name;
});

const currentYear = new Date().getFullYear();
const copyright = document.getElementById("copyright");
copyright.innerHTML = "&copy; " + currentYear + " Longline Lending LLC. All rights reserved."

//function uploadFile() {
//let fileInput = document.querySelector("input[type=file]");
//let file = fileInput.files[0];
//let formData = new FormData();
//formData.append("file", file);
//
//let xhr = new XMLHttpRequest();
//xhr.open("POST", "upload.php", true);
//xhr.onreadystatechange = function() {
//  if (xhr.readyState === 4 && xhr.status === 200) {
//    alert("File uploaded successfully!");
//  }
//};
//xhr.send(formData);
//}
//
//let fileInput = document.querySelector("input[type=file]");
//fileInput.addEventListener("change", function() {
//let file = this.files[0];
//let fileName = file.name;
//let fileLabel = document.querySelector(".file-name");
//fileLabel.textContent = fileName;
//});

//check that names are strings, not numbers