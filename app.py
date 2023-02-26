#!/usr/bin/env python3
import boto3

import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates')
app.config ['SECRET_KEY'] = 'longline'

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
    intrestDropdown = request.form.get('intrestDropdown')
    
    data = {
        'Loan Purpose' : loanPurpose,
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
        'Intrest': intrestDropdown
    }
    
    with open('data.json', 'w') as f:
        json.dump(data, f)
        
    # Upload data.json to S3
    #s3 = boto3.resource('s3')
    bucket_name = 'your-bucket-name'
    object_key = 'data.json'
    #s3.Object(bucket_name, object_key).put(Body=open('data.json', 'rb'))
    
#   return 'Data saved!'
    return render_template('submitted.html', title='Submitted')


if __name__ == '__main__':
    app.run(debug=True)
    
    