#!/usr/bin/env python3
import os
import json
import boto3
import random
import datetime
import openpyxl
from openpyxl.styles import Font
from flask import Flask, render_template, request, jsonify, session, redirect, make_response, flash
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
	
@app.route('/contactSubmitted')
def contactSubmitRedirect():
	return redirect('/contact')

def error():
	# check if the referrer is from the backend
	if request.referrer and request.referrer.startswith(request.host_url):
		return render_template('error.html')
	else:
		return redirect(url_for('index'))

@app.route('/error')
def error():
	is_generated_by_backend = request.args.get('generated_by_backend', False)
	if not is_generated_by_backend:
		return redirect('/')
	return render_template('error.html', generated_by_backend=True)


@app.route('/borrowSubmitted', methods=['POST'])
def loanSubmit():
	
	loanApplicationNumber = str(random.randint(1, 1000))
	folderForLoanApplication = 'LoanApplication' + loanApplicationNumber
	os.mkdir(folderForLoanApplication)
	
	# !#$ refers to a blank
	
	loanData = {}
	loanData['Loan Purpose'] = request.form.getlist('loanPurpose')
	loanData['Loan Purpose (other)'] = request.form.get('otherLoanText', '!#$')
	loanData['Loan Total'] = request.form.get('loanTotal')
	loanData['Trance Amount'] = request.form.get('trancheAmt')
	loanData['Number of Tranches'] = request.form.get('numTranches')
	loanData['Collateral'] = request.form.getlist('collateralInfo')
	loanData['Collateral (other)'] = request.form.get('otherCollateralText', '!#$')
	loanData['Collateral Specifications'] = request.form.get('collateralSpec')
	loanData['Collateral Value'] = request.form.get('collateralValue')
	loanData['Escrow Agent'] = request.form.get('escrowAgent')
	loanData['Vault Info'] = request.form.get('vaultInfo')
	loanData['Security Received'] = request.form.getlist('securityReceivedCheckbox')
	loanData['Security Guaranteed'] = request.form.getlist('securityGuaranteedCheckbox')
	loanData['Security Received Date'] = request.form.get('secRecDate')
	loanData['Origination Fee (points)'] = request.form.get('orgFeePoints')
	loanData['Origination Fee (USD)'] = request.form.get('orgFeeUSD')
	loanData['Agree Origination Fee'] = request.form.get('agreeOrgFee')
	loanData['Interest Rate'] = request.form.get('interestRate')
	loanData['APR'] = request.form.get('apr')
	loanData['Agree APR'] = request.form.get('agreeAPR')
	# loanData['Interest'] = request.form.get('interestDropdown') uncomment when we unlock interestDropdown
	loanData['Interest'] = 'N/A'
	loanData['Agree Interest'] = request.form.get('agreeInterestOnly')
	# loanData['Interest Payment'] = request.form.get('interestPaymentDropdown') uncomment when we unlock interestPaymentDropdown
	loanData['Interest Payment'] = 'On-Maturity'
	loanData['Agree Interest Due'] = request.form.get('agreeInterestDue')
	loanData['Loan Term'] = request.form.get('loanTerm')
	loanData['Agree Loan Term'] = request.form.get('agreeLoanTerm')
	loanData['Loan Proceeds'] = request.form.get('loanProceeds')
	loanData['Agree Loan Proceeds'] = request.form.get('agreeLoanProceeds')
	loanData['Bank Fees'] = request.form.get('bankFees')
	loanData['Agree Bank Fees'] = request.form.get('agreeBankFees')
	loanData['Disbursed Total'] = request.form.get('disbursedTotal')
	loanData['Agree Disbursed Total'] = request.form.get('agreeDisbursedTotal')
	loanData['Borrower is an'] = request.form.get('borrowerDropdown')
	loanData['Entity Name'] = request.form.get('entityName', '!#$')
	loanData['Entity Country'] = request.form.get('entityCountry', '!#$')
	loanData['Entity Street Address'] = request.form.get('entityStreetAddress', '!#$')
	loanData['Entity City'] = request.form.get('entityCity', '!#$')
	loanData['Entity State'] = request.form.get('entityState', '!#$')
	loanData['Entity Zip'] = request.form.get('entityZip', '!#$')
	loanData['Entity Website'] = request.form.get('entityWebsite', '!#$')
	loanData['Beneficiary Name'] = request.form.get('beneficiaryName')
	loanData['Bank Name'] = request.form.get('bankName')
	loanData['Bank Address'] = request.form.get('bankAddress')
	loanData['Bank City'] = request.form.get('bankCity')
	loanData['Bank State'] = request.form.get('bankState')
	loanData['Bank Account Type'] = request.form.get('bankAccountTypeDropdown')
	loanData['Bank Account Type (other)'] = request.form.get('bankAccountOther', '!#$')
	loanData['IBAN'] = request.form.get('iban')
	loanData['SWIFT'] = request.form.get('swift')
	loanData['ABA Number'] = request.form.get('abaNumber')
	loanData['Memo'] = request.form.get('memo')
	
	entityName = loanData['Entity Name'].replace(' ', '')
	#entityName = loanData['Entity Name']
	
	if (request.form.get('borrowerDropdown') == 'Entity' and entityName != '!#$'):
		
		folderForEntityFilesName = loanData['Entity Name'] + 'Files'
		folderForEntityFiles = os.path.join(folderForLoanApplication, folderForEntityFilesName)
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
	
	repeatedIndividualLoanData = {}
	for i in range(1, 9):
		repeatedIndividualLoanData[f'Individual {i} Personal Guarantor'] = request.form.get(f'individualPersonalGuarantorDropdown{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Citizen'] = request.form.get(f'individualCitizenDropdown{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} South Dakota Resident'] = request.form.get(f'individualSDResidentDropdown{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} First Name'] = request.form.get(f'individualFirstName{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Middle Name'] = request.form.get(f'individualMiddleName{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Last Name'] = request.form.get(f'individualLastName{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Home Address'] = request.form.get(f'individualHomeBankAddress{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Address Line Two'] = request.form.get(f'individualAddressLineTwo{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Home City'] = request.form.get(f'individualHomeCity{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Home State'] = request.form.get(f'individualHomeState{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Home Zip'] = request.form.get(f'individualHomeZip{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Home Country'] = request.form.get(f'individualhomeCountry{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Own or Rent'] = request.form.get(f'individualOwnRentDropdown{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Monthly Mortgage/Rent'] = request.form.get(f'individualMonthlyRent{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Passport Number'] = request.form.get(f'individualPassportNumber{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} SSN'] = request.form.get(f'individualSsn{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Date of Birth'] = request.form.get(f'individualDob{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Email'] = request.form.get(f'individualEmail{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Phone Number'] = request.form.get(f'individualPhone{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} FICO/NOSIS Number'] = request.form.get(f'individualFico{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Income'] = request.form.get(f'individualIncome{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Politically Exposed Person'] = request.form.get(f'individualPep{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Crime'] = request.form.get(f'individualCrime{i}', '!#$')
		repeatedIndividualLoanData[f'Individual {i} Declare'] = request.form.get(f'individualDeclareCheckbox{i}', '!#$')
		
	repeatedUboLoanData = {}
	for i in range(1, 9):
		repeatedUboLoanData[f'Ubo {i} Personal Guarantor'] = request.form.get(f'uboPersonalGuarantorDropdown{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Citizen'] = request.form.get(f'uboCitizenDropdown{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} South Dakota Resident'] = request.form.get(f'uboSDResidentDropdown{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} First Name'] = request.form.get(f'uboFirstName{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Middle Name'] = request.form.get(f'uboMiddleName{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Last Name'] = request.form.get(f'uboLastName{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Home Address'] = request.form.get(f'uboHomeBankAddress{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Address Line Two'] = request.form.get(f'uboAddressLineTwo{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Home City'] = request.form.get(f'uboHomeCity{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Home State'] = request.form.get(f'uboHomeState{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Home Zip'] = request.form.get(f'uboHomeZip{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Home Country'] = request.form.get(f'ubohomeCountry{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Own or Rent'] = request.form.get(f'uboOwnRentDropdown{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Monthly Mortgage/Rent'] = request.form.get(f'uboMonthlyRent{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Passport Number'] = request.form.get(f'uboPassportNumber{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} SSN'] = request.form.get(f'uboSsn{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Date of Birth'] = request.form.get(f'uboDob{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Email'] = request.form.get(f'uboEmail{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Phone Number'] = request.form.get(f'uboPhone{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} FICO/NOSIS Number'] = request.form.get(f'uboFico{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Income'] = request.form.get(f'uboIncome{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Politically Exposed Person'] = request.form.get(f'uboPep{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Crime'] = request.form.get(f'uboCrime{i}', '!#$')
		repeatedUboLoanData[f'Ubo {i} Declare'] = request.form.get(f'uboDeclareCheckbox{i}', '!#$')
		
	repeatedDirectorLoanData = {}
	for i in range(1, 9):
		repeatedDirectorLoanData[f'Director {i} Personal Guarantor'] = request.form.get(f'directorPersonalGuarantorDropdown{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Citizen'] = request.form.get(f'directorCitizenDropdown{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} South Dakota Resident'] = request.form.get(f'directorSDResidentDropdown{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} First Name'] = request.form.get(f'directorFirstName{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Middle Name'] = request.form.get(f'directorMiddleName{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Last Name'] = request.form.get(f'directorLastName{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Home Address'] = request.form.get(f'directorHomeBankAddress{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Address Line Two'] = request.form.get(f'directorAddressLineTwo{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Home City'] = request.form.get(f'directorHomeCity{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Home State'] = request.form.get(f'directorHomeState{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Home Zip'] = request.form.get(f'directorHomeZip{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Home Country'] = request.form.get(f'directorhomeCountry{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Own or Rent'] = request.form.get(f'directorOwnRentDropdown{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Monthly Mortgage/Rent'] = request.form.get(f'directorMonthlyRent{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Passport Number'] = request.form.get(f'directorPassportNumber{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} SSN'] = request.form.get(f'directorSsn{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Date of Birth'] = request.form.get(f'directorDob{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Email'] = request.form.get(f'directorEmail{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Phone Number'] = request.form.get(f'directorPhone{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} FICO/NOSIS Number'] = request.form.get(f'directorFico{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Income'] = request.form.get(f'directorIncome{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Politically Exposed Person'] = request.form.get(f'directorPep{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Crime'] = request.form.get(f'directorCrime{i}', '!#$')
		repeatedDirectorLoanData[f'Director {i} Declare'] = request.form.get(f'directorDeclareCheckbox{i}', '!#$')
		
		
	loanData = {**loanData, **repeatedIndividualLoanData, **repeatedUboLoanData, **repeatedDirectorLoanData}
#	cleanedData = {k: v for k, v in loanData.items() if v != '!#$'}
	cleanedData = {k: v for k, v in loanData.items() if v not in ('!#$', '')}
	jsonName = 'LoanApplication' + loanApplicationNumber + '.json' 
	with open(f'{folderForLoanApplication}/{jsonName}', 'w') as f:
		json.dump(cleanedData, f)

	workbook = openpyxl.Workbook()
	worksheet = workbook.active
	columnHeaders = ['Question', 'Value']
	worksheet.append(columnHeaders)
	columnHeadersFont = Font(bold=True)
	for cell in worksheet[1]:
		cell.font = columnHeadersFont
		
	for key, value in cleanedData.items():
		if isinstance(value, list):
			value_str = ', '.join(value)
			worksheet.append([key, value_str])
		else:
			worksheet.append([key, value])
			
	workbookName = 'LoanApplication' + loanApplicationNumber + '.xlsx' 
	workbook.save(f'{folderForLoanApplication}/{workbookName}')
		
	for i in range(1, 9):
		if (request.form.get('borrowerDropdown') == 'Individual' and repeatedIndividualLoanData[f'Individual {i} First Name'] != '!#$'):		
			PassportFile = f'individualPassportFile{i}'
			DNIFrontFile = f'individualDniFrontFile{i}'
			DNIReverseFile = f'individualDniReverseFile{i}'
			BillAddressProofFile = f'individualBillAddressProofFile{i}'
			CreditCheckFile = f'individualCreditCheckFile{i}'
			WorldCheckFile = f'individualWorldCheckFile{i}'
			OFACFile = f'individualOfacFile{i}'
			
			if (repeatedIndividualLoanData[f'Individual {i} First Name'] != '!#$'):
				individualFirstName = request.form.get(f'individualFirstName{i}', '!#$').replace(' ', '')
				individualLastName = request.form.get(f'individualLastName{i}', '!#$').replace(' ', '')
				folderForIndividualFilesName = individualLastName + individualFirstName + 'Files'
				folderForIndividualFiles = os.path.join(folderForLoanApplication, folderForIndividualFilesName)
				os.mkdir(folderForIndividualFiles)
				
				for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
					file = request.files[fileType]
					fileName = secure_filename(file.filename)
					fileNameExt = os.path.splitext(fileName)[1]
					newFileName = (repeatedIndividualLoanData[f'Individual {i} Last Name'] + repeatedIndividualLoanData[f'Individual {i} First Name'] + fileType + fileNameExt).replace('individual', '')
					newFileName = newFileName.replace(f'{i}', '')
					newFilePath = os.path.join(folderForIndividualFiles, newFileName)
					file.save(newFilePath)
					
			bankAccountFile = request.files['bankAccountFile']
			bankAccountFileName = secure_filename(bankAccountFile.filename)
			bankAccountFileNameExt = os.path.splitext(bankAccountFileName)[1]
			newBankAccountFileName = 'LoanApplication' + loanApplicationNumber + 'BankAccountFile' + bankAccountFileNameExt
			newBankAccountFilePath = os.path.join(folderForIndividualFiles, newBankAccountFileName)
			bankAccountFile.save(newBankAccountFilePath)
		
	for i in range(1, 9):
		if (request.form.get('borrowerDropdown') == 'Entity' and repeatedUboLoanData[f'Ubo {i} First Name'] != '!#$'):
			PassportFile = f'uboPassportFile{i}'
			DNIFrontFile = f'uboDniFrontFile{i}'
			DNIReverseFile = f'uboDniReverseFile{i}'
			BillAddressProofFile = f'uboBillAddressProofFile{i}'
			CreditCheckFile = f'uboCreditCheckFile{i}'
			WorldCheckFile = f'uboWorldCheckFile{i}'
			OFACFile = f'uboOfacFile{i}'
			
			if (repeatedUboLoanData[f'Ubo {i} First Name'] != '!#$'):
				uboFirstName = request.form.get(f'uboFirstName{i}', '!#$').replace(' ', '')
				uboLastName = request.form.get(f'uboLastName{i}', '!#$').replace(' ', '')
				folderForUboFilesName = uboLastName + uboFirstName + 'Files'
				folderForUboFiles = os.path.join(folderForLoanApplication, folderForUboFilesName)
				os.mkdir(folderForUboFiles)
				
				for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
					file = request.files[fileType]
					fileName = secure_filename(file.filename)
					fileNameExt = os.path.splitext(fileName)[1]
					newFileName = (repeatedUboLoanData[f'Ubo {i} Last Name'] + repeatedUboLoanData[f'Ubo {i} First Name'] + fileType + fileNameExt).replace('ubo', '')
					newFileName = newFileName.replace(f'{i}', '')
					newFilePath = os.path.join(folderForUboFiles, newFileName)
					file.save(newFilePath)
					
	for i in range(1, 9):
		if (request.form.get('borrowerDropdown') == 'Entity' and repeatedDirectorLoanData[f'Director {i} First Name'] != '!#$'):
			PassportFile = f'directorPassportFile{i}'
			DNIFrontFile = f'directorDniFrontFile{i}'
			DNIReverseFile = f'directorDniReverseFile{i}'
			BillAddressProofFile = f'directorBillAddressProofFile{i}'
			CreditCheckFile = f'directorCreditCheckFile{i}'
			WorldCheckFile = f'directorWorldCheckFile{i}'
			OFACFile = f'directorOfacFile{i}'
			
			if (repeatedDirectorLoanData[f'Director {i} First Name'] != '!#$'):
				directorFirstName = request.form.get(f'directorFirstName{i}', '!#$').replace(' ', '')
				directorLastName = request.form.get(f'directorLastName{i}', '!#$').replace(' ', '')
				folderForDirectorFilesName = directorLastName + directorFirstName + 'Files'
				folderForDirectorFiles = os.path.join(folderForLoanApplication, folderForDirectorFilesName)
				os.mkdir(folderForDirectorFiles)
				
				for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
					file = request.files[fileType]
					fileName = secure_filename(file.filename)
					fileNameExt = os.path.splitext(fileName)[1]
					newFileName = (repeatedDirectorLoanData[f'Director {i} Last Name'] + repeatedDirectorLoanData[f'Director {i} First Name'] + fileType + fileNameExt).replace('director', '')
					newFileName = newFileName.replace(f'{i}', '')
					newFilePath = os.path.join(folderForDirectorFiles, newFileName)
					file.save(newFilePath)
					
	if (request.form.get('borrowerDropdown') == 'Entity'):
		bankAccountFile = request.files['bankAccountFile']
		bankAccountFileName = secure_filename(bankAccountFile.filename)
		bankAccountFileNameExt = os.path.splitext(bankAccountFileName)[1]
		newBankAccountFileName = entityName + 'BankAccountFile' + bankAccountFileNameExt
		newBankAccountFilePath = os.path.join(folderForEntityFiles, newBankAccountFileName)
		bankAccountFile.save(newBankAccountFilePath)
		
		
		
		

		
		
		
	# Upload cleanedData.json to S3
	#s3 = boto3.resource('s3')
	# make two buckets, one for borrowers, one for investors
	bucket_name = 'Loan-Bucket'
	object_key = 'loanData.json'
	#s3.Object(bucket_name, object_key).put(Body=open('loanData.json', 'rb'))
	
	return render_template('borrowSubmitted.html', title='Submitted')


@app.route('/investorSubmitted', methods=['POST'])
def investorSubmit():
	
	# !#$ refers to a blank
	duplicateUboDirectorNameForInvestor = False
	investorUboNameList = []
	investorDirectorNameList = []
	
	investorData = {}
	investorData['Investment Total'] = request.form.get('investmentTotal')
	investorData['Trance Amount'] = request.form.get('trancheAmt')
	investorData['Number of Tranches'] = request.form.get('numTranches')
	investorData['Borrower is an'] = request.form.get('investorDropdown')
	investorData['Entity Name'] = (request.form.get('entityName', '!#$')).replace(' ', '')
	investorData['Entity Country'] = request.form.get('entityCountry', '!#$')
	investorData['Entity Street Address'] = request.form.get('entityStreetAddress', '!#$')
	investorData['Entity City'] = request.form.get('entityCity', '!#$')
	investorData['Entity State'] = request.form.get('entityState', '!#$')
	investorData['Entity Zip'] = request.form.get('entityZip', '!#$')
	investorData['Entity Website'] = request.form.get('entityWebsite', '!#$')
	investorData['Beneficiary Name'] = request.form.get('beneficiaryName')
	investorData['Bank Name'] = request.form.get('bankName')
	investorData['Bank Address'] = request.form.get('bankAddress')
	investorData['Bank City'] = request.form.get('bankCity')
	investorData['Bank State'] = request.form.get('bankState')
	investorData['Bank Account Type'] = request.form.get('bankAccountTypeDropdown')
	investorData['Bank Account Type (other)'] = request.form.get('bankAccountOther', '!#$')
	investorData['IBAN'] = request.form.get('iban')
	investorData['SWIFT'] = request.form.get('swift')
	investorData['ABA Number'] = request.form.get('abaNumber')
	investorData['Memo'] = request.form.get('memo')
	
	#entityName = investorData['Entity Name'].replace(' ', '')
	entityName = investorData['Entity Name']
	
	repeatedIndividualInvestorData = {}
	for i in range(1, 9):
		repeatedIndividualInvestorData[f'Individual {i} Citizen'] = request.form.get(f'individualCitizenDropdown{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} South Dakota Resident'] = request.form.get(f'individualSDResidentDropdown{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} First Name'] = request.form.get(f'individualFirstName{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Middle Name'] = request.form.get(f'individualMiddleName{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Last Name'] = request.form.get(f'individualLastName{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Home Address'] = request.form.get(f'individualHomeBankAddress{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Address Line Two'] = request.form.get(f'individualAddressLineTwo{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Home City'] = request.form.get(f'individualHomeCity{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Home State'] = request.form.get(f'individualHomeState{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Home Zip'] = request.form.get(f'individualHomeZip{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Home Country'] = request.form.get(f'individualhomeCountry{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Passport Number'] = request.form.get(f'individualPassportNumber{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} SSN'] = request.form.get(f'individualSsn{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Date of Birth'] = request.form.get(f'individualDob{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Email'] = request.form.get(f'individualEmail{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Phone Number'] = request.form.get(f'individualPhone{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} FICO/NOSIS Number'] = request.form.get(f'individualFico{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Politically Exposed Person'] = request.form.get(f'individualPep{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Crime'] = request.form.get(f'individualCrime{i}', '!#$')
		repeatedIndividualInvestorData[f'Individual {i} Declare'] = request.form.get(f'individualDeclareCheckbox{i}', '!#$')
				
	repeatedUboInvestorData = {}
	for i in range(1, 9):
		repeatedUboInvestorData[f'Ubo {i} Citizen'] = request.form.get(f'uboCitizenDropdown{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} South Dakota Resident'] = request.form.get(f'uboSDResidentDropdown{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} First Name'] = request.form.get(f'uboFirstName{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Middle Name'] = request.form.get(f'uboMiddleName{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Last Name'] = request.form.get(f'uboLastName{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Home Address'] = request.form.get(f'uboHomeBankAddress{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Address Line Two'] = request.form.get(f'uboAddressLineTwo{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Home City'] = request.form.get(f'uboHomeCity{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Home State'] = request.form.get(f'uboHomeState{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Home Zip'] = request.form.get(f'uboHomeZip{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Home Country'] = request.form.get(f'ubohomeCountry{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Passport Number'] = request.form.get(f'uboPassportNumber{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} SSN'] = request.form.get(f'uboSsn{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Date of Birth'] = request.form.get(f'uboDob{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Email'] = request.form.get(f'uboEmail{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Phone Number'] = request.form.get(f'uboPhone{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} FICO/NOSIS Number'] = request.form.get(f'uboFico{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Politically Exposed Person'] = request.form.get(f'uboPep{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Crime'] = request.form.get(f'uboCrime{i}', '!#$')
		repeatedUboInvestorData[f'Ubo {i} Declare'] = request.form.get(f'uboDeclareCheckbox{i}', '!#$')
		
		investorUboNameList.append(repeatedUboInvestorData[f'Ubo {i} First Name'].strip() + repeatedUboInvestorData[f'Ubo {i} Last Name'].strip())
		
		
	repeatedDirectorInvestorData = {}
	for i in range(1, 9):
		repeatedDirectorInvestorData[f'Director {i} Citizen'] = request.form.get(f'directorCitizenDropdown{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} South Dakota Resident'] = request.form.get(f'directorSDResidentDropdown{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} First Name'] = request.form.get(f'directorFirstName{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Middle Name'] = request.form.get(f'directorMiddleName{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Last Name'] = request.form.get(f'directorLastName{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Home Address'] = request.form.get(f'directorHomeBankAddress{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Address Line Two'] = request.form.get(f'directorAddressLineTwo{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Home City'] = request.form.get(f'directorHomeCity{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Home State'] = request.form.get(f'directorHomeState{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Home Zip'] = request.form.get(f'directorHomeZip{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Home Country'] = request.form.get(f'directorhomeCountry{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Passport Number'] = request.form.get(f'directorPassportNumber{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} SSN'] = request.form.get(f'directorSsn{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Date of Birth'] = request.form.get(f'directorDob{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Email'] = request.form.get(f'directorEmail{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Phone Number'] = request.form.get(f'directorPhone{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} FICO/NOSIS Number'] = request.form.get(f'directorFico{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Politically Exposed Person'] = request.form.get(f'directorPep{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Crime'] = request.form.get(f'directorCrime{i}', '!#$')
		repeatedDirectorInvestorData[f'Director {i} Declare'] = request.form.get(f'directorDeclareCheckbox{i}', '!#$')
		
		investorDirectorNameList.append(repeatedDirectorInvestorData[f'Director {i} First Name'].strip() + repeatedDirectorInvestorData[f'Director {i} Last Name'].strip())
	
	investorUboNameList = [name for name in investorUboNameList if name != '!#$!#$']
	investorDirectorNameList = [name for name in investorDirectorNameList if name != '!#$!#$']

	for name in investorUboNameList:
		if name in investorDirectorNameList:
			duplicateUboDirectorNameForInvestor = True
			return render_template('error.html')		
	
	if not duplicateUboDirectorNameForInvestor: 
	
		investorApplicationNumber = str(random.randint(1, 1000))
		folderForInvestmentApplication = 'InvestorApplication' + investorApplicationNumber
		os.mkdir(folderForInvestmentApplication)
	
		if (request.form.get('investorDropdown') == 'Entity' and entityName != '!#$'):
			
			folderForEntityFilesName = investorData['Entity Name'] + 'Files'
			folderForEntityFiles = os.path.join(folderForInvestmentApplication, folderForEntityFilesName)
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
			
		for i in range(1, 9):
			if (request.form.get('investorDropdown') == 'Individual' and repeatedIndividualInvestorData[f'Individual {i} First Name'] != '!#$'):		
				PassportFile = f'individualPassportFile{i}'
				DNIFrontFile = f'individualDniFrontFile{i}'
				DNIReverseFile = f'individualDniReverseFile{i}'
				BillAddressProofFile = f'individualBillAddressProofFile{i}'
				CreditCheckFile = f'individualCreditCheckFile{i}'
				WorldCheckFile = f'individualWorldCheckFile{i}'
				OFACFile = f'individualOfacFile{i}'
				
				if (repeatedIndividualInvestorData[f'Individual {i} First Name'] != '!#$'):	
					individualFirstName = request.form.get(f'individualFirstName{i}', '!#$').replace(' ', '')
					individualLastName = request.form.get(f'individualLastName{i}', '!#$').replace(' ', '')
					folderForIndividualFilesName = individualLastName + individualFirstName + 'Files'
					folderForIndividualFiles = os.path.join(folderForInvestmentApplication, folderForIndividualFilesName)
					os.mkdir(folderForIndividualFiles)
					
					for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
						file = request.files[fileType]
						fileName = secure_filename(file.filename)
						fileNameExt = os.path.splitext(fileName)[1]
						newFileName = (repeatedIndividualInvestorData[f'Individual {i} Last Name'] + repeatedIndividualInvestorData[f'Individual {i} First Name'] + fileType + fileNameExt).replace('individual', '')
						newFileName = newFileName.replace(f'{i}', '')
						newFilePath = os.path.join(folderForIndividualFiles, newFileName)
						file.save(newFilePath)
						
				bankAccountFile = request.files['bankAccountFile']
				bankAccountFileName = secure_filename(bankAccountFile.filename)
				bankAccountFileNameExt = os.path.splitext(bankAccountFileName)[1]
				newBankAccountFileName = individualLastName + individualFirstName + 'BankAccountFile' + bankAccountFileNameExt
				newBankAccountFilePath = os.path.join(folderForIndividualFiles, newBankAccountFileName)
				bankAccountFile.save(newBankAccountFilePath)
			
			
		for i in range(1, 9):
			if (request.form.get('investorDropdown') == 'Entity' and repeatedUboInvestorData[f'Ubo {i} First Name'] != '!#$'):
				PassportFile = f'uboPassportFile{i}'
				DNIFrontFile = f'uboDniFrontFile{i}'
				DNIReverseFile = f'uboDniReverseFile{i}'
				BillAddressProofFile = f'uboBillAddressProofFile{i}'
				CreditCheckFile = f'uboCreditCheckFile{i}'
				WorldCheckFile = f'uboWorldCheckFile{i}'
				OFACFile = f'uboOfacFile{i}'
				
				if (repeatedUboInvestorData[f'Ubo {i} First Name'] != '!#$'):
					uboFirstName = request.form.get(f'uboFirstName{i}', '!#$').replace(' ', '')
					uboLastName = request.form.get(f'uboLastName{i}', '!#$').replace(' ', '')
					folderForUboFilesName = uboLastName + uboFirstName + 'Files'
					folderForUboFiles = os.path.join(folderForInvestmentApplication, folderForUboFilesName)
					os.mkdir(folderForUboFiles)
					
					for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
						file = request.files[fileType]
						fileName = secure_filename(file.filename)
						fileNameExt = os.path.splitext(fileName)[1]
						newFileName = (repeatedUboInvestorData[f'Ubo {i} Last Name'] + repeatedUboInvestorData[f'Ubo {i} First Name'] + fileType + fileNameExt).replace('ubo', '')
						newFileName = newFileName.replace(f'{i}', '')
						newFilePath = os.path.join(folderForUboFiles, newFileName)
						file.save(newFilePath)
						
		for i in range(1, 9):
			if (request.form.get('investorDropdown') == 'Entity' and repeatedDirectorInvestorData[f'Director {i} First Name'] != '!#$'):
				PassportFile = f'directorPassportFile{i}'
				DNIFrontFile = f'directorDniFrontFile{i}'
				DNIReverseFile = f'directorDniReverseFile{i}'
				BillAddressProofFile = f'directorBillAddressProofFile{i}'
				CreditCheckFile = f'directorCreditCheckFile{i}'
				WorldCheckFile = f'directorWorldCheckFile{i}'
				OFACFile = f'directorOfacFile{i}'
				
				if (repeatedDirectorInvestorData[f'Director {i} First Name'] != '!#$'):
					directorFirstName = request.form.get(f'directorFirstName{i}', '!#$').replace(' ', '')
					directorLastName = request.form.get(f'directorLastName{i}', '!#$').replace(' ', '')
					folderForDirectorFilesName = directorLastName + directorFirstName + 'Files'
					folderForDirectorFiles = os.path.join(folderForInvestmentApplication, folderForDirectorFilesName)
					os.mkdir(folderForDirectorFiles)
					
					for fileType in [PassportFile, DNIFrontFile, DNIReverseFile, BillAddressProofFile, CreditCheckFile, WorldCheckFile, OFACFile]:
						file = request.files[fileType]
						fileName = secure_filename(file.filename)
						fileNameExt = os.path.splitext(fileName)[1]
						newFileName = (repeatedDirectorInvestorData[f'Director {i} Last Name'] + repeatedDirectorInvestorData[f'Director {i} First Name'] + fileType + fileNameExt).replace('director', '')
						newFileName = newFileName.replace(f'{i}', '')
						newFilePath = os.path.join(folderForDirectorFiles, newFileName)
						file.save(newFilePath)
	
		if (request.form.get('investorDropdown') == 'Entity'):
			bankAccountFile = request.files['bankAccountFile']
			bankAccountFileName = secure_filename(bankAccountFile.filename)
			bankAccountFileNameExt = os.path.splitext(bankAccountFileName)[1]
			newBankAccountFileName = entityName + 'BankAccountFile' + bankAccountFileNameExt
			newBankAccountFilePath = os.path.join(folderForEntityFiles, newBankAccountFileName)
			bankAccountFile.save(newBankAccountFilePath)
			
		investorData = {**investorData, **repeatedIndividualInvestorData, **repeatedUboInvestorData, **repeatedDirectorInvestorData}
		cleanedData = {k: v for k, v in investorData.items() if v not in ('!#$', '')}
		jsonName = 'InvestorApplication' + investorApplicationNumber + '.json' 
		with open(f'{folderForInvestmentApplication}/{jsonName}', 'w') as f:
			json.dump(cleanedData, f)
			
		workbook = openpyxl.Workbook()
		worksheet = workbook.active
		columnHeaders = ['Question', 'Value']
		worksheet.append(columnHeaders)
		columnHeadersFont = Font(bold=True)
		for cell in worksheet[1]:
			cell.font = columnHeadersFont
			
		for key, value in cleanedData.items():
			if isinstance(value, list):
				value_str = ', '.join(value)
				worksheet.append([key, value_str])
			else:
				worksheet.append([key, value])
				
		workbookName = 'InvestorApplication' + investorApplicationNumber + '.xlsx' 
		workbook.save(f'{folderForInvestmentApplication}/{workbookName}')
			
		# Upload cleanedData.json to S3
		#s3 = boto3.resource('s3')
		# make two buckets, one for borrowers, one for investors
		bucket_name = 'Investor-Bucket'
		object_key = 'investorData.json'
		#s3.Object(bucket_name, object_key).put(Body=open('loanData.json', 'rb'))
		
		return render_template('investorSubmitted.html', title='Submitted')
	





@app.route('/contactSubmitted', methods=['POST'])
def contactSubmit():
	
	fullName = request.form['fullName']
	email = request.form['email']
	phoneNumber = request.form['phoneNumber']
	userContactType = request.form['userContactType']
	message = request.form['message']
	
	
	'''
	
	# create a WorkMail client
	client = boto3.client('workmail')
	
	# create an email message
	message = {
		'Subject': {
			'Data': f'New Contact Form Submission From {fullName}'
		},
		'Body': {
			'Text': {
				'Data': f'Name: {fullName}\nEmail: {email}\nMessage: {message}'
			}
		},
		'FromEmailAddress': 'your-email@your-domain.com',
		'Destination': {
			'ToAddresses': ['recipient-email@recipient-domain.com']
		}
	}
	

	# send the email message
	response = client.send_email(
		FromEmailAddress=message['FromEmailAddress'],
		Destination=message['Destination'],
		Content={
			'Simple': {
				'Subject': {
					'Data': message['Subject']['Data']
				},
				'Body': {
					'Text': {
						'Data': message['Body']['Text']['Data']
					}
				}
			}
		}
	)
	
	print(Content)
	
	'''
	
	return render_template('contactSubmitted.html', title='Submitted')


if __name__ == '__main__':
	app.run(debug=True)