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
form.addEventListener('register', saveUsernamePassword, false);