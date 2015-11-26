//Check to see if they need to login
function callbackPassword(password, email){
	if (password == undefined) {
		document.location.pathname = "/index.html";
	} else {
		document.location.pathname = "/page.html";
	}
}


function callbackEmail(email) {
	var password = "";
	chrome.storage.local.get("userPassword", function (data) {
		password += data.userPassword;
		callbackPassword(password, email);
		console.log('hey')
	});
}

function checkEmailAndPassword(callback) {
	var email = "";

	chrome.storage.local.get("userEmail", function (data) {
		email += data.userEmail;
		callbackEmail(email);
		console.log('hi');
	});
}

var doc = document;
doc.onload = checkEmailAndPassword(callbackEmail);
