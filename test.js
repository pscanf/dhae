var cr = require("./main.js");
var crypto = require("crypto");

var iter = function (i) {
	if (i === 0) {
		return;
	}
	var kp = cr.genKeyPair();
	var message = crypto.randomBytes(128, "hex");
	var ct = cr.asymEncrypt(kp.publicKey, message);
	var dt = cr.asymDecrypt(kp, ct);
	if (dt !== message) {
		console.log("ERROR!");
		console.log(message);
		console.log(dt);
	}
	iter(i-1);
};

iter(1);
