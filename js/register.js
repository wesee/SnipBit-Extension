//Save the username and password entered
function saveUsernamePassword() {

	var email = document.getElementById("email").value;
	var password = document.getElementById("pswd").value;

	chrome.storage.local.set({'userPassword': password}, function() {
	    // Notify that we saved.
	    console.log("The password " + password + " was saved.");
	});

	chrome.storage.local.set({'userEmail': email}, function() {
	    // Notify that we saved.
	    console.log("The email " + email + " was saved.");
	});
}

var form = document.getElementById("register");
form.addEventListener('submit', saveUsernamePassword, false);

//Create the account
function callbackPassword(password, email){
	var apiCode = '55e84d76-6d88-48c2-921b-b4277477ed05';

	var makeWalletURL = 'https://blockchain.info/api/v2/create_wallet?';
	makeWalletURL += 'password=' + password;
	makeWalletURL += '&api_code=' + apiCode;
	makeWalletURL += '&email=' + email;

	var xhr = new XMLHttpRequest();
	xhr.open("GET", makeWalletURL, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
		  	//JSON.parse does not evaluate the attacker's scripts.
		  	var resp = JSON.parse(xhr.responseText);

		  	//Get account info
		  	var address = resp.address;
		  	var guid = resp.guid;
		  	var accountLink = resp.link;

		  	//Save info to local storage
		  	chrome.storage.local.set({"userFirstAddress": address}, function() {
		  		//Notify that we saved.
			    console.log("The address " + address + " was saved.");
		  	});

		  	chrome.storage.local.set({'userGuid': guid}, function() {
			    //Notify that we saved.
			    console.log("The guid " + guid + " was saved.");
			});

			chrome.storage.local.set({'userAccountLink': accountLink}, function() {
			    //Notify that we saved.
			    console.log("The account link " + accountLink + " was saved.");
			});
		}
	}
	xhr.send()
}


function callbackEmail(email) {
	var password = "";
	
	chrome.storage.local.get("userPassword", function (data) {
		password += data.userPassword;
		callbackPassword(password, email);
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

