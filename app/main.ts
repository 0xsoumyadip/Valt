import * as net from "net";
import { RESPParser, RESLEncoder } from "redis-parser-ts";

const db = new Map<string, string>();

const server: net.Server = net.createServer((connection: net.Socket) => {
  const parser = new RESPParser();

  parser.on("message", (message) => {
    if (message.type !== "array" || !message.value?.length) {
      connection.write(RESLEncoder.error("ERR invalid command"));
      return;
    }

    const parts = message.value;
    const command = parts[0]?.value?.toString().toUpperCase();

    switch(command) {
      case "PING": {
        connection.write(RESLEncoder.simple("PONG"));
        return;
      }
      case "ECHO": {
        if(parts.length !== 2) {
          connection.write(RESLEncoder.error("ERROR wrong numbers of arguments"));
          return;
        }
        connection.write(RESLEncoder.bulk(String(parts[1].value) ?? ""));
        return;
      }
      case "SET": {
        if(parts.length !== 3) {
          connection.write(RESLEncoder.error("ERROR wrong numbers of arguments"));
          return;
        }
        db.set(String(parts[1].value), String(parts[2].value));
        connection.write(RESLEncoder.simple("OK"));
        return;
      }
      case "GET": {
        if(parts.length !== 2) {
          connection.write(RESLEncoder.error("ERROR wrong number of arguments"));
          return;
        }
        const value = String(db.get(parts[1].value));
        connection.write(
          value === undefined ? RESLEncoder.bulk(null) : RESLEncoder.bulk(value)
        );
        return;
      }
      default: connection.write(RESLEncoder.simple("wrong argument"));
    }
  });

  parser.on("error", (error) => {
    console.error(error);
  });

  connection.on("data", (data: Buffer) => {
    parser.feed(data);
  });
});

server.listen(6379, () => {
  console.log("Server is running at port 6379");
});
