import sjcl from "sjcl";

let keypair = null;

export function generateKeypair() {
  keypair = sjcl.ecc.elGamal.generateKeys(256, 6);

  return serializePublicKey(keypair.pub.get());
}

export function encrypt(content, publicKey) {
  publicKey = unserializePublicKey(publicKey);
  return sjcl.encrypt(publicKey, content);
}

export function decrypt(content) {
  return sjcl.decrypt(keypair.sec, content);
}

function serializePublicKey(key) {
  return sjcl.codec.base64.fromBits(key.x.concat(key.y));
}

function unserializePublicKey(key) {
  return new sjcl.ecc.elGamal.publicKey(
    sjcl.ecc.curves.c256,
    sjcl.codec.base64.toBits(key)
  );
}
