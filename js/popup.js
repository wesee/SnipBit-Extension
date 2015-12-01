//Recieve in Browser
var importPaymentProtocol = document.createElement('script');
	importPaymentProtocol.src = 'js/bitcore-payment-protocol.min.js';
	document.head.appendChild(importPaymentProtocol);

var PaymentProtocol = require('bitcore-payment-protocol');
var bitcore = require('bitcore-lib');

var xhr = new XMLHttpRequest();

xhr.open('GET', 'http://198.199.70.166:8888/pay', true);
xhr.responseType = "arraybuffer";
xhr.send();

xhr.onload = function (){
	if (xhr.status === 200){
		var rawbody = xhr.response;

		var body = PaymentProtocol.PaymentRequest.decode(rawbody);
		var request = new PaymentProtocol().makePaymentRequest(body);
		console.log(request);

		var version = request.get('payment_details_version');
		var pki_type = request.get('pki_type');
		var pki_data = request.get('pki_data');
		var serializedDetails = request.get('serialized_payment_details');
		var signature = request.get('signature');

		// Verify the signature
		var verified = request.verify();

		// Get the payment details
		var decodedDetails = PaymentProtocol.PaymentDetails.decode(serializedDetails);
		var details = new PaymentProtocol().makePaymentDetails(decodedDetails);
		var network = details.get('network');
		var outputs = details.get('outputs');
		var time = details.get('time');
		var expires = details.get('expires');
		var memo = details.get('memo');
		var payment_url = details.get('payment_url');
		var merchant_data = details.get('merchant_data');
	}
}