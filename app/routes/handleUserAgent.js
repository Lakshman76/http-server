function handleUserAgent(socket, request) {
  const agentHeader = request[2];
  const userAgentValue = agentHeader.split(" ")[1];

  socket.write(
    `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentValue.length}\r\n\r\n${userAgentValue}`
  );
}
module.exports = handleUserAgent;
