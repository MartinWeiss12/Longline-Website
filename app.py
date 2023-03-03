#!/usr/bin/env python3
import os
import json
import random
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
	
	loanPurpose = request.form.getlist('loanPurpose')
	otherLoanPurpose = request.form.get('otherLoanText', '#No Value')
	loanTotal = request.form.get('loanTotal')
	trancheAmt = request.form.get('trancheAmt')
	numTranches = request.form.get('numTranches')
	collateralInfo = request.form.getlist('collateralInfo')
	otherCollateralText = request.form.get('otherCollateralText', '#No Value')
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
	
	# individual 1
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
	individualOwnRentDropdown1 = request.form.get('individualOwnRentDropdown1', '#No Value')
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
	# individual 2
	individualDeclareCheckbox1 = request.form.get('individualDeclareCheckbox1', '#No Value')
	individualPersonalGuarantorDropdown2 = request.form.get('individualPersonalGuarantorDropdown2', '#No Value')
	individualCitizenDropdown2 = request.form.get('individualCitizenDropdown2', '#No Value')
	individualSDResidentDropdown2 = request.form.get('individualSDResidentDropdown2', '#No Value')
	individualFirstName2 = request.form.get('individualFirstName2', '#No Value')
	individualMiddleName2 = request.form.get('individualMiddleName2', '#No Value')
	individualLastName2 = request.form.get('individualLastName2', '#No Value')
	individualHomeBankAddress2 = request.form.get('individualHomeBankAddress2', '#No Value')
	individualHomeStreetAddress2 = request.form.get('individualHomeStreetAddress2', '#No Value')
	individualHomeCity2 = request.form.get('individualHomeCity2', '#No Value')
	individualHomeState2 = request.form.get('individualHomeState2', '#No Value')
	individualHomeZip2 = request.form.get('individualHomeZip2', '#No Value')
	individualhomeCountry2 = request.form.get('individualhomeCountry2', '#No Value')
	individualOwnRentDropdown2 = request.form.get('individualOwnRentDropdown2', '#No Value')
	individualMonthlyRent2 = request.form.get('individualMonthlyRent2', '#No Value')
	individualPassportNumber2 = request.form.get('individualPassportNumber2', '#No Value')
	individualSsn2 = request.form.get('individualSsn2', '#No Value')
	individualDob2 = request.form.get('individualDob2', '#No Value')
	individualEmail2 = request.form.get('individualEmail2', '#No Value')
	individualPhone2 = request.form.get('individualPhone2', '#No Value')
	individualFico2 = request.form.get('individualFico2', '#No Value')
	individualIncome2 = request.form.get('individualIncome2', '#No Value')
	individualPep2 = request.form.get('individualPep2', '#No Value')
	individualCrime2 = request.form.get('individualCrime2', '#No Value')
	individualDeclareCheckbox2 = request.form.get('individualDeclareCheckbox2', '#No Value')
	# individual 3
	individualPersonalGuarantorDropdown3 = request.form.get('individualPersonalGuarantorDropdown3', '#No Value')
	individualCitizenDropdown3 = request.form.get('individualCitizenDropdown3', '#No Value')
	individualSDResidentDropdown3 = request.form.get('individualSDResidentDropdown3', '#No Value')
	individualFirstName3 = request.form.get('individualFirstName3', '#No Value')
	individualMiddleName3 = request.form.get('individualMiddleName3', '#No Value')
	individualLastName3 = request.form.get('individualLastName3', '#No Value')
	individualHomeBankAddress3 = request.form.get('individualHomeBankAddress3', '#No Value')
	individualHomeStreetAddress3 = request.form.get('individualHomeStreetAddress3', '#No Value')
	individualHomeCity3 = request.form.get('individualHomeCity3', '#No Value')
	individualHomeState3 = request.form.get('individualHomeState3', '#No Value')
	individualHomeZip3 = request.form.get('individualHomeZip3', '#No Value')
	individualhomeCountry3 = request.form.get('individualhomeCountry3', '#No Value')
	individualOwnRentDropdown3 = request.form.get('individualOwnRentDropdown3', '#No Value')
	individualMonthlyRent3 = request.form.get('individualMonthlyRent3', '#No Value')
	individualPassportNumber3 = request.form.get('individualPassportNumber3', '#No Value')
	individualSsn3 = request.form.get('individualSsn3', '#No Value')
	individualDob3 = request.form.get('individualDob3', '#No Value')
	individualEmail3 = request.form.get('individualEmail3', '#No Value')
	individualPhone3 = request.form.get('individualPhone3', '#No Value')
	individualFico3 = request.form.get('individualFico3', '#No Value')
	individualIncome3 = request.form.get('individualIncome3', '#No Value')
	individualPep3 = request.form.get('individualPep3', '#No Value')
	individualCrime3 = request.form.get('individualCrime3', '#No Value')
	individualDeclareCheckbox3 = request.form.get('individualDeclareCheckbox3', '#No Value')
	# individual 4
	individualPersonalGuarantorDropdown4 = request.form.get('individualPersonalGuarantorDropdown4', '#No Value')
	individualCitizenDropdown4 = request.form.get('individualCitizenDropdown4', '#No Value')
	individualSDResidentDropdown4 = request.form.get('individualSDResidentDropdown4', '#No Value')
	individualFirstName4 = request.form.get('individualFirstName4', '#No Value')
	individualMiddleName4 = request.form.get('individualMiddleName4', '#No Value')
	individualLastName4 = request.form.get('individualLastName4', '#No Value')
	individualHomeBankAddress4 = request.form.get('individualHomeBankAddress4', '#No Value')
	individualHomeStreetAddress4 = request.form.get('individualHomeStreetAddress4', '#No Value')
	individualHomeCity4 = request.form.get('individualHomeCity4', '#No Value')
	individualHomeState4 = request.form.get('individualHomeState4', '#No Value')
	individualHomeZip4 = request.form.get('individualHomeZip4', '#No Value')
	individualhomeCountry4 = request.form.get('individualhomeCountry4', '#No Value')
	individualOwnRentDropdown4 = request.form.get('individualOwnRentDropdown4', '#No Value')
	individualMonthlyRent4 = request.form.get('individualMonthlyRent4', '#No Value')
	individualPassportNumber4 = request.form.get('individualPassportNumber4', '#No Value')
	individualSsn4 = request.form.get('individualSsn4', '#No Value')
	individualDob4 = request.form.get('individualDob4', '#No Value')
	individualEmail4 = request.form.get('individualEmail4', '#No Value')
	individualPhone4 = request.form.get('individualPhone4', '#No Value')
	individualFico4 = request.form.get('individualFico4', '#No Value')
	individualIncome4 = request.form.get('individualIncome4', '#No Value')
	individualPep4 = request.form.get('individualPep4', '#No Value')
	individualCrime4 = request.form.get('individualCrime4', '#No Value')
	individualDeclareCheckbox4 = request.form.get('individualDeclareCheckbox4', '#No Value')
	# individual 5
	individualPersonalGuarantorDropdown5 = request.form.get('individualPersonalGuarantorDropdown5', '#No Value')
	individualCitizenDropdown5 = request.form.get('individualCitizenDropdown5', '#No Value')
	individualSDResidentDropdown5 = request.form.get('individualSDResidentDropdown5', '#No Value')
	individualFirstName5 = request.form.get('individualFirstName5', '#No Value')
	individualMiddleName5 = request.form.get('individualMiddleName5', '#No Value')
	individualLastName5 = request.form.get('individualLastName5', '#No Value')
	individualHomeBankAddress5 = request.form.get('individualHomeBankAddress5', '#No Value')
	individualHomeStreetAddress5 = request.form.get('individualHomeStreetAddress5', '#No Value')
	individualHomeCity5 = request.form.get('individualHomeCity5', '#No Value')
	individualHomeState5 = request.form.get('individualHomeState5', '#No Value')
	individualHomeZip5 = request.form.get('individualHomeZip5', '#No Value')
	individualhomeCountry5 = request.form.get('individualhomeCountry5', '#No Value')
	individualOwnRentDropdown5 = request.form.get('individualOwnRentDropdown5', '#No Value')
	individualMonthlyRent5 = request.form.get('individualMonthlyRent5', '#No Value')
	individualPassportNumber5 = request.form.get('individualPassportNumber5', '#No Value')
	individualSsn5 = request.form.get('individualSsn5', '#No Value')
	individualDob5 = request.form.get('individualDob5', '#No Value')
	individualEmail5 = request.form.get('individualEmail5', '#No Value')
	individualPhone5 = request.form.get('individualPhone5', '#No Value')
	individualFico5 = request.form.get('individualFico5', '#No Value')
	individualIncome5 = request.form.get('individualIncome5', '#No Value')
	individualPep5 = request.form.get('individualPep5', '#No Value')
	individualCrime5 = request.form.get('individualCrime5', '#No Value')
	individualDeclareCheckbox5 = request.form.get('individualDeclareCheckbox5', '#No Value')
	# individual 6
	individualPersonalGuarantorDropdown6 = request.form.get('individualPersonalGuarantorDropdown6', '#No Value')
	individualCitizenDropdown6 = request.form.get('individualCitizenDropdown6', '#No Value')
	individualSDResidentDropdown6 = request.form.get('individualSDResidentDropdown6', '#No Value')
	individualFirstName6 = request.form.get('individualFirstName6', '#No Value')
	individualMiddleName6 = request.form.get('individualMiddleName6', '#No Value')
	individualLastName6 = request.form.get('individualLastName6', '#No Value')
	individualHomeBankAddress6 = request.form.get('individualHomeBankAddress6', '#No Value')
	individualHomeStreetAddress6 = request.form.get('individualHomeStreetAddress6', '#No Value')
	individualHomeCity6 = request.form.get('individualHomeCity6', '#No Value')
	individualHomeState6 = request.form.get('individualHomeState6', '#No Value')
	individualHomeZip6 = request.form.get('individualHomeZip6', '#No Value')
	individualhomeCountry6 = request.form.get('individualhomeCountry6', '#No Value')
	individualOwnRentDropdown6 = request.form.get('individualOwnRentDropdown6', '#No Value')
	individualMonthlyRent6 = request.form.get('individualMonthlyRent6', '#No Value')
	individualPassportNumber6 = request.form.get('individualPassportNumber6', '#No Value')
	individualSsn6 = request.form.get('individualSsn6', '#No Value')
	individualDob6 = request.form.get('individualDob6', '#No Value')
	individualEmail6 = request.form.get('individualEmail6', '#No Value')
	individualPhone6 = request.form.get('individualPhone6', '#No Value')
	individualFico6 = request.form.get('individualFico6', '#No Value')
	individualIncome6 = request.form.get('individualIncome6', '#No Value')
	individualPep6 = request.form.get('individualPep6', '#No Value')
	individualCrime6 = request.form.get('individualCrime6', '#No Value')
	individualDeclareCheckbox6 = request.form.get('individualDeclareCheckbox6', '#No Value')
	# individual 7
	individualPersonalGuarantorDropdown7 = request.form.get('individualPersonalGuarantorDropdown7', '#No Value')
	individualCitizenDropdown7 = request.form.get('individualCitizenDropdown7', '#No Value')
	individualSDResidentDropdown7 = request.form.get('individualSDResidentDropdown7', '#No Value')
	individualFirstName7 = request.form.get('individualFirstName7', '#No Value')
	individualMiddleName7 = request.form.get('individualMiddleName7', '#No Value')
	individualLastName7 = request.form.get('individualLastName7', '#No Value')
	individualHomeBankAddress7 = request.form.get('individualHomeBankAddress7', '#No Value')
	individualHomeStreetAddress7 = request.form.get('individualHomeStreetAddress7', '#No Value')
	individualHomeCity7 = request.form.get('individualHomeCity7', '#No Value')
	individualHomeState7 = request.form.get('individualHomeState7', '#No Value')
	individualHomeZip7 = request.form.get('individualHomeZip7', '#No Value')
	individualhomeCountry7 = request.form.get('individualhomeCountry7', '#No Value')
	individualOwnRentDropdown7 = request.form.get('individualOwnRentDropdown7', '#No Value')
	individualMonthlyRent7 = request.form.get('individualMonthlyRent7', '#No Value')
	individualPassportNumber7 = request.form.get('individualPassportNumber7', '#No Value')
	individualSsn7 = request.form.get('individualSsn7', '#No Value')
	individualDob7 = request.form.get('individualDob7', '#No Value')
	individualEmail7 = request.form.get('individualEmail7', '#No Value')
	individualPhone7 = request.form.get('individualPhone7', '#No Value')
	individualFico7 = request.form.get('individualFico7', '#No Value')
	individualIncome7 = request.form.get('individualIncome7', '#No Value')
	individualPep7 = request.form.get('individualPep7', '#No Value')
	individualCrime7 = request.form.get('individualCrime7', '#No Value')
	individualDeclareCheckbox7 = request.form.get('individualDeclareCheckbox7', '#No Value')
	# individual 8
	individualPersonalGuarantorDropdown8 = request.form.get('individualPersonalGuarantorDropdown8', '#No Value')
	individualCitizenDropdown8 = request.form.get('individualCitizenDropdown8', '#No Value')
	individualSDResidentDropdown8 = request.form.get('individualSDResidentDropdown8', '#No Value')
	individualFirstName8 = request.form.get('individualFirstName8', '#No Value')
	individualMiddleName8 = request.form.get('individualMiddleName8', '#No Value')
	individualLastName8 = request.form.get('individualLastName8', '#No Value')
	individualHomeBankAddress8 = request.form.get('individualHomeBankAddress8', '#No Value')
	individualHomeStreetAddress8 = request.form.get('individualHomeStreetAddress8', '#No Value')
	individualHomeCity8 = request.form.get('individualHomeCity8', '#No Value')
	individualHomeState8 = request.form.get('individualHomeState8', '#No Value')
	individualHomeZip8 = request.form.get('individualHomeZip8', '#No Value')
	individualhomeCountry8 = request.form.get('individualhomeCountry8', '#No Value')
	individualOwnRentDropdown8 = request.form.get('individualOwnRentDropdown8', '#No Value')
	individualMonthlyRent8 = request.form.get('individualMonthlyRent8', '#No Value')
	individualPassportNumber8 = request.form.get('individualPassportNumber8', '#No Value')
	individualSsn8 = request.form.get('individualSsn8', '#No Value')
	individualDob8 = request.form.get('individualDob8', '#No Value')
	individualEmail8 = request.form.get('individualEmail8', '#No Value')
	individualPhone8 = request.form.get('individualPhone8', '#No Value')
	individualFico8 = request.form.get('individualFico8', '#No Value')
	individualIncome8 = request.form.get('individualIncome8', '#No Value')
	individualPep8 = request.form.get('individualPep8', '#No Value')
	individualCrime8 = request.form.get('individualCrime8', '#No Value')
	individualDeclareCheckbox8 = request.form.get('individualDeclareCheckbox8', '#No Value')
	# done with repeating individuals
	beneficiaryName = request.form.get('beneficiaryName')
	
	
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
		'Individual 2 Personal Guarantor': individualPersonalGuarantorDropdown2,
		'Individual 2 Citizen': individualCitizenDropdown2,
		'Individual 2 South Dakota Resident': individualSDResidentDropdown2,
		'Individual 2 First Name': individualFirstName2,
		'Individual 2 Middle Name': individualMiddleName2,
		'Individual 2 Last Name': individualLastName2,
		'Individual 2 Home Address': individualHomeBankAddress2,
		'Individual 2 Home Street Address': individualHomeStreetAddress2,
		'Individual 2 Home City': individualHomeCity2,
		'Individual 2 Home State': individualHomeState2,
		'Individual 2 Home Zip': individualHomeZip2,
		'Individual 2 Home Country': individualhomeCountry2,
		'Individual 2 Own or Rent': individualOwnRentDropdown2,
		'Individual 2 Monthly Mortgage/Rent': individualMonthlyRent2,
		'Individual 2 Passport Number': individualPassportNumber2,
		'Individual 2 SSN': individualSsn2,
		'Individual 2 Date of Birth': individualDob2,
		'Individual 2 Email': individualEmail2,
		'Individual 2 Phone Number': individualPhone2,
		'Individual 2 FICO/NOSIS Number': individualFico2,
		'Individual 2 Income': individualIncome2,
		'Individual 2 Politically Exposed Person': individualPep2,
		'Individual 2 Crime': individualCrime2,
		'Individual 2 Declare': individualDeclareCheckbox2,
		'Individual 3 Personal Guarantor': individualPersonalGuarantorDropdown3,
		'Individual 3 Citizen': individualCitizenDropdown3,
		'Individual 3 South Dakota Resident': individualSDResidentDropdown3,
		'Individual 3 First Name': individualFirstName3,
		'Individual 3 Middle Name': individualMiddleName3,
		'Individual 3 Last Name': individualLastName3,
		'Individual 3 Home Address': individualHomeBankAddress3,
		'Individual 3 Home Street Address': individualHomeStreetAddress3,
		'Individual 3 Home City': individualHomeCity3,
		'Individual 3 Home State': individualHomeState3,
		'Individual 3 Home Zip': individualHomeZip3,
		'Individual 3 Home Country': individualhomeCountry3,
		'Individual 3 Own or Rent': individualOwnRentDropdown3,
		'Individual 3 Monthly Mortgage/Rent': individualMonthlyRent3,
		'Individual 3 Passport Number': individualPassportNumber3,
		'Individual 3 SSN': individualSsn3,
		'Individual 3 Date of Birth': individualDob3,
		'Individual 3 Email': individualEmail3,
		'Individual 3 Phone Number': individualPhone3,
		'Individual 3 FICO/NOSIS Number': individualFico3,
		'Individual 3 Income': individualIncome3,
		'Individual 3 Politically Exposed Person': individualPep3,
		'Individual 3 Crime': individualCrime3,
		'Individual 3 Declare': individualDeclareCheckbox3,
		'Individual 4 Personal Guarantor': individualPersonalGuarantorDropdown4,
		'Individual 4 Citizen': individualCitizenDropdown4,
		'Individual 4 South Dakota Resident': individualSDResidentDropdown4,
		'Individual 4 First Name': individualFirstName4,
		'Individual 4 Middle Name': individualMiddleName4,
		'Individual 4 Last Name': individualLastName4,
		'Individual 4 Home Address': individualHomeBankAddress4,
		'Individual 4 Home Street Address': individualHomeStreetAddress4,
		'Individual 4 Home City': individualHomeCity4,
		'Individual 4 Home State': individualHomeState4,
		'Individual 4 Home Zip': individualHomeZip4,
		'Individual 4 Home Country': individualhomeCountry4,
		'Individual 4 Own or Rent': individualOwnRentDropdown4,
		'Individual 4 Monthly Mortgage/Rent': individualMonthlyRent4,
		'Individual 4 Passport Number': individualPassportNumber4,
		'Individual 4 SSN': individualSsn4,
		'Individual 4 Date of Birth': individualDob4,
		'Individual 4 Email': individualEmail4,
		'Individual 4 Phone Number': individualPhone4,
		'Individual 4 FICO/NOSIS Number': individualFico4,
		'Individual 4 Income': individualIncome4,
		'Individual 4 Politically Exposed Person': individualPep4,
		'Individual 4 Crime': individualCrime4,
		'Individual 4 Declare': individualDeclareCheckbox4,
		'Individual 5 Personal Guarantor': individualPersonalGuarantorDropdown5,
		'Individual 5 Citizen': individualCitizenDropdown5,
		'Individual 5 South Dakota Resident': individualSDResidentDropdown5,
		'Individual 5 First Name': individualFirstName5,
		'Individual 5 Middle Name': individualMiddleName5,
		'Individual 5 Last Name': individualLastName5,
		'Individual 5 Home Address': individualHomeBankAddress5,
		'Individual 5 Home Street Address': individualHomeStreetAddress5,
		'Individual 5 Home City': individualHomeCity5,
		'Individual 5 Home State': individualHomeState5,
		'Individual 5 Home Zip': individualHomeZip5,
		'Individual 5 Home Country': individualhomeCountry5,
		'Individual 5 Own or Rent': individualOwnRentDropdown5,
		'Individual 5 Monthly Mortgage/Rent': individualMonthlyRent5,
		'Individual 5 Passport Number': individualPassportNumber5,
		'Individual 5 SSN': individualSsn5,
		'Individual 5 Date of Birth': individualDob5,
		'Individual 5 Email': individualEmail5,
		'Individual 5 Phone Number': individualPhone5,
		'Individual 5 FICO/NOSIS Number': individualFico5,
		'Individual 5 Income': individualIncome5,
		'Individual 5 Politically Exposed Person': individualPep5,
		'Individual 5 Crime': individualCrime5,
		'Individual 5 Declare': individualDeclareCheckbox5,
		'Individual 6 Personal Guarantor': individualPersonalGuarantorDropdown6,
		'Individual 6 Citizen': individualCitizenDropdown6,
		'Individual 6 South Dakota Resident': individualSDResidentDropdown6,
		'Individual 6 First Name': individualFirstName6,
		'Individual 6 Middle Name': individualMiddleName6,
		'Individual 6 Last Name': individualLastName6,
		'Individual 6 Home Address': individualHomeBankAddress6,
		'Individual 6 Home Street Address': individualHomeStreetAddress6,
		'Individual 6 Home City': individualHomeCity6,
		'Individual 6 Home State': individualHomeState6,
		'Individual 6 Home Zip': individualHomeZip6,
		'Individual 6 Home Country': individualhomeCountry6,
		'Individual 6 Own or Rent': individualOwnRentDropdown6,
		'Individual 6 Monthly Mortgage/Rent': individualMonthlyRent6,
		'Individual 6 Passport Number': individualPassportNumber6,
		'Individual 6 SSN': individualSsn6,
		'Individual 6 Date of Birth': individualDob6,
		'Individual 6 Email': individualEmail6,
		'Individual 6 Phone Number': individualPhone6,
		'Individual 6 FICO/NOSIS Number': individualFico6,
		'Individual 6 Income': individualIncome6,
		'Individual 6 Politically Exposed Person': individualPep6,
		'Individual 6 Crime': individualCrime6,
		'Individual 6 Declare': individualDeclareCheckbox6,
		'Individual 7 Personal Guarantor': individualPersonalGuarantorDropdown7,
		'Individual 7 Citizen': individualCitizenDropdown7,
		'Individual 7 South Dakota Resident': individualSDResidentDropdown7,
		'Individual 7 First Name': individualFirstName7,
		'Individual 7 Middle Name': individualMiddleName7,
		'Individual 7 Last Name': individualLastName7,
		'Individual 7 Home Address': individualHomeBankAddress7,
		'Individual 7 Home Street Address': individualHomeStreetAddress7,
		'Individual 7 Home City': individualHomeCity7,
		'Individual 7 Home State': individualHomeState7,
		'Individual 7 Home Zip': individualHomeZip7,
		'Individual 7 Home Country': individualhomeCountry7,
		'Individual 7 Own or Rent': individualOwnRentDropdown7,
		'Individual 7 Monthly Mortgage/Rent': individualMonthlyRent7,
		'Individual 7 Passport Number': individualPassportNumber7,
		'Individual 7 SSN': individualSsn7,
		'Individual 7 Date of Birth': individualDob7,
		'Individual 7 Email': individualEmail7,
		'Individual 7 Phone Number': individualPhone7,
		'Individual 7 FICO/NOSIS Number': individualFico7,
		'Individual 7 Income': individualIncome7,
		'Individual 7 Politically Exposed Person': individualPep7,
		'Individual 7 Crime': individualCrime7,
		'Individual 7 Declare': individualDeclareCheckbox7,
		'Individual 8 Personal Guarantor': individualPersonalGuarantorDropdown8,
		'Individual 8 Citizen': individualCitizenDropdown8,
		'Individual 8 South Dakota Resident': individualSDResidentDropdown8,
		'Individual 8 First Name': individualFirstName8,
		'Individual 8 Middle Name': individualMiddleName8,
		'Individual 8 Last Name': individualLastName8,
		'Individual 8 Home Address': individualHomeBankAddress8,
		'Individual 8 Home Street Address': individualHomeStreetAddress8,
		'Individual 8 Home City': individualHomeCity8,
		'Individual 8 Home State': individualHomeState8,
		'Individual 8 Home Zip': individualHomeZip8,
		'Individual 8 Home Country': individualhomeCountry8,
		'Individual 8 Own or Rent': individualOwnRentDropdown8,
		'Individual 8 Monthly Mortgage/Rent': individualMonthlyRent8,
		'Individual 8 Passport Number': individualPassportNumber8,
		'Individual 8 SSN': individualSsn8,
		'Individual 8 Date of Birth': individualDob8,
		'Individual 8 Email': individualEmail8,
		'Individual 8 Phone Number': individualPhone8,
		'Individual 8 FICO/NOSIS Number': individualFico8,
		'Individual 8 Income': individualIncome8,
		'Individual 8 Politically Exposed Person': individualPep8,
		'Individual 8 Crime': individualCrime8,
		'Individual 8 Declare': individualDeclareCheckbox8,
		
		
		
		
		
		
		
		'Beneficiary Name': beneficiaryName,
	}
	
	
	loanApplicationNumber = str(random.randint(1, 100))
	
	folderForApplication = 'LoanApplication' + loanApplicationNumber
	os.mkdir(folderForApplication)
	
	if (borrowerDropdown == 'Individual'):
		
		folderForFilesIndividual1 = os.path.join(folderForApplication, individualLastName1 + individualFirstName1 + 'Files')
		os.mkdir(folderForFilesIndividual1)
		
		individualPassportFile1 = request.files['individualPassportFile1']
		individualPassportFile1FileName = secure_filename(individualPassportFile1.filename)
		individualPassportFile1FileNameExt = os.path.splitext(individualPassportFile1FileName)[1]
		renamedIndividualPassportFile1 = individualLastName1 + individualFirstName1 + 'PassportFile' + individualPassportFile1FileNameExt
		repathedIndividualPassportFile1 = os.path.join(folderForFilesIndividual1, renamedIndividualPassportFile1)
		individualPassportFile1.save(repathedIndividualPassportFile1)
		
		individualDniFrontFile1 = request.files['individualDniFrontFile1']
		individualDniFrontFile1FileName = secure_filename(individualDniFrontFile1.filename)
		individualDniFrontFile1FileNameExt = os.path.splitext(individualDniFrontFile1FileName)[1]
		renamedIndividualDniFrontFile1 = individualLastName1 + individualFirstName1 + 'DniFrontFile' + individualDniFrontFile1FileNameExt
		repathedIndividualDniFrontFile1 = os.path.join(folderForFilesIndividual1, renamedIndividualDniFrontFile1)
		individualDniFrontFile1.save(repathedIndividualDniFrontFile1)
		
		individualDniReverseFile1 = request.files['individualDniReverseFile1']
		individualDniReverseFile1FileName = secure_filename(individualDniReverseFile1.filename)
		individualDniReverseFile1FileNameExt = os.path.splitext(individualDniReverseFile1FileName)[1]
		renamedIndividualDniReverseFile1 = individualLastName1 + individualFirstName1 + 'DniReverseFile' + individualDniReverseFile1FileNameExt
		repathedIndividualDniReverseFile1 = os.path.join(folderForFilesIndividual1, renamedIndividualDniReverseFile1)
		individualDniReverseFile1.save(repathedIndividualDniReverseFile1)
		
		individualBillAddressProofFile1 = request.files['individualBillAddressProofFile1']
		individualBillAddressProofFile1FileName = secure_filename(individualBillAddressProofFile1.filename)
		individualBillAddressProofFile1FileNameExt = os.path.splitext(individualBillAddressProofFile1FileName)[1]
		renamedIndividualBillAddressProofFile1 = individualLastName1 + individualFirstName1 + 'BillAddressProofFile1' + individualBillAddressProofFile1FileNameExt
		repathedIndividualBillAddressProofFile1 = os.path.join(folderForFilesIndividual1, renamedIndividualBillAddressProofFile1)
		individualBillAddressProofFile1.save(repathedIndividualBillAddressProofFile1)
		
		individualCreditCheckFile1 = request.files['individualCreditCheckFile1']
		individualCreditCheckFile1FileName = secure_filename(individualCreditCheckFile1.filename)
		individualCreditCheckFile1FileNameExt = os.path.splitext(individualCreditCheckFile1FileName)[1]
		renamedIndividualCreditCheckFile1 = individualLastName1 + individualFirstName1 + 'CreditCheckFile1' + individualCreditCheckFile1FileNameExt
		repathedIndividualCreditCheckFile1 = os.path.join(folderForFilesIndividual1, renamedIndividualCreditCheckFile1)
		individualCreditCheckFile1.save(repathedIndividualCreditCheckFile1)
		
		individualWorldCheckFile1 = request.files['individualWorldCheckFile1']
		individualWorldCheckFile1FileName = secure_filename(individualWorldCheckFile1.filename)
		individualWorldCheckFile1FileNameExt = os.path.splitext(individualWorldCheckFile1FileName)[1]
		renamedIndividualWorldCheckFile1 = individualLastName1 + individualFirstName1 + 'WorldCheckFile1' + individualWorldCheckFile1FileNameExt
		repathedIndividualWorldCheckFile1 = os.path.join(folderForFilesIndividual1, renamedIndividualWorldCheckFile1)
		individualWorldCheckFile1.save(repathedIndividualWorldCheckFile1)
		
		individualOfacFile1 = request.files['individualOfacFile1']
		individualOfacFile1FileName = secure_filename(individualOfacFile1.filename)
		individualOfacFile1FileNameExt = os.path.splitext(individualOfacFile1FileName)[1]
		renamedIndividualOfacFile1 = individualLastName1 + individualFirstName1 + 'OfacFile1' + individualOfacFile1FileNameExt
		repathedIndividualOfacFile1 = os.path.join(folderForFilesIndividual1, renamedIndividualOfacFile1)
		individualOfacFile1.save(repathedIndividualOfacFile1)
		
		if (individualFirstName2 != '#No Value'):
			
			folderForFilesIndividual2 = os.path.join(folderForApplication, individualLastName2 + individualFirstName2 + 'Files')
			os.mkdir(folderForFilesIndividual2)
			
			individualPassportFile2 = request.files['individualPassportFile2']
			individualPassportFile2FileName = secure_filename(individualPassportFile2.filename)
			individualPassportFile2FileNameExt = os.path.splitext(individualPassportFile2FileName)[1]
			renamedIndividualPassportFile2 = individualLastName2 + individualFirstName2 + 'PassportFile' + individualPassportFile2FileNameExt
			repathedIndividualPassportFile2 = os.path.join(folderForFilesIndividual2, renamedIndividualPassportFile2)
			individualPassportFile2.save(repathedIndividualPassportFile2)
			
			individualDniFrontFile2 = request.files['individualDniFrontFile2']
			individualDniFrontFile2FileName = secure_filename(individualDniFrontFile2.filename)
			individualDniFrontFile2FileNameExt = os.path.splitext(individualDniFrontFile2FileName)[1]
			renamedIndividualDniFrontFile2 = individualLastName2 + individualFirstName2 + 'DniFrontFile' + individualDniFrontFile2FileNameExt
			repathedIndividualDniFrontFile2 = os.path.join(folderForFilesIndividual2, renamedIndividualDniFrontFile2)
			individualDniFrontFile2.save(repathedIndividualDniFrontFile2)
			
			individualDniReverseFile2 = request.files['individualDniReverseFile2']
			individualDniReverseFile2FileName = secure_filename(individualDniReverseFile2.filename)
			individualDniReverseFile2FileNameExt = os.path.splitext(individualDniReverseFile2FileName)[1]
			renamedIndividualDniReverseFile2 = individualLastName2 + individualFirstName2 + 'DniReverseFile' + individualDniReverseFile2FileNameExt
			repathedIndividualDniReverseFile2 = os.path.join(folderForFilesIndividual2, renamedIndividualDniReverseFile2)
			individualDniReverseFile2.save(repathedIndividualDniReverseFile2)
			
			individualBillAddressProofFile2 = request.files['individualBillAddressProofFile2']
			individualBillAddressProofFile2FileName = secure_filename(individualBillAddressProofFile2.filename)
			individualBillAddressProofFile2FileNameExt = os.path.splitext(individualBillAddressProofFile2FileName)[1]
			renamedIndividualBillAddressProofFile2 = individualLastName2 + individualFirstName2 + 'BillAddressProofFile2' + individualBillAddressProofFile2FileNameExt
			repathedIndividualBillAddressProofFile2 = os.path.join(folderForFilesIndividual2, renamedIndividualBillAddressProofFile2)
			individualBillAddressProofFile2.save(repathedIndividualBillAddressProofFile2)
			
			individualCreditCheckFile2 = request.files['individualCreditCheckFile2']
			individualCreditCheckFile2FileName = secure_filename(individualCreditCheckFile2.filename)
			individualCreditCheckFile2FileNameExt = os.path.splitext(individualCreditCheckFile2FileName)[1]
			renamedIndividualCreditCheckFile2 = individualLastName2 + individualFirstName2 + 'CreditCheckFile2' + individualCreditCheckFile2FileNameExt
			repathedIndividualCreditCheckFile2 = os.path.join(folderForFilesIndividual2, renamedIndividualCreditCheckFile2)
			individualCreditCheckFile2.save(repathedIndividualCreditCheckFile2)
			
			individualWorldCheckFile2 = request.files['individualWorldCheckFile2']
			individualWorldCheckFile2FileName = secure_filename(individualWorldCheckFile2.filename)
			individualWorldCheckFile2FileNameExt = os.path.splitext(individualWorldCheckFile2FileName)[1]
			renamedIndividualWorldCheckFile2 = individualLastName2 + individualFirstName2 + 'WorldCheckFile2' + individualWorldCheckFile2FileNameExt
			repathedIndividualWorldCheckFile2 = os.path.join(folderForFilesIndividual2, renamedIndividualWorldCheckFile2)
			individualWorldCheckFile2.save(repathedIndividualWorldCheckFile2)
			
			individualOfacFile2 = request.files['individualOfacFile2']
			individualOfacFile2FileName = secure_filename(individualOfacFile2.filename)
			individualOfacFile2FileNameExt = os.path.splitext(individualOfacFile2FileName)[1]
			renamedIndividualOfacFile2 = individualLastName2 + individualFirstName2 + 'OfacFile2' + individualOfacFile2FileNameExt
			repathedIndividualOfacFile2 = os.path.join(folderForFilesIndividual2, renamedIndividualOfacFile2)
			individualOfacFile2.save(repathedIndividualOfacFile2)
			
		if (individualFirstName3 != '#No Value'):
			
			folderForFilesIndividual3 = os.path.join(folderForApplication, individualLastName3 + individualFirstName3 + 'Files')
			os.mkdir(folderForFilesIndividual3)
			
			individualPassportFile3 = request.files['individualPassportFile3']
			individualPassportFile3FileName = secure_filename(individualPassportFile3.filename)
			individualPassportFile3FileNameExt = os.path.splitext(individualPassportFile3FileName)[1]
			renamedIndividualPassportFile3 = individualLastName3 + individualFirstName3 + 'PassportFile' + individualPassportFile3FileNameExt
			repathedIndividualPassportFile3 = os.path.join(folderForFilesIndividual3, renamedIndividualPassportFile3)
			individualPassportFile3.save(repathedIndividualPassportFile3)
			
			individualDniFrontFile3 = request.files['individualDniFrontFile3']
			individualDniFrontFile3FileName = secure_filename(individualDniFrontFile3.filename)
			individualDniFrontFile3FileNameExt = os.path.splitext(individualDniFrontFile3FileName)[1]
			renamedIndividualDniFrontFile3 = individualLastName3 + individualFirstName3 + 'DniFrontFile' + individualDniFrontFile3FileNameExt
			repathedIndividualDniFrontFile3 = os.path.join(folderForFilesIndividual3, renamedIndividualDniFrontFile3)
			individualDniFrontFile3.save(repathedIndividualDniFrontFile3)
			
			individualDniReverseFile3 = request.files['individualDniReverseFile3']
			individualDniReverseFile3FileName = secure_filename(individualDniReverseFile3.filename)
			individualDniReverseFile3FileNameExt = os.path.splitext(individualDniReverseFile3FileName)[1]
			renamedIndividualDniReverseFile3 = individualLastName3 + individualFirstName3 + 'DniReverseFile' + individualDniReverseFile3FileNameExt
			repathedIndividualDniReverseFile3 = os.path.join(folderForFilesIndividual3, renamedIndividualDniReverseFile3)
			individualDniReverseFile3.save(repathedIndividualDniReverseFile3)
			
			individualBillAddressProofFile3 = request.files['individualBillAddressProofFile3']
			individualBillAddressProofFile3FileName = secure_filename(individualBillAddressProofFile3.filename)
			individualBillAddressProofFile3FileNameExt = os.path.splitext(individualBillAddressProofFile3FileName)[1]
			renamedIndividualBillAddressProofFile3 = individualLastName3 + individualFirstName3 + 'BillAddressProofFile3' + individualBillAddressProofFile3FileNameExt
			repathedIndividualBillAddressProofFile3 = os.path.join(folderForFilesIndividual3, renamedIndividualBillAddressProofFile3)
			individualBillAddressProofFile3.save(repathedIndividualBillAddressProofFile3)
			
			individualCreditCheckFile3 = request.files['individualCreditCheckFile3']
			individualCreditCheckFile3FileName = secure_filename(individualCreditCheckFile3.filename)
			individualCreditCheckFile3FileNameExt = os.path.splitext(individualCreditCheckFile3FileName)[1]
			renamedIndividualCreditCheckFile3 = individualLastName3 + individualFirstName3 + 'CreditCheckFile3' + individualCreditCheckFile3FileNameExt
			repathedIndividualCreditCheckFile3 = os.path.join(folderForFilesIndividual3, renamedIndividualCreditCheckFile3)
			individualCreditCheckFile3.save(repathedIndividualCreditCheckFile3)
			
			individualWorldCheckFile3 = request.files['individualWorldCheckFile3']
			individualWorldCheckFile3FileName = secure_filename(individualWorldCheckFile3.filename)
			individualWorldCheckFile3FileNameExt = os.path.splitext(individualWorldCheckFile3FileName)[1]
			renamedIndividualWorldCheckFile3 = individualLastName3 + individualFirstName3 + 'WorldCheckFile3' + individualWorldCheckFile3FileNameExt
			repathedIndividualWorldCheckFile3 = os.path.join(folderForFilesIndividual3, renamedIndividualWorldCheckFile3)
			individualWorldCheckFile3.save(repathedIndividualWorldCheckFile3)
			
			individualOfacFile3 = request.files['individualOfacFile3']
			individualOfacFile3FileName = secure_filename(individualOfacFile3.filename)
			individualOfacFile3FileNameExt = os.path.splitext(individualOfacFile3FileName)[1]
			renamedIndividualOfacFile3 = individualLastName3 + individualFirstName3 + 'OfacFile3' + individualOfacFile3FileNameExt
			repathedIndividualOfacFile3 = os.path.join(folderForFilesIndividual3, renamedIndividualOfacFile3)
			individualOfacFile3.save(repathedIndividualOfacFile3)
		
		if (individualFirstName4 != '#No Value'):
			
			folderForFilesIndividual4 = os.path.join(folderForApplication, individualLastName4 + individualFirstName4 + 'Files')
			os.mkdir(folderForFilesIndividual4)
			
			individualPassportFile4 = request.files['individualPassportFile4']
			individualPassportFile4FileName = secure_filename(individualPassportFile4.filename)
			individualPassportFile4FileNameExt = os.path.splitext(individualPassportFile4FileName)[1]
			renamedIndividualPassportFile4 = individualLastName4 + individualFirstName4 + 'PassportFile' + individualPassportFile4FileNameExt
			repathedIndividualPassportFile4 = os.path.join(folderForFilesIndividual4, renamedIndividualPassportFile4)
			individualPassportFile4.save(repathedIndividualPassportFile4)
			
			individualDniFrontFile4 = request.files['individualDniFrontFile4']
			individualDniFrontFile4FileName = secure_filename(individualDniFrontFile4.filename)
			individualDniFrontFile4FileNameExt = os.path.splitext(individualDniFrontFile4FileName)[1]
			renamedIndividualDniFrontFile4 = individualLastName4 + individualFirstName4 + 'DniFrontFile' + individualDniFrontFile4FileNameExt
			repathedIndividualDniFrontFile4 = os.path.join(folderForFilesIndividual4, renamedIndividualDniFrontFile4)
			individualDniFrontFile4.save(repathedIndividualDniFrontFile4)
			
			individualDniReverseFile4 = request.files['individualDniReverseFile4']
			individualDniReverseFile4FileName = secure_filename(individualDniReverseFile4.filename)
			individualDniReverseFile4FileNameExt = os.path.splitext(individualDniReverseFile4FileName)[1]
			renamedIndividualDniReverseFile4 = individualLastName4 + individualFirstName4 + 'DniReverseFile' + individualDniReverseFile4FileNameExt
			repathedIndividualDniReverseFile4 = os.path.join(folderForFilesIndividual4, renamedIndividualDniReverseFile4)
			individualDniReverseFile4.save(repathedIndividualDniReverseFile4)
			
			individualBillAddressProofFile4 = request.files['individualBillAddressProofFile4']
			individualBillAddressProofFile4FileName = secure_filename(individualBillAddressProofFile4.filename)
			individualBillAddressProofFile4FileNameExt = os.path.splitext(individualBillAddressProofFile4FileName)[1]
			renamedIndividualBillAddressProofFile4 = individualLastName4 + individualFirstName4 + 'BillAddressProofFile4' + individualBillAddressProofFile4FileNameExt
			repathedIndividualBillAddressProofFile4 = os.path.join(folderForFilesIndividual4, renamedIndividualBillAddressProofFile4)
			individualBillAddressProofFile4.save(repathedIndividualBillAddressProofFile4)
			
			individualCreditCheckFile4 = request.files['individualCreditCheckFile4']
			individualCreditCheckFile4FileName = secure_filename(individualCreditCheckFile4.filename)
			individualCreditCheckFile4FileNameExt = os.path.splitext(individualCreditCheckFile4FileName)[1]
			renamedIndividualCreditCheckFile4 = individualLastName4 + individualFirstName4 + 'CreditCheckFile4' + individualCreditCheckFile4FileNameExt
			repathedIndividualCreditCheckFile4 = os.path.join(folderForFilesIndividual4, renamedIndividualCreditCheckFile4)
			individualCreditCheckFile4.save(repathedIndividualCreditCheckFile4)
			
			individualWorldCheckFile4 = request.files['individualWorldCheckFile4']
			individualWorldCheckFile4FileName = secure_filename(individualWorldCheckFile4.filename)
			individualWorldCheckFile4FileNameExt = os.path.splitext(individualWorldCheckFile4FileName)[1]
			renamedIndividualWorldCheckFile4 = individualLastName4 + individualFirstName4 + 'WorldCheckFile4' + individualWorldCheckFile4FileNameExt
			repathedIndividualWorldCheckFile4 = os.path.join(folderForFilesIndividual4, renamedIndividualWorldCheckFile4)
			individualWorldCheckFile4.save(repathedIndividualWorldCheckFile4)
			
			individualOfacFile4 = request.files['individualOfacFile4']
			individualOfacFile4FileName = secure_filename(individualOfacFile4.filename)
			individualOfacFile4FileNameExt = os.path.splitext(individualOfacFile4FileName)[1]
			renamedIndividualOfacFile4 = individualLastName4 + individualFirstName4 + 'OfacFile4' + individualOfacFile4FileNameExt
			repathedIndividualOfacFile4 = os.path.join(folderForFilesIndividual4, renamedIndividualOfacFile4)
			individualOfacFile4.save(repathedIndividualOfacFile4)
			
		if (individualFirstName5 != '#No Value'):
			
			folderForFilesIndividual5 = os.path.join(folderForApplication, individualLastName5 + individualFirstName5 + 'Files')
			os.mkdir(folderForFilesIndividual5)
			
			individualPassportFile5 = request.files['individualPassportFile5']
			individualPassportFile5FileName = secure_filename(individualPassportFile5.filename)
			individualPassportFile5FileNameExt = os.path.splitext(individualPassportFile5FileName)[1]
			renamedIndividualPassportFile5 = individualLastName5 + individualFirstName5 + 'PassportFile' + individualPassportFile5FileNameExt
			repathedIndividualPassportFile5 = os.path.join(folderForFilesIndividual5, renamedIndividualPassportFile5)
			individualPassportFile5.save(repathedIndividualPassportFile5)
			
			individualDniFrontFile5 = request.files['individualDniFrontFile5']
			individualDniFrontFile5FileName = secure_filename(individualDniFrontFile5.filename)
			individualDniFrontFile5FileNameExt = os.path.splitext(individualDniFrontFile5FileName)[1]
			renamedIndividualDniFrontFile5 = individualLastName5 + individualFirstName5 + 'DniFrontFile' + individualDniFrontFile5FileNameExt
			repathedIndividualDniFrontFile5 = os.path.join(folderForFilesIndividual5, renamedIndividualDniFrontFile5)
			individualDniFrontFile5.save(repathedIndividualDniFrontFile5)
			
			individualDniReverseFile5 = request.files['individualDniReverseFile5']
			individualDniReverseFile5FileName = secure_filename(individualDniReverseFile5.filename)
			individualDniReverseFile5FileNameExt = os.path.splitext(individualDniReverseFile5FileName)[1]
			renamedIndividualDniReverseFile5 = individualLastName5 + individualFirstName5 + 'DniReverseFile' + individualDniReverseFile5FileNameExt
			repathedIndividualDniReverseFile5 = os.path.join(folderForFilesIndividual5, renamedIndividualDniReverseFile5)
			individualDniReverseFile5.save(repathedIndividualDniReverseFile5)
			
			individualBillAddressProofFile5 = request.files['individualBillAddressProofFile5']
			individualBillAddressProofFile5FileName = secure_filename(individualBillAddressProofFile5.filename)
			individualBillAddressProofFile5FileNameExt = os.path.splitext(individualBillAddressProofFile5FileName)[1]
			renamedIndividualBillAddressProofFile5 = individualLastName5 + individualFirstName5 + 'BillAddressProofFile5' + individualBillAddressProofFile5FileNameExt
			repathedIndividualBillAddressProofFile5 = os.path.join(folderForFilesIndividual5, renamedIndividualBillAddressProofFile5)
			individualBillAddressProofFile5.save(repathedIndividualBillAddressProofFile5)
			
			individualCreditCheckFile5 = request.files['individualCreditCheckFile5']
			individualCreditCheckFile5FileName = secure_filename(individualCreditCheckFile5.filename)
			individualCreditCheckFile5FileNameExt = os.path.splitext(individualCreditCheckFile5FileName)[1]
			renamedIndividualCreditCheckFile5 = individualLastName5 + individualFirstName5 + 'CreditCheckFile5' + individualCreditCheckFile5FileNameExt
			repathedIndividualCreditCheckFile5 = os.path.join(folderForFilesIndividual5, renamedIndividualCreditCheckFile5)
			individualCreditCheckFile5.save(repathedIndividualCreditCheckFile5)
			
			individualWorldCheckFile5 = request.files['individualWorldCheckFile5']
			individualWorldCheckFile5FileName = secure_filename(individualWorldCheckFile5.filename)
			individualWorldCheckFile5FileNameExt = os.path.splitext(individualWorldCheckFile5FileName)[1]
			renamedIndividualWorldCheckFile5 = individualLastName5 + individualFirstName5 + 'WorldCheckFile5' + individualWorldCheckFile5FileNameExt
			repathedIndividualWorldCheckFile5 = os.path.join(folderForFilesIndividual5, renamedIndividualWorldCheckFile5)
			individualWorldCheckFile5.save(repathedIndividualWorldCheckFile5)
			
			individualOfacFile5 = request.files['individualOfacFile5']
			individualOfacFile5FileName = secure_filename(individualOfacFile5.filename)
			individualOfacFile5FileNameExt = os.path.splitext(individualOfacFile5FileName)[1]
			renamedIndividualOfacFile5 = individualLastName5 + individualFirstName5 + 'OfacFile5' + individualOfacFile5FileNameExt
			repathedIndividualOfacFile5 = os.path.join(folderForFilesIndividual5, renamedIndividualOfacFile5)
			individualOfacFile5.save(repathedIndividualOfacFile5)
			
		if (individualFirstName6 != '#No Value'):
			
			folderForFilesIndividual6 = os.path.join(folderForApplication, individualLastName6 + individualFirstName6 + 'Files')
			os.mkdir(folderForFilesIndividual6)
			
			individualPassportFile6 = request.files['individualPassportFile6']
			individualPassportFile6FileName = secure_filename(individualPassportFile6.filename)
			individualPassportFile6FileNameExt = os.path.splitext(individualPassportFile6FileName)[1]
			renamedIndividualPassportFile6 = individualLastName6 + individualFirstName6 + 'PassportFile' + individualPassportFile6FileNameExt
			repathedIndividualPassportFile6 = os.path.join(folderForFilesIndividual6, renamedIndividualPassportFile6)
			individualPassportFile6.save(repathedIndividualPassportFile6)
			
			individualDniFrontFile6 = request.files['individualDniFrontFile6']
			individualDniFrontFile6FileName = secure_filename(individualDniFrontFile6.filename)
			individualDniFrontFile6FileNameExt = os.path.splitext(individualDniFrontFile6FileName)[1]
			renamedIndividualDniFrontFile6 = individualLastName6 + individualFirstName6 + 'DniFrontFile' + individualDniFrontFile6FileNameExt
			repathedIndividualDniFrontFile6 = os.path.join(folderForFilesIndividual6, renamedIndividualDniFrontFile6)
			individualDniFrontFile6.save(repathedIndividualDniFrontFile6)
			
			individualDniReverseFile6 = request.files['individualDniReverseFile6']
			individualDniReverseFile6FileName = secure_filename(individualDniReverseFile6.filename)
			individualDniReverseFile6FileNameExt = os.path.splitext(individualDniReverseFile6FileName)[1]
			renamedIndividualDniReverseFile6 = individualLastName6 + individualFirstName6 + 'DniReverseFile' + individualDniReverseFile6FileNameExt
			repathedIndividualDniReverseFile6 = os.path.join(folderForFilesIndividual6, renamedIndividualDniReverseFile6)
			individualDniReverseFile6.save(repathedIndividualDniReverseFile6)
			
			individualBillAddressProofFile6 = request.files['individualBillAddressProofFile6']
			individualBillAddressProofFile6FileName = secure_filename(individualBillAddressProofFile6.filename)
			individualBillAddressProofFile6FileNameExt = os.path.splitext(individualBillAddressProofFile6FileName)[1]
			renamedIndividualBillAddressProofFile6 = individualLastName6 + individualFirstName6 + 'BillAddressProofFile6' + individualBillAddressProofFile6FileNameExt
			repathedIndividualBillAddressProofFile6 = os.path.join(folderForFilesIndividual6, renamedIndividualBillAddressProofFile6)
			individualBillAddressProofFile6.save(repathedIndividualBillAddressProofFile6)
			
			individualCreditCheckFile6 = request.files['individualCreditCheckFile6']
			individualCreditCheckFile6FileName = secure_filename(individualCreditCheckFile6.filename)
			individualCreditCheckFile6FileNameExt = os.path.splitext(individualCreditCheckFile6FileName)[1]
			renamedIndividualCreditCheckFile6 = individualLastName6 + individualFirstName6 + 'CreditCheckFile6' + individualCreditCheckFile6FileNameExt
			repathedIndividualCreditCheckFile6 = os.path.join(folderForFilesIndividual6, renamedIndividualCreditCheckFile6)
			individualCreditCheckFile6.save(repathedIndividualCreditCheckFile6)
			
			individualWorldCheckFile6 = request.files['individualWorldCheckFile6']
			individualWorldCheckFile6FileName = secure_filename(individualWorldCheckFile6.filename)
			individualWorldCheckFile6FileNameExt = os.path.splitext(individualWorldCheckFile6FileName)[1]
			renamedIndividualWorldCheckFile6 = individualLastName6 + individualFirstName6 + 'WorldCheckFile6' + individualWorldCheckFile6FileNameExt
			repathedIndividualWorldCheckFile6 = os.path.join(folderForFilesIndividual6, renamedIndividualWorldCheckFile6)
			individualWorldCheckFile6.save(repathedIndividualWorldCheckFile6)
			
			individualOfacFile6 = request.files['individualOfacFile6']
			individualOfacFile6FileName = secure_filename(individualOfacFile6.filename)
			individualOfacFile6FileNameExt = os.path.splitext(individualOfacFile6FileName)[1]
			renamedIndividualOfacFile6 = individualLastName6 + individualFirstName6 + 'OfacFile6' + individualOfacFile6FileNameExt
			repathedIndividualOfacFile6 = os.path.join(folderForFilesIndividual6, renamedIndividualOfacFile6)
			individualOfacFile6.save(repathedIndividualOfacFile6)
		
		if (individualFirstName7 != '#No Value'):
			
			folderForFilesIndividual7 = os.path.join(folderForApplication, individualLastName7 + individualFirstName7 + 'Files')
			os.mkdir(folderForFilesIndividual7)
			
			individualPassportFile7 = request.files['individualPassportFile7']
			individualPassportFile7FileName = secure_filename(individualPassportFile7.filename)
			individualPassportFile7FileNameExt = os.path.splitext(individualPassportFile7FileName)[1]
			renamedIndividualPassportFile7 = individualLastName7 + individualFirstName7 + 'PassportFile' + individualPassportFile7FileNameExt
			repathedIndividualPassportFile7 = os.path.join(folderForFilesIndividual7, renamedIndividualPassportFile7)
			individualPassportFile7.save(repathedIndividualPassportFile7)
			
			individualDniFrontFile7 = request.files['individualDniFrontFile7']
			individualDniFrontFile7FileName = secure_filename(individualDniFrontFile7.filename)
			individualDniFrontFile7FileNameExt = os.path.splitext(individualDniFrontFile7FileName)[1]
			renamedIndividualDniFrontFile7 = individualLastName7 + individualFirstName7 + 'DniFrontFile' + individualDniFrontFile7FileNameExt
			repathedIndividualDniFrontFile7 = os.path.join(folderForFilesIndividual7, renamedIndividualDniFrontFile7)
			individualDniFrontFile7.save(repathedIndividualDniFrontFile7)
			
			individualDniReverseFile7 = request.files['individualDniReverseFile7']
			individualDniReverseFile7FileName = secure_filename(individualDniReverseFile7.filename)
			individualDniReverseFile7FileNameExt = os.path.splitext(individualDniReverseFile7FileName)[1]
			renamedIndividualDniReverseFile7 = individualLastName7 + individualFirstName7 + 'DniReverseFile' + individualDniReverseFile7FileNameExt
			repathedIndividualDniReverseFile7 = os.path.join(folderForFilesIndividual7, renamedIndividualDniReverseFile7)
			individualDniReverseFile7.save(repathedIndividualDniReverseFile7)
			
			individualBillAddressProofFile7 = request.files['individualBillAddressProofFile7']
			individualBillAddressProofFile7FileName = secure_filename(individualBillAddressProofFile7.filename)
			individualBillAddressProofFile7FileNameExt = os.path.splitext(individualBillAddressProofFile7FileName)[1]
			renamedIndividualBillAddressProofFile7 = individualLastName7 + individualFirstName7 + 'BillAddressProofFile7' + individualBillAddressProofFile7FileNameExt
			repathedIndividualBillAddressProofFile7 = os.path.join(folderForFilesIndividual7, renamedIndividualBillAddressProofFile7)
			individualBillAddressProofFile7.save(repathedIndividualBillAddressProofFile7)
			
			individualCreditCheckFile7 = request.files['individualCreditCheckFile7']
			individualCreditCheckFile7FileName = secure_filename(individualCreditCheckFile7.filename)
			individualCreditCheckFile7FileNameExt = os.path.splitext(individualCreditCheckFile7FileName)[1]
			renamedIndividualCreditCheckFile7 = individualLastName7 + individualFirstName7 + 'CreditCheckFile7' + individualCreditCheckFile7FileNameExt
			repathedIndividualCreditCheckFile7 = os.path.join(folderForFilesIndividual7, renamedIndividualCreditCheckFile7)
			individualCreditCheckFile7.save(repathedIndividualCreditCheckFile7)
			
			individualWorldCheckFile7 = request.files['individualWorldCheckFile7']
			individualWorldCheckFile7FileName = secure_filename(individualWorldCheckFile7.filename)
			individualWorldCheckFile7FileNameExt = os.path.splitext(individualWorldCheckFile7FileName)[1]
			renamedIndividualWorldCheckFile7 = individualLastName7 + individualFirstName7 + 'WorldCheckFile7' + individualWorldCheckFile7FileNameExt
			repathedIndividualWorldCheckFile7 = os.path.join(folderForFilesIndividual7, renamedIndividualWorldCheckFile7)
			individualWorldCheckFile7.save(repathedIndividualWorldCheckFile7)
			
			individualOfacFile7 = request.files['individualOfacFile7']
			individualOfacFile7FileName = secure_filename(individualOfacFile7.filename)
			individualOfacFile7FileNameExt = os.path.splitext(individualOfacFile7FileName)[1]
			renamedIndividualOfacFile7 = individualLastName7 + individualFirstName7 + 'OfacFile7' + individualOfacFile7FileNameExt
			repathedIndividualOfacFile7 = os.path.join(folderForFilesIndividual7, renamedIndividualOfacFile7)
			individualOfacFile7.save(repathedIndividualOfacFile7)
			
		if (individualFirstName8 != '#No Value'):
			
			folderForFilesIndividual8 = os.path.join(folderForApplication, individualLastName8 + individualFirstName8 + 'Files')
			os.mkdir(folderForFilesIndividual8)
			
			individualPassportFile8 = request.files['individualPassportFile8']
			individualPassportFile8FileName = secure_filename(individualPassportFile8.filename)
			individualPassportFile8FileNameExt = os.path.splitext(individualPassportFile8FileName)[1]
			renamedIndividualPassportFile8 = individualLastName8 + individualFirstName8 + 'PassportFile' + individualPassportFile8FileNameExt
			repathedIndividualPassportFile8 = os.path.join(folderForFilesIndividual8, renamedIndividualPassportFile8)
			individualPassportFile8.save(repathedIndividualPassportFile8)
			
			individualDniFrontFile8 = request.files['individualDniFrontFile8']
			individualDniFrontFile8FileName = secure_filename(individualDniFrontFile8.filename)
			individualDniFrontFile8FileNameExt = os.path.splitext(individualDniFrontFile8FileName)[1]
			renamedIndividualDniFrontFile8 = individualLastName8 + individualFirstName8 + 'DniFrontFile' + individualDniFrontFile8FileNameExt
			repathedIndividualDniFrontFile8 = os.path.join(folderForFilesIndividual8, renamedIndividualDniFrontFile8)
			individualDniFrontFile8.save(repathedIndividualDniFrontFile8)
			
			individualDniReverseFile8 = request.files['individualDniReverseFile8']
			individualDniReverseFile8FileName = secure_filename(individualDniReverseFile8.filename)
			individualDniReverseFile8FileNameExt = os.path.splitext(individualDniReverseFile8FileName)[1]
			renamedIndividualDniReverseFile8 = individualLastName8 + individualFirstName8 + 'DniReverseFile' + individualDniReverseFile8FileNameExt
			repathedIndividualDniReverseFile8 = os.path.join(folderForFilesIndividual8, renamedIndividualDniReverseFile8)
			individualDniReverseFile8.save(repathedIndividualDniReverseFile8)
			
			individualBillAddressProofFile8 = request.files['individualBillAddressProofFile8']
			individualBillAddressProofFile8FileName = secure_filename(individualBillAddressProofFile8.filename)
			individualBillAddressProofFile8FileNameExt = os.path.splitext(individualBillAddressProofFile8FileName)[1]
			renamedIndividualBillAddressProofFile8 = individualLastName8 + individualFirstName8 + 'BillAddressProofFile8' + individualBillAddressProofFile8FileNameExt
			repathedIndividualBillAddressProofFile8 = os.path.join(folderForFilesIndividual8, renamedIndividualBillAddressProofFile8)
			individualBillAddressProofFile8.save(repathedIndividualBillAddressProofFile8)
			
			individualCreditCheckFile8 = request.files['individualCreditCheckFile8']
			individualCreditCheckFile8FileName = secure_filename(individualCreditCheckFile8.filename)
			individualCreditCheckFile8FileNameExt = os.path.splitext(individualCreditCheckFile8FileName)[1]
			renamedIndividualCreditCheckFile8 = individualLastName8 + individualFirstName8 + 'CreditCheckFile8' + individualCreditCheckFile8FileNameExt
			repathedIndividualCreditCheckFile8 = os.path.join(folderForFilesIndividual8, renamedIndividualCreditCheckFile8)
			individualCreditCheckFile8.save(repathedIndividualCreditCheckFile8)
			
			individualWorldCheckFile8 = request.files['individualWorldCheckFile8']
			individualWorldCheckFile8FileName = secure_filename(individualWorldCheckFile8.filename)
			individualWorldCheckFile8FileNameExt = os.path.splitext(individualWorldCheckFile8FileName)[1]
			renamedIndividualWorldCheckFile8 = individualLastName8 + individualFirstName8 + 'WorldCheckFile8' + individualWorldCheckFile8FileNameExt
			repathedIndividualWorldCheckFile8 = os.path.join(folderForFilesIndividual8, renamedIndividualWorldCheckFile8)
			individualWorldCheckFile8.save(repathedIndividualWorldCheckFile8)
			
			individualOfacFile8 = request.files['individualOfacFile8']
			individualOfacFile8FileName = secure_filename(individualOfacFile8.filename)
			individualOfacFile8FileNameExt = os.path.splitext(individualOfacFile8FileName)[1]
			renamedIndividualOfacFile8 = individualLastName8 + individualFirstName8 + 'OfacFile8' + individualOfacFile8FileNameExt
			repathedIndividualOfacFile8 = os.path.join(folderForFilesIndividual8, renamedIndividualOfacFile8)
			individualOfacFile8.save(repathedIndividualOfacFile8)

						
			

	cleanedData = {k: v for k, v in data.items() if v != '#No Value'}    
	jsonName = 'LoanApplication' + loanApplicationNumber + '.json' 
	with open(f'{folderForApplication}/{jsonName}', 'w') as f:
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
	
	return render_template('borrowSubmitted.html', title='Submitted')






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



@app.route('/investorSubmitted', methods=['POST'])
def investorSubmit():
	
	return render_template('investorSubmitted.html', title='Submitted')




if __name__ == '__main__':
	app.run(debug=True)