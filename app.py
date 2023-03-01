#!/usr/bin/env python3
import json
import boto3
from flask import Flask, render_template, request, jsonify, session
from flask_session import Session

app = Flask(__name__, template_folder='templates')
app.config ['SECRET_KEY'] = 'longline'
#app.config ['SESSION_PERMANENT'] = False
#app.config ['SESSION_TYPE'] = 'filesystem'
#Session(app)

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
    securityCheckbox = request.form.getlist('securityCheckbox')
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
        'Security Received/Guaranteed': securityCheckbox,
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
        'Individual 1 Personal Guarantor': individualPersonalGuarantorDropdown1
    }
    
#   fileName = last name + first name + date/loan number?
    
    with open('data.json', 'w') as f:
        json.dump(data, f)
        
    # Upload data.json to S3
    #s3 = boto3.resource('s3')
    bucket_name = 'your-bucket-name'
    object_key = 'data.json'
    #s3.Object(bucket_name, object_key).put(Body=open('data.json', 'rb'))
    
    return render_template('submitted.html', title='Submitted')


if __name__ == '__main__':
    app.run(debug=True)
    
    