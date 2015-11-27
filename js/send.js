//Create Tx
function createTx(password, guid, toAddress, amount) {
	var apiCode = '55e84d76-6d88-48c2-921b-b4277477ed05';
	//create url to make GET request
	var sendUrl = 'https://blockchain.info/merchant/' + guid +'/payment?';
	sendUrl += 'password=' + password + '&';
	sendUrl += 'to=' + toAddress + '&';
	sendUrl += 'amount=' + amount + '&';
	sendUrl += 'api_code=' + apiCode;


	console.log(sendUrl);

	var xhr = new XMLHttpRequest();
	xhr.open("GET", sendUrl, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
		  	//JSON.parse does not evaluate the attacker's scripts.
		  	var resp = JSON.parse(xhr.responseText);
		  	console.log(resp);
		}
	}
	xhr.send()

}

function callbackAmount(password, guid, toAddress) {
	var amount = "";

	chrome.storage.local.get("tempAmount", function (data) {
		amount += data.tempAmount;
		createTx(password, guid, toAddress, amount);
	});
}

function callbackAddress(password, guid) {
	var toAddress = "";

	chrome.storage.local.get("tempToAddress", function (data) {
		toAddress += data.tempToAddress;
		callbackAmount(password, guid, toAddress);
	});
}

//Get the guid and callback to create tx
function getGuid(password) {
	var guid = "";

	chrome.storage.local.get("userGuid", function (data) {
		guid += data.userGuid;
		callbackAddress(password, guid);
	});
}

//Need to get all elements required for TX per BC.info
function sendTX(callback) {
	//start with password
	var password = "";

	chrome.storage.local.get("userPassword", function (data) {
		password += data.userPassword;
		callback(password);
	});
}

sendTX(getGuid);

