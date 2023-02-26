const form = document.getElementById('login')
const username = document.getElementById('username')
const password = document.getElementById('password')

const errorElement = document.getElementById('error')

form.addEventListener('submit', (event) => {
  let messages = []
  
  errorElement.style.color = 'red'
  
  if (username.value.length < 6) {
    messages.push('Username must be at least 6 characters')
  }
  
  if (password.value.length < 8) {
    messages.push('Password must be at least 8 characters')
  }
  
  if (messages.length > 0) {
    errorElement.innerHTML = '<strong>Please Fix The Following Errors:</strong><br>' + messages.join('<br>')
    event.preventDefault()
  }
  
})

const currentYear = new Date().getFullYear();
const copyright = document.getElementById("copyright");
copyright.innerHTML = "&copy; " + currentYear + " Longline Lending LLC. All rights reserved."
