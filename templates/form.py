from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, SubmitField
from wtforms.validators import DataRequired

class BorrowForm(FlaskForm):
    asset = BooleanField('Asset Purchase or Down Payment')
    industrial = BooleanField('Industrial Use')
    tax = BooleanField('Tax Payment')
    insurance = BooleanField('Insurance Premium')
    trade = BooleanField('Margin Trading or Investment')
    edu = BooleanField('Education Expenses')
    otherLoan = BooleanField('Other')
    otherLoanText = StringField('Other Loan', validators=[DataRequired()])
    submit = SubmitField('Submit')