const crypto = require("crypto-js");

const hash = crypto.SHA256("admin123").toString();
console.log(hash);