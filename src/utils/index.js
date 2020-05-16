const crypto = require('crypto')

const checksum = (data) => {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}

module.exports = {
  checksum
}
