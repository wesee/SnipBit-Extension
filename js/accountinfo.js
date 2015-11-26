function callbackWriteAccountInfo(password, email, guid, address, accountLink) {
	var here = document.getElementById("here");
	here.innerHTML = "<p>Password: " + password + "</p>" + "<p>Email: " + email + "</p>" + "<p>GUID: " + guid + "</p>" + 
	"<p>Address: " + address + "</p>" + "<p>Account Link: " + "<a href='" + accountLink + "'>" + accountLink + "</a>" +"</p>";
}

function callbackAcccountLink(password, email, guid, address) {
	var accountLink = "";
	chrome.storage.local.get("userAccountLink", function (data) {
		accountLink += data.userAccountLink;
		callbackWriteAccountInfo(password, email, guid, address, accountLink);
	});
}

function callbackAddress(password, email, guid) {
	var address = "";
	chrome.storage.local.get("userFirstAddress", function (data) {
		address += data.userFirstAddress;
		callbackAcccountLink(password, email, guid, address);
	});
}

function callbackGuid(password, email){
	var guid = "";
	chrome.storage.local.get("userGuid", function (data) {
		guid += data.userGuid;
		callbackAddress(password, email, guid);
	});
}


function callbackEmail(email) {
	var password = "";
	chrome.storage.local.get("userPassword", function (data) {
		password += data.userPassword;
		callbackGuid(password, email);
	});
}

function getEmailAndPassword(callback) {
	var email = "";

	chrome.storage.local.get("userEmail", function (data) {
		email += data.userEmail;
		callbackEmail(email);
	});
}

getEmailAndPassword(callbackEmail);