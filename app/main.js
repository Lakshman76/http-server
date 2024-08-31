const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();

    const requestLine = request.split("\r\n")[0];
    const path = requestLine.split(" ")[1];

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path.startsWith("/echo/")) {
      const message = path.split("/")[2]; // --> /echo/abc
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`
      );
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
