import * as net from "net";

// Uncomment the code below to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  while (true) {
    connection.on("data", (data: Buffer) => {
      connection.write("+PONG\r\n");
    });
  }
});

server.listen(8000, () => {
  console.log("Server is running at port 8000");
});
