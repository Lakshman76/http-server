const net = require("net");
const path = require("path");
const fs = require("fs");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString().split("\r\n");

    const requestLine = request[0];
    const requestBody = request[request.length - 1]; // data

    const httpMethod = requestLine.split(" ")[0];
    const urlPath = requestLine.split(" ")[1];

    // Find the Accept-Encoding header
    const acceptEncodingHeader = request.find((line) =>
      line.startsWith("Accept-Encoding:")
    );
    const acceptEncodingValue = acceptEncodingHeader
      ? acceptEncodingHeader.split(": ")[1]
      : "";

    if (urlPath === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (urlPath.startsWith("/echo/")) {
      let response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n";
      if (acceptEncodingValue.includes("gzip")) {
        response += "Content-Encoding: ${acceptEncodingValue}\r\n\r\n";
      } else if (!acceptEncodingValue.includes("gzip")) {
        response += "\r\n";
      } else {
        const message = urlPath.split("/")[2]; // --> /echo/abc
        response += `Content-Length: ${message.length}\r\n\r\n${message}`;
      }
      socket.write(response);
    } else if (urlPath === "/user-agent") {
      const agentHeader = request[2];
      const userAgentValue = agentHeader.split(" ")[1];

      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentValue.length}\r\n\r\n${userAgentValue}`
      );
    } else if (httpMethod === "GET" && urlPath.startsWith("/files/")) {
      const directory = process.argv[3];
      const filename = urlPath.split("/")[2]; // --> /files/filename
      const filePath = path.join(directory, filename);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath).toString();
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}\r\n`
        );
        socket.write(fileContent);
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    } else if (httpMethod === "POST" && urlPath.startsWith("/files/")) {
      const directory = process.argv[3];
      const filename = urlPath.split("/")[2]; // --> /files/filename
      const filePath = path.join(directory, filename);
      try {
        fs.writeFileSync(filePath, requestBody); // create and write content
        socket.write("HTTP/1.1 201 Created\r\n\r\n");
      } catch (err) {
        socket.write("Error writing file:", err);
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
  });
});

server.listen(4221, "localhost");
