var crypto	= require("crypto");
var fs		= require("fs");

var prm = fs.readFileSync("./prime.buf");

var gen_kp = function () {
	var dh = crypto.createDiffieHellman(prm);
	dh.generateKeys();
	return {
		pub: dh.getPublicKey(),
		prv: dh.getPrivateKey()
	};
};

var kp = gen_kp();

var dh = crypto.createDiffieHellman(prm);
dh.setPrivateKey(kp.prv);
var pub = dh.generateKeys();
console.log(pub);
console.log(kp.pub);
