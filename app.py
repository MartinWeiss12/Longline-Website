#!/usr/bin/env python3
import os
import json
import random
import boto3
import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, make_response
from flask_session import Session
from werkzeug.utils import secure_filename


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
	
#@app.route('/invest', methods=['GET', 'POST'])
#def invest():
#	if request.method == 'GET':
#		return render_template('invest.html', title='Invest')
	
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
def borrowRedirect():
	userPin = request.args.get('userPin')
	if userPin == flaskBackendPin:
		return render_template('borrow.html', title='Borrow')
	else:
		return redirect('/borrowLogin')
	
@app.route('/investorLogin', methods=['GET', 'POST'])
def investorLogin():
	if request.method == 'GET':
		return render_template('investorLogin.html', title='Invest')
	
@app.route('/invest', methods=['POST'])
def invest():
	
	userPin = request.form.get('userPin')
	if(userPin == flaskBackendPin):
		return render_template('invest.html', title='Invest')
	else:
		error = 'Incorrect PIN. Please try again.'
		return render_template('investorLogin.html', title='Invest', error=error)
	
@app.route('/invest')
def investRedirect():
	userPin = request.args.get('userPin')
	if userPin == flaskBackendPin:
		return render_template('invest.html', title='Invest')
	else:
		return redirect('/investorLogin')
	
@app.route('/borrowSubmitted')
def loanSubmitRedirect():
	userPin = request.args.get('userPin')
	if userPin == flaskBackendPin:
		return render_template('borrowSubmitted.html', title='Submitted')
	else:
		return redirect('/borrowLogin')
	
@app.route('/investorSubmitted')
def investSubmitRedirect():
	userPin = request.args.get('userPin')
	if userPin == flaskBackendPin:
		return render_template('investorSubmitted.html', title='Submitted')
	else:
		return redirect('/investorLogin')
	
	
@app.route('/borrowSubmitted', methods=['POST'])
def loanSubmit():
	
	data = {}
	data['Loan Purpose'] = request.form.getlist('loanPurpose')
	data['Other Loan Purpose'] = request.form.get('otherLoanText', '#No Value')
	data['Loan Total'] = request.form.get('loanTotal')
	data['Trance Amount'] = request.form.get('trancheAmt')
	data['Number of Tranches'] = request.form.get('numTranches')
	data['Collateral'] = request.form.getlist('collateralInfo')
	data['Collateral (other)'] = request.form.get('otherCollateralText', '#No Value')
	data['Collateral Specifications'] = request.form.get('collateralSpec')
	data['Collateral Value'] = request.form.get('collateralValue')
	data['Escrow Agent'] = request.form.get('escrowAgent')
	data['Vault Info'] = request.form.get('vaultInfo')
	data['Security Received'] = request.form.getlist('securityReceivedCheckbox')
	data['Security Guaranteed'] = request.form.getlist('securityGuaranteedCheckbox')
	data['Security Received Date'] = request.form.get('secRecDate')
	data['Origination Fee (points)'] = request.form.get('orgFeePoints')
	data['Origination Fee (USD)'] = request.form.get('orgFeeUSD')
	data['Agree Origination Fee'] = request.form.get('agreeOrgFee')
	data['Interest Rate'] = request.form.get('interestRate')
	data['APR'] = request.form.get('apr')
	data['Agree APR'] = request.form.get('agreeAPR')
	# data['Interest'] = request.form.get('interestDropdown') uncomment when we unlock interestDropdown
	data['Interest'] = 'N/A'
	data['Agree Interest'] = request.form.get('agreeInterestOnly')
	# data['Interest Payment'] = request.form.get('interestPaymentDropdown') uncomment when we unlock interestPaymentDropdown
	data['Interest Payment'] = 'On-Maturity'
	data['Loan Term'] = request.form.get('loanTerm')
	data['Agree Loan Term'] = request.form.get('agreeLoanTerm')
	data['Loan Proceeds'] = request.form.get('loanProceeds')
	data['Agree Loan Proceeds'] = request.form.get('agreeLoanProceeds')
	data['Bank Fees'] = request.form.get('bankFees')
	data['Agree Bank Fees'] = request.form.get('agreeBankFees')
	data['Disbursed Total'] = request.form.get('disbursedTotal')
	data['Agree Disbursed Total'] = request.form.get('agreeDisbursedTotal')
	data['Borrower is an'] = request.form.get('borrowerDropdown')
	data['Beneficiary Name'] = request.form.get('beneficiaryName')
	
	repeatedIndividualData = {}
	for i in range(1, 9):
		repeatedIndividualData[f'Individual {i} Personal Guarantor'] = request.form.get(f'individualPersonalGuarantorDropdown{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Citizen'] = request.form.get(f'individualCitizenDropdown{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} South Dakota Resident'] = request.form.get(f'individualSDResidentDropdown{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} First Name'] = request.form.get(f'individualFirstName{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Middle Name'] = request.form.get(f'individualMiddleName{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Last Name'] = request.form.get(f'individualLastName{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Home Address'] = request.form.get(f'individualHomeBankAddress{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Home Street Address'] = request.form.get(f'individualHomeStreetAddress{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Home City'] = request.form.get(f'individualHomeCity{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Home State'] = request.form.get(f'individualHomeState{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Home Zip'] = request.form.get(f'individualHomeZip{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Home Country'] = request.form.get(f'individualhomeCountry{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Own or Rent'] = request.form.get(f'individualOwnRentDropdown{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Monthly Mortgage/Rent'] = request.form.get(f'individualMonthlyRent{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Passport Number'] = request.form.get(f'individualPassportNumber{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} SSN'] = request.form.get(f'individualSsn{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Date of Birth'] = request.form.get(f'individualDob{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Email'] = request.form.get(f'individualEmail{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Phone Number'] = request.form.get(f'individualPhone{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} FICO/NOSIS Number'] = request.form.get(f'individualFico{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Income'] = request.form.get(f'individualIncome{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Politically Exposed Person'] = request.form.get(f'individualPep{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Crime'] = request.form.get(f'individualCrime{i}', '#No Value')
		repeatedIndividualData[f'Individual {i} Declare'] = request.form.get(f'individualDeclareCheckbox{i}', '#No Value')
		
	data.update(repeatedIndividualData)	
	loanApplicationNumber = str(random.randint(1, 100))
	folderForApplication = 'LoanApplication' + loanApplicationNumber
	os.mkdir(folderForApplication)
	
	if (request.form.get('borrowerDropdown') == 'Individual'):
		for i in range(1, 9):
			individualFirstName = repeatedIndividualData[f'Individual {i} First Name']
			individualLastName = repeatedIndividualData[f'Individual {i} First Name']
			PassportFile = f'individualPassportFile{i}'
			DNIFrontFile = f'individualDniFrontFile{i}'
			DNIReverseFile = f'individualDniReverseFile{i}'
			BillAddressProofFile = f'individualBillAddressProofFile{i}'
			CreditCheckFile = f'individualCreditCheckFile{i}'
			WorldCheckFile = f'individualWorldCheckFile{i}'
			OFACFile = f'individualOfacFile{i}'
			
			if individualFirstName != '#No Value':
				folderForFilesName = individualLastName + individualFirstName + 'Files'
				folderForFiles = os.path.join(folderForApplication, folderForFilesName)
				os.mkdir(folderForFiles)
				
				for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
					file = request.files[fileType]
					fileName = secure_filename(file.filename)
					fileNameExt = os.path.splitext(fileName)[1]
					newFileName = (individualLastName + individualFirstName + fileType + fileNameExt).replace('individual', '')
					newFilePath = os.path.join(folderForFiles, newFileName)
					file.save(newFilePath)
					
	cleanedData = {k: v for k, v in data.items() if v != '#No Value'}
	#cleanedData = {k: v for k, v in data.items() if v not in ('#No Value', '')} remove blanks too?
	jsonName = 'LoanApplication' + loanApplicationNumber + '.json' 
	with open(f'{folderForApplication}/{jsonName}', 'w') as f:
		json.dump(cleanedData, f)
		

	# Upload cleanedData.json to S3
	#s3 = boto3.resource('s3')
	bucket_name = 'your-bucket-name'
	object_key = 'data.json'
	#s3.Object(bucket_name, object_key).put(Body=open('cleanedData.json', 'rb'))
	
	return render_template('borrowSubmitted.html', title='Submitted')


@app.route('/investorSubmitted', methods=['POST'])
def investorSubmit():
	
	return render_template('investorSubmitted.html', title='Submitted')


if __name__ == '__main__':
	app.run(debug=True)