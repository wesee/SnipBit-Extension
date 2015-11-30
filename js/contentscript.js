var linksArray = document.links;
var bitcoinUriElement;
var bitcoinUriFields = '';

for (var i = 0; i < linksArray.length; i++) {
	if (linksArray[i].protocol === 'bitcoin:') {
		bitcoinUriElement = linksArray[i];
		bitcoinUriFields += linksArray[i].search;
	}
}

//accepts the variable it's looking for in the URI
function getQueryVariable(uriString, variable) {
	//what to query
    var query = uriString.replace('?', '&'); //gets rid of the initial ?
    //divide into sections
    var vars = query.split('&');
    //loop through each spit section
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
            console.log(pair[1]);
        	chrome.runtime.sendMessage({'requestUrl': pair[1]});
        }
    }
    return "error";
}

var requestUrl = bitcoinUriElement.addEventListener('click', function() {
	getQueryVariable(bitcoinUriFields, 'r');
}, true);

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        document.write(message.contentBody);
        console.log(message);
    });


