from flask import Flask, render_template, request

app = Flask(__name__)
app.config ['SECRET_KEY'] = 'longline'


@app.route('/')
def index():
	return render_template('index.html')