const path = require("path");
const fs = require("fs");

function handleFiles(socket, httpMethod, urlPath, requestBody) {
  const directory = process.argv[3];
  const filename = urlPath.split("/")[2]; // --> /files/filename
  const filePath = path.join(directory, filename);

  if (httpMethod === "GET") {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath).toString();
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}\r\n`
      );
      socket.write(fileContent);
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  } else if (httpMethod === "POST") {
    try {
      fs.writeFileSync(filePath, requestBody); // create and write content
      socket.write("HTTP/1.1 201 Created\r\n\r\n");
    } catch (err) {
      socket.write("Error writing file:", err);
    }
  }
}
module.exports = handleFiles;
