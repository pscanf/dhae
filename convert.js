var fs = require("fs");

var b = fs.readFileSync("prime.buf");
var s = b.toString("base64");
fs.writeFileSync("prime.base64", s, "utf8");
