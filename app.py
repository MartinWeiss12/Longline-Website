#!/usr/bin/env python3

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
    
    return render_template('borrow.html', title='Borrow')

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('loanTotal')
    email = request.form.get('numTranches')
    
    data = {
        'name': name,
        'email': email
    }
    
    with open('data.json', 'w') as f:
        json.dump(data, f)
        
    return 'Data saved!'

if __name__ == '__main__':
    app.run(debug=True)