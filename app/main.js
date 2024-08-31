const net = require("net");
const path = require("path");
const fs = require("fs");

const directory = process.argv[2] || path.join(process.cwd(), "files");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();

    const requestLine = request.split("\r\n")[0];
    const urlPath = requestLine.split(" ")[1];

    if (urlPath === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (urlPath.startsWith("/echo/")) {
      const message = urlPath.split("/")[2]; // --> /echo/abc

      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`
      );
    } else if (urlPath === "/user-agent") {
      const agentHeader = request.split("\r\n")[2];
      const userAgentValue = agentHeader.split(" ")[1];

      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentValue.length}\r\n\r\n${userAgentValue}`
      );
    } else if (urlPath.startsWith("/files/")) {
      const filename = urlPath.split("/")[2]; // --> /files/filename
      const filePath = path.join(directory, filename);

      if (!fs.existsSync(filePath)) {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      } else {
        const fileContent = fs.readFileSync(filePath);
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n`
        );
        socket.write(fileContent.toString());
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
