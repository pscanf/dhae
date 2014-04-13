var crypto	= require("crypto");
var fs		= require("fs");
var Q		= require("q");

var prm = fs.readFileSync("./prime.buf");

var gen_kp = function () {
	var dh = crypto.createDiffieHellman(prm);
	dh.generateKeys();
	return {
		pub: dh.getPublicKey("base64"),
		prv: dh.getPrivateKey("base64")
	};
};

var asymEnc = function (rcp, clr) {
	var loc = {};
	return Q()
		.then(function () {
			loc.dh  = crypto.createDiffieHellman(prm);
			loc.snd = dh.generateKeys();
			loc.scr = dh.computeSecret(rcp);
			return symEnc(scr, clr);
		})
		.then(function (cpt) {
			loc.msg = {
				snd: loc.snd,
				cpt: cpt
			};
			return Q(loc.msg);
		});
};

var symEnc = function (key, clr) {
	var dfr = Q.defer();
	var aes = crypto.createCipher("aes256", key);
	var cpt = new Buffer();
	aes.on("data", function (chunk) {
		cpt = Buffer.concat([cpt, chunk]);
	});
	aes.on("end", function () {
		dfr.resolve(cpt);
	});
	aes.on("error", function (err) {
		dfr.reject(err);
	});
	aes.end(clr);
	return dfr.promise;
};

var asymDec = function (rcp, msg) {
	var dh  = crypto.createDiffieHellman(prm);
	var snd = msg.split("_")[0];
	var cpt = msg.split("_")[1];
	var scr = dh.computeSecret(snd);
	dh.setPublicKey(recipientKeyPair.publicKey, "base64");
	dh.setPrivateKey(recipientKeyPair.privateKey, "base64");
	return symDecrypt(secret, cipherbuf);
};

var symDecrypt = function (symKey, cipherbuf) {
	var deferred = Q.defer();
	var decipher = crypto.createDecipher("aes256", symKey);
	var clearbuf = new Buffer();
	decipher.on("data", function (chunk) {
		clearbuf = Buffer.concat([clearbuf, chunk]);
	});
	decipher.on("end", function () {
		deferred.resolve(clearbuf);
	});
	decipher.on("error", function (err) {
		deferred.reject(err);
	});
	decipher.end(cipherbuf);
	return deferred.promise;
};

exports.symDecrypt = symEncrypt;
exports.asymEnc = asymEnc;
exports.symEnc = symEnc;
exports.asymDecrypt = asymDecrypt;
exports.genKeyPair = genKeyPair;
