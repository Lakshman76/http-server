const { gzipCompress } = require("../utils/compress");
function handleEcho(socket, request, urlPath) {
  const acceptEncoding = request.find((line) =>
    line.startsWith("Accept-Encoding:")
  );
  const acceptEncodingValue = acceptEncoding ? acceptEncoding.split(": ")[1] : "";
  const message = urlPath.split("/")[2]; // --> /echo/abc = abc
  let response = `HTTP/1.1 200 OK\r\n`;

  if (!acceptEncoding) {
    response += `Content-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`;
  } else if (acceptEncodingValue.includes("gzip")) {
    response += `Content-Encoding: gzip\r\nContent-Type: text/plain\r\n`;
    const msgEncoded = gzipCompress(message);
    response += `Content-Length: ${msgEncoded.length}\r\n\r\n`;
    socket.write(response);
    socket.write(msgEncoded);
  } else {
    response += `Content-Type: text/plain\r\n\r\n`;
  }

  socket.write(response);
}

module.exports = handleEcho;
