var importBitcore = document.createElement('script');
	importBitcore.src = 'js/bitcore-lib.min.js';
	document.head.appendChild(importBitcore);

var importPaymentProtocol = document.createElement('script');
	importPaymentProtocol.src = 'js/bitcore-payment-protocol.min.js';
	document.head.appendChild(importPaymentProtocol);

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		//We have a request URL for BIP 70
		if (message.requestUrl != undefined) {
			var requestUrl = message.requestUrl;
			
			var PaymentProtocol = require('bitcore-payment-protocol');
			var bitcore = require('bitcore-lib');
			
			var xhr = new XMLHttpRequest();

			xhr.open('GET', requestUrl, true);
			xhr.responseType = "arraybuffer";
			xhr.send();

			xhr.onload = function (){
				if (xhr.status === 200){
					var rawbody = xhr.response;

					var body = PaymentProtocol.PaymentRequest.decode(rawbody);	
					var request = new PaymentProtocol().makePaymentRequest(body);

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

					var scriptBuffer = outputs[0].script.buffer;
					var toAddress = '1J3HDEarLhjRNNjdfYfE1ZJyC95aPdL3wQ';
					chrome.storage.local.set({'tempToAddress': toAddress});


					var satoshis = outputs[0].amount.toString()
					chrome.storage.local.set({'tempAmount': satoshis});
					
					var time = details.get('time');
					var expires = details.get('expires');
					var memo = details.get('memo');
					var payment_url = details.get('payment_url');
					var merchant_data = details.get('merchant_data');

					var confirmPayment = confirm("Are you sure you'd like to send " + satoshis + " satoshis for " + memo);

					if (confirmPayment) {
						//Create Tx
						function createTx(password, guid, toAddress, amount) {
							var apiCode = '55e84d76-6d88-48c2-921b-b4277477ed05';
							//create url to make GET request
							var sendUrl = 'https://blockchain.info/merchant/' + guid +'/payment?';
							sendUrl += 'password=' + password + '&';
							sendUrl += 'to=' + toAddress + '&';
							sendUrl += 'amount=' + amount + '&';
							sendUrl += 'api_code=' + apiCode;

							var xhrSend = new XMLHttpRequest();
							xhrSend.open("GET", sendUrl, true);
							xhrSend.onreadystatechange = function() {
								if (xhrSend.readyState == 4) {
								  	//JSON.parse does not evaluate the attacker's scripts.
								  	var resp = JSON.parse(xhrSend.responseText);

								  	//After sending the payment POST the details to the payment url
									//Need to update this later both on client and server for complet BIP 70 integration
									var payment = new PaymentProtocol().makePayment();
									payment.set('merchant_data', merchant_data);
									var tx = new bitcore.Transaction();
									tx.to(toAddress, 2000); 
									payment.set('transactions', tx.toBuffer());

									// define the refund outputs
									var refund_outputs = [];
									var refundAddress = bitcore.Address.fromString('1PTVUPJexLo6FgA35hnuBNVADouPTLHpn4');
									var refundScript = bitcore.Script.buildPublicKeyHashOut(refundAddress);
									var paymentOutputs = new PaymentProtocol().makeOutput();
									paymentOutputs.set('amount', 2000);
									paymentOutputs.set('script', refundScript.toBuffer());
									refund_outputs.push(paymentOutputs.message);

									payment.set('refund_to', refund_outputs);
									payment.set('memo', 'Have a payment');

									// serialize and send
									var rawPayment = payment.serialize();

									//UPDATE THIS LATER
									var xhrAck = new XMLHttpRequest();
									xhrAck.open('GET', payment_url, true);
									xhrAck.send(rawPayment);
									xhrAck.onload = function() {
										if (xhrAck.status == 200) {
											var rawAckBody = xhrAck.responseText;
											console.log(rawAckBody);
											chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
											  	chrome.tabs.sendMessage(sender.tab.id, {'contentBody': rawAckBody}, function(response) {
											    	console.log(response.farewell);
											  	});
											});
										}
									}
								}
							}

							xhrSend.send()

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

					}//end confirm

				}
			}
	  	}
});
