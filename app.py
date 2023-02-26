#!/usr/bin/env python3
import boto3

import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates')
app.config ['SECRET_KEY'] = 'longline'


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

@app.route('/borrow', methods=['GET', 'POST'])
def borrow():
    if request.method == 'GET':
        return render_template('borrow.html', title='Borrow')
    

@app.route('/submit', methods=['POST'])
def submit():
    
    
    loanPurpose = request.form.getlist('loanPurpose')
    otherLoanPurpose = request.form.get('otherLoanText')
    
    
    loanTotal = request.form.get('loanTotal')
    numTranches = request.form.get('numTranches')
    
    
    data = {
        'Loan Purpose' : loanPurpose,
        'Loan Purpose (other)': otherLoanPurpose,
        'Loan Total': loanTotal,
        'Number of Tranches': numTranches
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
    
    