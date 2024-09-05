const net = require("net");
const handleEcho = require("./routes/handleEcho");
const handleUserAgent = require("./routes/handleUserAgent");
const handleFiles = require("./routes/handleFiles");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString().split("\r\n");
    const requestLine = request[0];
    const requestBody = request[request.length - 1]; // data

    const httpMethod = requestLine.split(" ")[0];
    const urlPath = requestLine.split(" ")[1];

    if (urlPath === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (urlPath.startsWith("/echo/")) {
      handleEcho(socket, request, urlPath);
    } else if (urlPath === "/user-agent") {
      handleUserAgent(socket, request);
    } else if (urlPath.startsWith("/files/")) {
      handleFiles(socket, httpMethod, urlPath, requestBody);
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
