from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import json

# Load the data from the JSON file
with open('testData.json') as f:
    data = json.load(f)

# Create a new PDF document
pdf_canvas = canvas.Canvas('contract.pdf', pagesize=letter)

# Set up the form fields
pdf_canvas.drawString(100, 650, 'First Name:')
pdf_canvas.drawString(100, 600, 'Address:')

# Fill out the form fields with the data
pdf_canvas.drawString(200, 650, data['Entity Name'])
pdf_canvas.drawString(200, 600, data['Director 1 Home Address'])

# Save the PDF document
pdf_canvas.save()