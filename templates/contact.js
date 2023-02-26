

const currentYear = new Date().getFullYear();
const copyright = document.getElementById("copyright");
copyright.innerHTML = "&copy; " + currentYear + " Longline Lending LLC. All rights reserved."

//function downloadPage() {
//	const html = document.documentElement.outerHTML; // get the entire HTML content of the page
//	const blob = new Blob([html], { type: "text/html" }); // create a blob containing the HTML content
//	const url = URL.createObjectURL(blob); // create a URL for the blob
//	const a = document.createElement("a"); // create a new anchor element
//	a.href = url; // set the href attribute of the anchor element to the URL
//	a.download = "my-page.html"; // set the download attribute of the anchor element to the desired filename
//	document.body.appendChild(a); // append the anchor element to the document body
//	a.click(); // simulate a click on the anchor element to initiate the download
//	document.body.removeChild(a); // remove the anchor element from the document body
//	URL.revokeObjectURL(url); // release the URL object resources
//}
//
//const submitButton = document.getElementById("submit");
//submitButton.addEventListener("click", downloadPage);




window.jsPDF = window.jspdf.jsPDF;

// Convert HTML content to PDF
function Convert_HTML_To_PDF() {
	var doc = new jsPDF();
	
	// Source HTMLElement or a string containing HTML.
	var elementHTML = document.querySelector("#contentToPrint");
	
	doc.html(elementHTML, {
		callback: function(doc) {
			// Save the PDF
			doc.save('document-html.pdf');
		},
		margin: [10, 10, 10, 10],
		autoPaging: 'text',
		x: 0,
		y: 0,
		width: 190, //target width in the PDF document
		windowWidth: 675 //window width in CSS pixels
	});
}