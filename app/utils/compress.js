const zlib = require("zlib");

// Function to compress data using gzip
function gzipCompress(message) {
  return zlib.gzipSync(message);
}

module.exports = { gzipCompress };