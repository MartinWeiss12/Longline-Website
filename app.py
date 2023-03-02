#!/usr/bin/env python3

#!/usr/bin/env python3
import os
import json
import boto3
import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, make_response
from flask_session import Session
from werkzeug.utils import secure_filename
from io import BytesIO
import pdfkit


app = Flask(__name__, template_folder='templates')
app.config ['SECRET_KEY'] = 'longline'
#app.config ['SESSION_PERMANENT'] = False
#app.config ['SESSION_TYPE'] = 'filesystem'
#Session(app)

directory = '/userFiles'
flaskBackendPin = '1234'


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/about', methods=['GET', 'POST'])
def about():
	if request.method == 'GET':
		return render_template('about.html', title='About')
	
@app.route('/solutions', methods=['GET', 'POST'])
def solutions():
	if request.method == 'GET':
		return render_template('solutions.html', title='Solutions')
	
@app.route('/invest', methods=['GET', 'POST'])
def invest():
	if request.method == 'GET':
		return render_template('invest.html', title='Invest')
	
@app.route('/contact', methods=['GET', 'POST'])
def contact():
	if request.method == 'GET':
		return render_template('contact.html', title='Contact')
	
@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template('login.html', title='Login')
	
@app.route('/borrowLogin', methods=['GET', 'POST'])
def borrowLogin():
	if request.method == 'GET':
		return render_template('borrowLogin.html', title='Borrow')
	
@app.route('/borrow', methods=['POST'])
def borrow():
	
	userPin = request.form.get('userPin')
	
	if(userPin == flaskBackendPin):
		return render_template('borrow.html', title='Borrow')
	else:
		error = 'Incorrect PIN. Please try again.'
		return render_template('borrowLogin.html', title='Borrow', error=error)
	
@app.route('/borrow')
def borrow_redirect():
	userPin = request.args.get('userPin')
	if userPin == flaskBackendPin:
		return render_template('borrow.html', title='Borrow')
	else:
		return redirect('/borrowLogin')
	
@app.route('/submit')
def submit_redirect():
	userPin = request.args.get('userPin')
	if userPin == flaskBackendPin:
		return render_template('submit.html', title='Submit')
	else:
		return redirect('/borrowLogin')
	
	
@app.route('/submit', methods=['POST'])
def submit():
	
	loanPurpose = request.form.getlist('loanPurpose')
	otherLoanPurpose = request.form.get('otherLoanText')
	loanTotal = request.form.get('loanTotal')
	trancheAmt = request.form.get('trancheAmt')
	numTranches = request.form.get('numTranches')
	collateralInfo = request.form.getlist('collateralInfo')
	collateralSpec = request.form.get('collateralSpec')
	collateralValue = request.form.get('collateralValue')
	escrowAgent = request.form.get('escrowAgent')
	vaultInfo = request.form.get('vaultInfo')
	securityReceivedCheckbox = request.form.getlist('securityReceivedCheckbox')
	securityGuaranteedCheckbox = request.form.getlist('securityGuaranteedCheckbox')
	secRecDate = request.form.get('secRecDate')
	orgFeePoints = request.form.get('orgFeePoints')
	orgFeeUSD = request.form.get('orgFeeUSD')
	agreeOrgFee = request.form.get('agreeOrgFee')
	interestRate = request.form.get('interestRate')
	apr = request.form.get('apr')
	agreeAPR = request.form.get('agreeAPR')
	#interestDropdown = request.form.get('interestDropdown') uncomment when we unlock interestDropdown
	interestDropdown = 'N/A'
	agreeInterest = request.form.get('agreeInterestOnly')
	#interestPaymentDropdown = request.form.get('interestPaymentDropdown') uncomment when we unlock interestPaymentDropdown
	interestPaymentDropdown = 'On-Maturity'
	loanTerm = request.form.get('loanTerm')
	agreeLoanTerm = request.form.get('agreeLoanTerm')
	loanProceeds = request.form.get('loanProceeds')
	agreeLoanProceeds = request.form.get('agreeLoanProceeds')
	bankFees = request.form.get('bankFees')
	agreeBankFees = request.form.get('agreeBankFees')
	disbursedTotal = request.form.get('disbursedTotal')
	agreeDisbursedTotal = request.form.get('agreeDisbursedTotal')
	borrowerDropdown = request.form.get('borrowerDropdown')
	individualPersonalGuarantorDropdown1 = request.form.get('individualPersonalGuarantorDropdown1')
	individualCitizenDropdown1 = request.form.get('individualCitizenDropdown1')
	individualSDResidentDropdown1 = request.form.get('individualSDResidentDropdown1')
	individualFirstName1 = request.form.get('individualFirstName1')
	individualMiddleName1 = request.form.get('individualMiddleName1')
	individualLastName1 = request.form.get('individualLastName1')
	individualHomeBankAddress1 = request.form.get('individualHomeBankAddress1')
	individualHomeStreetAddress1 = request.form.get('individualHomeStreetAddress1')
	individualHomeCity1 = request.form.get('individualHomeCity1')
	individualHomeState1 = request.form.get('individualHomeState1')
	individualHomeZip1 = request.form.get('individualHomeZip1')
	individualhomeCountry1 = request.form.get('individualhomeCountry1')
	individualOwnRentDropdown1 = request.form.get('individualOwnRentDropdown1')
	individualMonthlyRent1 = request.form.get('individualMonthlyRent1')
	individualPassportNumber1 = request.form.get('individualPassportNumber1')
	individualSsn1 = request.form.get('individualSsn1')
	individualDob1 = request.form.get('individualDob1')
	individualEmail1 = request.form.get('individualEmail1')
	individualPhone1 = request.form.get('individualPhone1')
	individualFico1 = request.form.get('individualFico1')
	individualIncome1 = request.form.get('individualIncome1')
	individualPep1 = request.form.get('individualPep1')
	individualCrime1 = request.form.get('individualCrime1')
	individualDeclareCheckbox1 = request.form.get('individualDeclareCheckbox1')
	
	data = {
		'Loan Purpose': loanPurpose,
		'Loan Purpose (other)': otherLoanPurpose,
		'Loan Total': loanTotal,
		'Tranche Amount': trancheAmt,
		'Number of Tranches': numTranches,
		'Collateral': collateralInfo,
		'Collateral Specifications': collateralSpec,
		'Collateral Value': collateralValue,
		'Escrow Agent': escrowAgent,
		'Vault Info': vaultInfo,
		'Security Received': securityReceivedCheckbox,
		'Security Guaranteed': securityGuaranteedCheckbox,
		'Security Received Date': secRecDate,
		'Origination Fee (points)': orgFeePoints,
		'Origination Fee (USD)': orgFeeUSD,
		'Agree Origination Fee': agreeOrgFee,
		'Interest Rate': interestRate,
		'APR': apr,
		'Agree APR': agreeAPR,
		'Interest': interestDropdown,
		'Agree Interest': agreeInterest,
		'Interest Payment': interestPaymentDropdown,
		'Loan Term': loanTerm,
		'Agree Loan Term': agreeLoanTerm,
		'Loan Proceeds': loanProceeds,
		'Agree Loan Proceeds': agreeLoanProceeds,
		'Bank Fees': bankFees,
		'Agree Bank Fees': agreeBankFees,
		'Disbursed Total': disbursedTotal,
		'Agree Disbursed Total': agreeDisbursedTotal,
		'Borrower is an': borrowerDropdown,
		'Individual 1 Personal Guarantor': individualPersonalGuarantorDropdown1,
		'Individual 1 Citizen': individualCitizenDropdown1,
		'Individual 1 South Dakota Resident': individualSDResidentDropdown1,
		'Individual 1 First Name': individualFirstName1,
		'Individual 1 Middle Name': individualMiddleName1,
		'Individual 1 Last Name': individualLastName1,
		'Individual 1 Home Address': individualHomeBankAddress1,
		'Individual 1 Home Street Address': individualHomeStreetAddress1,
		'Individual 1 Home City': individualHomeCity1,
		'Individual 1 Home State': individualHomeState1,
		'Individual 1 Home Zip': individualHomeZip1,
		'Individual 1 Home Country': individualhomeCountry1,
		'Individual 1 Own or Rent': individualOwnRentDropdown1,
		'Individual 1 Monthly Mortgage/Rent': individualMonthlyRent1,
		'Individual 1 Passport Number': individualPassportNumber1,
		'Individual 1 SSN': individualSsn1,
		'Individual 1 Date of Birth': individualDob1,
		'Individual 1 Email': individualEmail1,
		'Individual 1 Phone Number': individualPhone1,
		'Individual 1 FICO/NOSIS Number': individualFico1,
		'Individual 1 Income': individualIncome1,
		'Individual 1 Politically Exposed Person': individualPep1,
		'Individual 1 Crime': individualCrime1,
		'Individual 1 Declare': individualDeclareCheckbox1,
	}
	
	
	if (borrowerDropdown == 'Individual'):
		
		folderForData = individualLastName1 + individualFirstName1 + 'Data'
		os.mkdir(folderForData)
		
		folderForFiles = os.path.join(folderForData, individualLastName1 + individualFirstName1 + 'Files')
		os.mkdir(folderForFiles)
		
		individualPassportFile1 = request.files['individualPassportFile1']
		individualPassportFile1FileName = secure_filename(individualPassportFile1.filename)
		individualPassportFile1FileNameExt = os.path.splitext(individualPassportFile1FileName)[1]
		renamedIndividualPassportFile1 = individualLastName1 + individualFirstName1 + 'PassportFile' + individualPassportFile1FileNameExt
		repathedIndividualPassportFile1 = os.path.join(folderForFiles, renamedIndividualPassportFile1)
		individualPassportFile1.save(repathedIndividualPassportFile1)
		
		individualDniFrontFile1 = request.files['individualDniFrontFile1']
		individualDniFrontFile1FileName = secure_filename(individualDniFrontFile1.filename)
		individualDniFrontFile1FileNameExt = os.path.splitext(individualDniFrontFile1FileName)[1]
		renamedIndividualDniFrontFile1 = individualLastName1 + individualFirstName1 + 'DniFrontFile' + individualDniFrontFile1FileNameExt
		repathedIndividualDniFrontFile1 = os.path.join(folderForFiles, renamedIndividualDniFrontFile1)
		individualDniFrontFile1.save(repathedIndividualDniFrontFile1)
		
		individualDniReverseFile1 = request.files['individualDniReverseFile1']
		individualDniReverseFile1FileName = secure_filename(individualDniReverseFile1.filename)
		individualDniReverseFile1FileNameExt = os.path.splitext(individualDniReverseFile1FileName)[1]
		renamedIndividualDniReverseFile1 = individualLastName1 + individualFirstName1 + 'DniReverseFile' + individualDniReverseFile1FileNameExt
		repathedIndividualDniReverseFile1 = os.path.join(folderForFiles, renamedIndividualDniReverseFile1)
		individualDniReverseFile1.save(repathedIndividualDniReverseFile1)
		
		
		
		
		
		
		
		
		
		
		
#       if (len(individualFirstName2) > 0):
#       if (len(individualFirstName3) > 0):
#       if (len(individualFirstName4) > 0):
#       if (len(individualFirstName5) > 0):
#       if (len(individualFirstName6) > 0):
#       if (len(individualFirstName7) > 0):
#       if (len(individualFirstName8) > 0):
		
		
		
		
		
		
	null = ''
	cleanedData = {k: v for k, v in data.items() if v != ''}    
	jsonName = individualLastName1 + individualFirstName1 + 'Data.json' 
	with open(f'{folderForData}/{jsonName}', 'w') as f:
		json.dump(cleanedData, f)
		
		
		
		
		
		
		
		
		
		
#   html = render_template('borrow.html') #use longlinelending.com, not borrow.html
#   pdf = pdfkit.from_string(html, options={"enable-local-file-access": ""})
#   
#   # Save the PDF file to disk
#   with open("output.pdf", "wb") as f:
#       f.write(pdf)
		
		
		
#   JSON -> fileName = last name + first name + date/loan number?
		
	# Upload data.json to S3
	#s3 = boto3.resource('s3')
	bucket_name = 'your-bucket-name'
	object_key = 'data.json'
	#s3.Object(bucket_name, object_key).put(Body=open('data.json', 'rb'))
	
	return render_template('submitted.html', title='Submitted')





#
#@app.route('/submit', methods=['POST'])
#def downloadPDF():
#   form_data = request.form
#   
#   # create PDF version of HTML form data
#   pdf = pdfkit.from_file('borrow.html', False)
#   
#   # set headers to download the PDF file
#   response = make_response(pdf)
#   response.headers['Content-Type'] = 'application/pdf'
#   response.headers['Content-Disposition'] = 'attachment; filename=form.pdf'
#   
#   return response








if __name__ == '__main__':
	app.run(debug=True)