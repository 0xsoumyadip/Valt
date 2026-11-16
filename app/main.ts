import * as net from "net";
import { RESPParser } from "redis-parser-ts";

// Uncomment the code below to pass the first stage

const parser = new RESPParser();

parser.on("message", (message) => {
  const value = String(message);
  const byteLength = Buffer.byteLength(value, "utf-8");
  const data =  Buffer.from(`$${byteLength}\r\n${value}\r\n`, "utf-8");
  console.log(data.toString());
});

parser.on("error", (error) => {
  console.log(error);
});

const server: net.Server = net.createServer((connection: net.Socket) => {
  // Handle connection
  
    connection.on("data", (data: Buffer) => {
      connection.write("+PONG\r\n");
      parser.feed(data);
    });
  
});

server.listen(6379, () => {
  console.log("Server is running at port 6379");
});
