const { generateKeyPairSync } = require("crypto");
const { writeFile } = require("fs/promises");

exports.createRsaKey = (passPhrase) => {
  if (!passPhrase) {
    passPhrase = "fucking capstone";
  }
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: passPhrase,
    },
  });
  writeFile("./config/publicKey.pam", publicKey, {
    encoding: "utf8",
  }).catch((error) => {
    console.log(error);
  });

  writeFile("./config/privateKey.pam", privateKey, {
    encoding: "utf8",
  }).catch((error) => {
    console.log(error);
  });
};
