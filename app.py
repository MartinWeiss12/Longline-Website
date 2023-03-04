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
	
	loanApplicationNumber = str(random.randint(1, 100))
	folderForApplication = 'LoanApplication' + loanApplicationNumber
	os.mkdir(folderForApplication)
	
	# !#$ refers to a blank
	
	data = {}
	data['Loan Purpose'] = request.form.getlist('loanPurpose')
	data['Loan Purpose (other)'] = request.form.get('otherLoanText', '!#$')
	data['Loan Total'] = request.form.get('loanTotal')
	data['Trance Amount'] = request.form.get('trancheAmt')
	data['Number of Tranches'] = request.form.get('numTranches')
	data['Collateral'] = request.form.getlist('collateralInfo')
	data['Collateral (other)'] = request.form.get('otherCollateralText', '!#$')
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
	data['Agree Interest Due'] = request.form.get('agreeInterestDue')
	data['Loan Term'] = request.form.get('loanTerm')
	data['Agree Loan Term'] = request.form.get('agreeLoanTerm')
	data['Loan Proceeds'] = request.form.get('loanProceeds')
	data['Agree Loan Proceeds'] = request.form.get('agreeLoanProceeds')
	data['Bank Fees'] = request.form.get('bankFees')
	data['Agree Bank Fees'] = request.form.get('agreeBankFees')
	data['Disbursed Total'] = request.form.get('disbursedTotal')
	data['Agree Disbursed Total'] = request.form.get('agreeDisbursedTotal')
	data['Borrower is an'] = request.form.get('borrowerDropdown')
	data['Entity Name'] = request.form.get('entityName', '!#$')
	data['Entity Country'] = request.form.get('entityCountry')
	data['Entity Street Address'] = request.form.get('entityStreetAddress', '!#$')
	data['Entity City'] = request.form.get('entityCity', '!#$')
	data['Entity State'] = request.form.get('entityState', '!#$')
	data['Entity Zip'] = request.form.get('entityZip', '!#$')
	data['Entity Website'] = request.form.get('entityWebsite', '!#$')
	data['Beneficiary Name'] = request.form.get('beneficiaryName')
	data['Bank Name'] = request.form.get('bankName')
	data['Bank Address'] = request.form.get('bankAddress')
	data['Bank City'] = request.form.get('bankCity')
	data['Bank State'] = request.form.get('bankState')
	data['Bank Account Type'] = request.form.get('bankAccountTypeDropdown')
	data['Bank Account Type (other)'] = request.form.get('bankAccountOther', '!#$')
	data['IBAN'] = request.form.get('iban')
	data['SWIFT'] = request.form.get('swift')
	data['ABA Number'] = request.form.get('abaNumber')
	data['Memo'] = request.form.get('memo')
	
	entityName = data['Entity Name']#.str.replace(' ', '')
	entityName = data['Entity Name']
	
	if (request.form.get('borrowerDropdown') == 'Entity' and entityName != '!#$'):
		
		folderForEntityFilesName = data['Entity Name'] + 'Files'
		folderForEntityFiles = os.path.join(folderForApplication, folderForEntityFilesName)
		os.mkdir(folderForEntityFiles)
		
		# Entity Articles of Organization File 
		entityArticlesFile = request.files['entityArticlesFile']
		entityArticlesFileName = secure_filename(entityArticlesFile.filename)
		entityArticlesFileNameExt = os.path.splitext(entityArticlesFileName)[1]
		newEntityArticlesFileName = (entityName + 'EntityArticlesFile' + entityArticlesFileNameExt)
		newEntityArticlesFilePath = os.path.join(folderForEntityFiles, newEntityArticlesFileName)
		entityArticlesFile.save(newEntityArticlesFilePath)
		
		# Entity Certificate of Formation File 
		entityCertificateFile = request.files['entityCertificateFile']
		entityCertificateFileName = secure_filename(entityCertificateFile.filename)
		entityCertificateFileExt = os.path.splitext(entityCertificateFileName)[1]
		newEntityCertificateFileName = (entityName + 'EntityCertificateFile' + entityCertificateFileExt)
		newEntityCertificateFilePath = os.path.join(folderForEntityFiles, newEntityCertificateFileName)
		entityCertificateFile.save(newEntityCertificateFilePath)
		
		# Entity EIN File
		entityEinFile = request.files['entityEinFile']
		entityEinFileName = secure_filename(entityEinFile.filename)
		entityEinFileExt = os.path.splitext(entityEinFileName)[1]
		newEntityEinFileFileName = (entityName + 'EntityEinFile' + entityEinFileExt)
		newEntityEinFileFilePath = os.path.join(folderForEntityFiles, newEntityEinFileFileName)
		entityEinFile.save(newEntityEinFileFilePath)
		
		# Entity Other File
		entityOtherFile = request.files['entityOtherFile']
		entityOtherFileName = secure_filename(entityOtherFile.filename)
		entityOtherFileExt = os.path.splitext(entityOtherFileName)[1]
		newEntityOtherFileName = (entityName + 'EntityEinFile' + entityOtherFileExt)
		newEntityOtherFilePath = os.path.join(folderForEntityFiles, newEntityOtherFileName)
		entityOtherFile.save(newEntityOtherFilePath)
	
	individualFirstName = request.form.get('individualFirstName1', '!#$').replace(' ', '')
	individualLastName = request.form.get('individualLastName1', '!#$').replace(' ', '')
	
	uboFirstName = request.form.get('uboFirstName1', '!#$').replace(' ', '')
	uboLastName = request.form.get('uboLastName1', '!#$').replace(' ', '')
	
	directorFirstName = request.form.get('directorFirstName1', '!#$').replace(' ', '')
	directorLastName = request.form.get('directorLastName1', '!#$').replace(' ', '')
	
	repeatedIndividualData = {}
	for i in range(1, 9):
		repeatedIndividualData[f'Individual {i} Personal Guarantor'] = request.form.get(f'individualPersonalGuarantorDropdown{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Citizen'] = request.form.get(f'individualCitizenDropdown{i}', '!#$')
		repeatedIndividualData[f'Individual {i} South Dakota Resident'] = request.form.get(f'individualSDResidentDropdown{i}', '!#$')
		repeatedIndividualData[f'Individual {i} First Name'] = request.form.get(f'individualFirstName{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Middle Name'] = request.form.get(f'individualMiddleName{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Last Name'] = request.form.get(f'individualLastName{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Home Address'] = request.form.get(f'individualHomeBankAddress{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Home Street Address'] = request.form.get(f'individualHomeStreetAddress{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Home City'] = request.form.get(f'individualHomeCity{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Home State'] = request.form.get(f'individualHomeState{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Home Zip'] = request.form.get(f'individualHomeZip{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Home Country'] = request.form.get(f'individualhomeCountry{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Own or Rent'] = request.form.get(f'individualOwnRentDropdown{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Monthly Mortgage/Rent'] = request.form.get(f'individualMonthlyRent{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Passport Number'] = request.form.get(f'individualPassportNumber{i}', '!#$')
		repeatedIndividualData[f'Individual {i} SSN'] = request.form.get(f'individualSsn{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Date of Birth'] = request.form.get(f'individualDob{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Email'] = request.form.get(f'individualEmail{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Phone Number'] = request.form.get(f'individualPhone{i}', '!#$')
		repeatedIndividualData[f'Individual {i} FICO/NOSIS Number'] = request.form.get(f'individualFico{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Income'] = request.form.get(f'individualIncome{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Politically Exposed Person'] = request.form.get(f'individualPep{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Crime'] = request.form.get(f'individualCrime{i}', '!#$')
		repeatedIndividualData[f'Individual {i} Declare'] = request.form.get(f'individualDeclareCheckbox{i}', '!#$')
		
	repeatedUboData = {}
	for i in range(1, 9):
		repeatedUboData[f'Ubo {i} Personal Guarantor'] = request.form.get(f'uboPersonalGuarantorDropdown{i}', '!#$')
		repeatedUboData[f'Ubo {i} Citizen'] = request.form.get(f'uboCitizenDropdown{i}', '!#$')
		repeatedUboData[f'Ubo {i} South Dakota Resident'] = request.form.get(f'uboSDResidentDropdown{i}', '!#$')
		repeatedUboData[f'Ubo {i} First Name'] = request.form.get(f'uboFirstName{i}', '!#$')
		repeatedUboData[f'Ubo {i} Middle Name'] = request.form.get(f'uboMiddleName{i}', '!#$')
		repeatedUboData[f'Ubo {i} Last Name'] = request.form.get(f'uboLastName{i}', '!#$')
		repeatedUboData[f'Ubo {i} Home Address'] = request.form.get(f'uboHomeBankAddress{i}', '!#$')
		repeatedUboData[f'Ubo {i} Home Street Address'] = request.form.get(f'uboHomeStreetAddress{i}', '!#$')
		repeatedUboData[f'Ubo {i} Home City'] = request.form.get(f'uboHomeCity{i}', '!#$')
		repeatedUboData[f'Ubo {i} Home State'] = request.form.get(f'uboHomeState{i}', '!#$')
		repeatedUboData[f'Ubo {i} Home Zip'] = request.form.get(f'uboHomeZip{i}', '!#$')
		repeatedUboData[f'Ubo {i} Home Country'] = request.form.get(f'ubohomeCountry{i}', '!#$')
		repeatedUboData[f'Ubo {i} Own or Rent'] = request.form.get(f'uboOwnRentDropdown{i}', '!#$')
		repeatedUboData[f'Ubo {i} Monthly Mortgage/Rent'] = request.form.get(f'uboMonthlyRent{i}', '!#$')
		repeatedUboData[f'Ubo {i} Passport Number'] = request.form.get(f'uboPassportNumber{i}', '!#$')
		repeatedUboData[f'Ubo {i} SSN'] = request.form.get(f'uboSsn{i}', '!#$')
		repeatedUboData[f'Ubo {i} Date of Birth'] = request.form.get(f'uboDob{i}', '!#$')
		repeatedUboData[f'Ubo {i} Email'] = request.form.get(f'uboEmail{i}', '!#$')
		repeatedUboData[f'Ubo {i} Phone Number'] = request.form.get(f'uboPhone{i}', '!#$')
		repeatedUboData[f'Ubo {i} FICO/NOSIS Number'] = request.form.get(f'uboFico{i}', '!#$')
		repeatedUboData[f'Ubo {i} Income'] = request.form.get(f'uboIncome{i}', '!#$')
		repeatedUboData[f'Ubo {i} Politically Exposed Person'] = request.form.get(f'uboPep{i}', '!#$')
		repeatedUboData[f'Ubo {i} Crime'] = request.form.get(f'uboCrime{i}', '!#$')
		repeatedUboData[f'Ubo {i} Declare'] = request.form.get(f'uboDeclareCheckbox{i}', '!#$')
		
	repeatedDirectorData = {}
	for i in range(1, 9):
		repeatedDirectorData[f'Director {i} Personal Guarantor'] = request.form.get(f'directorPersonalGuarantorDropdown{i}', '!#$')
		repeatedDirectorData[f'Director {i} Citizen'] = request.form.get(f'directorCitizenDropdown{i}', '!#$')
		repeatedDirectorData[f'Director {i} South Dakota Resident'] = request.form.get(f'directorSDResidentDropdown{i}', '!#$')
		repeatedDirectorData[f'Director {i} First Name'] = request.form.get(f'directorFirstName{i}', '!#$')
		repeatedDirectorData[f'Director {i} Middle Name'] = request.form.get(f'directorMiddleName{i}', '!#$')
		repeatedDirectorData[f'Director {i} Last Name'] = request.form.get(f'directorLastName{i}', '!#$')
		repeatedDirectorData[f'Director {i} Home Address'] = request.form.get(f'directorHomeBankAddress{i}', '!#$')
		repeatedDirectorData[f'Director {i} Home Street Address'] = request.form.get(f'directorHomeStreetAddress{i}', '!#$')
		repeatedDirectorData[f'Director {i} Home City'] = request.form.get(f'directorHomeCity{i}', '!#$')
		repeatedDirectorData[f'Director {i} Home State'] = request.form.get(f'directorHomeState{i}', '!#$')
		repeatedDirectorData[f'Director {i} Home Zip'] = request.form.get(f'directorHomeZip{i}', '!#$')
		repeatedDirectorData[f'Director {i} Home Country'] = request.form.get(f'directorhomeCountry{i}', '!#$')
		repeatedDirectorData[f'Director {i} Own or Rent'] = request.form.get(f'directorOwnRentDropdown{i}', '!#$')
		repeatedDirectorData[f'Director {i} Monthly Mortgage/Rent'] = request.form.get(f'directorMonthlyRent{i}', '!#$')
		repeatedDirectorData[f'Director {i} Passport Number'] = request.form.get(f'directorPassportNumber{i}', '!#$')
		repeatedDirectorData[f'Director {i} SSN'] = request.form.get(f'directorSsn{i}', '!#$')
		repeatedDirectorData[f'Director {i} Date of Birth'] = request.form.get(f'directorDob{i}', '!#$')
		repeatedDirectorData[f'Director {i} Email'] = request.form.get(f'directorEmail{i}', '!#$')
		repeatedDirectorData[f'Director {i} Phone Number'] = request.form.get(f'directorPhone{i}', '!#$')
		repeatedDirectorData[f'Director {i} FICO/NOSIS Number'] = request.form.get(f'directorFico{i}', '!#$')
		repeatedDirectorData[f'Director {i} Income'] = request.form.get(f'directorIncome{i}', '!#$')
		repeatedDirectorData[f'Director {i} Politically Exposed Person'] = request.form.get(f'directorPep{i}', '!#$')
		repeatedDirectorData[f'Director {i} Crime'] = request.form.get(f'directorCrime{i}', '!#$')
		repeatedDirectorData[f'Director {i} Declare'] = request.form.get(f'directorDeclareCheckbox{i}', '!#$')
			
	data = {**data, **repeatedIndividualData, **repeatedUboData, **repeatedDirectorData}
	
	cleanedData = {k: v for k, v in data.items() if v != '!#$'}
	#cleanedData = {k: v for k, v in data.items() if v not in ('!#$', '')} remove blanks too?
	jsonName = 'LoanApplication' + loanApplicationNumber + '.json' 
	with open(f'{folderForApplication}/{jsonName}', 'w') as f:
		json.dump(cleanedData, f)
	
	if (request.form.get('borrowerDropdown') == 'Individual' and individualFirstName != '!#$'):
		folderForIndividualFilesName = individualLastName + individualFirstName + 'Files'
		folderForIndividualFiles = os.path.join(folderForApplication, folderForIndividualFilesName)
		os.mkdir(folderForIndividualFiles)
		
		for i in range(1, 9):
			PassportFile = f'individualPassportFile{i}'
			DNIFrontFile = f'individualDniFrontFile{i}'
			DNIReverseFile = f'individualDniReverseFile{i}'
			BillAddressProofFile = f'individualBillAddressProofFile{i}'
			CreditCheckFile = f'individualCreditCheckFile{i}'
			WorldCheckFile = f'individualWorldCheckFile{i}'
			OFACFile = f'individualOfacFile{i}'
			
			if (repeatedIndividualData[f'Individual {i} First Name'] != '!#$'):
				for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
					file = request.files[fileType]
					fileName = secure_filename(file.filename)
					fileNameExt = os.path.splitext(fileName)[1]
					newFileName = (individualLastName + individualFirstName + fileType + fileNameExt).replace('individual', '')
					newFilePath = os.path.join(folderForIndividualFiles, newFileName)
					file.save(newFilePath)
		
		bankAccountFile = request.files['bankAccountFile']
		bankAccountFileName = secure_filename(bankAccountFile.filename)
		bankAccountFileNameExt = os.path.splitext(bankAccountFileName)[1]
		newBankAccountFileName = individualLastName + individualFirstName + 'bankAccountFile' + bankAccountFileNameExt
		newBankAccountFilePath = os.path.join(folderForIndividualFiles, newBankAccountFileName)
		bankAccountFile.save(newBankAccountFilePath)

	if (request.form.get('borrowerDropdown') == 'Entity' and entityName != '!#$'):
		folderForUboFilesName = uboLastName + uboFirstName + 'Files'
		folderForUboFiles = os.path.join(folderForApplication, folderForUboFilesName)
		os.mkdir(folderForUboFiles)
		
		for i in range(1, 9):
			PassportFile = f'uboPassportFile{i}'
			DNIFrontFile = f'uboDniFrontFile{i}'
			DNIReverseFile = f'uboDniReverseFile{i}'
			BillAddressProofFile = f'uboBillAddressProofFile{i}'
			CreditCheckFile = f'uboCreditCheckFile{i}'
			WorldCheckFile = f'uboWorldCheckFile{i}'
			OFACFile = f'uboOfacFile{i}'
			
			if (repeatedUboData[f'Ubo {i} First Name'] != '!#$'):
				for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
					file = request.files[fileType]
					fileName = secure_filename(file.filename)
					fileNameExt = os.path.splitext(fileName)[1]
					newFileName = (uboLastName + uboFirstName + fileType + fileNameExt).replace('ubo', '')
					newFilePath = os.path.join(folderForUboFiles, newFileName)
					file.save(newFilePath)
	
	if (request.form.get('borrowerDropdown') == 'Entity' and directorFirstName != '!#$'):
		folderForDirectorFilesName = directorLastName + directorFirstName + 'Files'
		folderForDirectorFiles = os.path.join(folderForApplication, folderForDirectorFilesName)
		os.mkdir(folderForDirectorFiles)
		
		for i in range(1, 9):
			PassportFile = f'directorPassportFile{i}'
			DNIFrontFile = f'directorDniFrontFile{i}'
			DNIReverseFile = f'directorDniReverseFile{i}'
			BillAddressProofFile = f'directorBillAddressProofFile{i}'
			CreditCheckFile = f'directorCreditCheckFile{i}'
			WorldCheckFile = f'directorWorldCheckFile{i}'
			OFACFile = f'directorOfacFile{i}'
			
			if (repeatedDirectorData[f'Director {i} First Name'] != '!#$'):
				for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
					file = request.files[fileType]
					fileName = secure_filename(file.filename)
					fileNameExt = os.path.splitext(fileName)[1]
					newFileName = (directorLastName + directorFirstName + fileType + fileNameExt).replace('director', '')
					newFilePath = os.path.join(folderForDirectorFiles, newFileName)
					file.save(newFilePath)
					
	if (request.form.get('borrowerDropdown') == 'Entity'):
		bankAccountFile = request.files['bankAccountFile']
		bankAccountFileName = secure_filename(bankAccountFile.filename)
		bankAccountFileNameExt = os.path.splitext(bankAccountFileName)[1]
		newBankAccountFileName = entityName + 'bankAccountFile' + bankAccountFileNameExt
		newBankAccountFilePath = os.path.join(folderForEntityFiles, newBankAccountFileName)
		bankAccountFile.save(newBankAccountFilePath)
					

	# Upload cleanedData.json to S3
	#s3 = boto3.resource('s3')
	# make two buckets, one for borrowers, one for investors
	bucket_name = 'your-bucket-name'
	object_key = 'data.json'
	#s3.Object(bucket_name, object_key).put(Body=open('cleanedData.json', 'rb'))
	
	return render_template('borrowSubmitted.html', title='Submitted')


@app.route('/investorSubmitted', methods=['POST'])
def investorSubmit():
	
	return render_template('investorSubmitted.html', title='Submitted')


if __name__ == '__main__':
	app.run(debug=True)