import * as net from "net";
import { RESPParser, RESLEncoder } from "redis-parser-ts";

const server: net.Server = net.createServer((connection: net.Socket) => {
  const parser = new RESPParser();

  parser.on("message", (message) => {
    if (message.type !== "array" || !message.value?.length) {
      connection.write(RESLEncoder.error("ERR invalid command"));
      return;
    }

    const parts = message.value;
    const command = parts[0]?.value?.toString().toUpperCase();

    if (command === "PING") {
      connection.write(RESLEncoder.simple("PONG"));
    } else if (command === "ECHO" && parts[1]) {
      const argument = parts[1].value;
      connection.write(RESLEncoder.bulk(argument == null ? "" : String(argument)));
    } else {
      connection.write(RESLEncoder.error("ERR unknown command"));
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
