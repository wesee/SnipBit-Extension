//Save the username and password entered
function saveAddressAmount() {

	var address = document.getElementById("address").value;
	var amount = document.getElementById("amount").value;

	chrome.storage.local.set({'tempToAddress': address}, function() {
	    // Notify that we saved.
	    console.log("The to address " + address + " was saved.");
	});

	chrome.storage.local.set({'tempAmount': amount}, function() {
	    // Notify that we saved.
	    console.log("The amount " + amount + " was saved.");
	});
}

var form = document.getElementById("send");
form.addEventListener('submit', saveAddressAmount, false);