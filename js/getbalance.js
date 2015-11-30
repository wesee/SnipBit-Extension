function getBalance(guid, password) {
	var apiCode = '55e84d76-6d88-48c2-921b-b4277477ed05';
	
	var balanceUrl = "https://blockchain.info/merchant/";
	balanceUrl += guid + "/balance?";
	balanceUrl += "password=" + password + "&";
	balanceUrl += "api_code=" + apiCode;

	var xhr = new XMLHttpRequest();
	xhr.open("GET", balanceUrl, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
		  	//JSON.parse does not evaluate the attacker's scripts.
		  	var resp = JSON.parse(xhr.responseText);
		  	console.log(resp);
		  	var balance = resp.balance;

		  	var balanceHtml = document.getElementById("balance");
		  	balanceHtml.innerHTML = "<p>" + balance + " satoshis </p>"; 
		}
	}
	xhr.send()
}

function getPassword(guid) {
	var password = "";
	
	chrome.storage.local.get("userPassword", function (data) {
		password += data.userPassword;
		getBalance(guid, password);
	});
}

function getGuid(callback) {
	var guid = "";

	chrome.storage.local.get("userGuid", function (data) {
		guid += data.userGuid;
		callback(guid);
	});
}

getGuid(getPassword);