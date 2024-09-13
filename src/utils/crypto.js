const crypto = require('crypto')

function generate() {
  const otp = crypto.randomInt(1000, 9999).toString();
  
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the OTP with the salt
  const hash = crypto.pbkdf2Sync(otp, salt, 1000, 64, 'sha512').toString('hex');
  
  return {
    otp,
    salt,
    hash
  };
}

function verify(inputOtp, salt, originalHash) {
  const inputHash = crypto.pbkdf2Sync(inputOtp, salt, 1000, 64, 'sha512').toString('hex');
  return inputHash === originalHash;
}

const Otp = {
  generate,
  verify
}

module.exports = {
  Otp
}
