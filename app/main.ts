import * as net from "net";
import { RESPParser, RESLEncoder } from "redis-parser-ts";
import { db, getData, setData } from "./db/RedisMap";
import RedisList from "./db/RedisList";

const list = new RedisList();


setInterval(() => {
  const now = Date.now();

  for (const [key, entry] of db) {
    if (entry.expiry !== null && now >= entry.expiry) {
      db.delete(key);
    }
  }
}, 100);

const server: net.Server = net.createServer((connection: net.Socket) => {
  const parser = new RESPParser();

  parser.on("message", (message) => {
    if (message.type !== "array" || !message.value?.length) {
      connection.write(RESLEncoder.error("ERR invalid command"));
      return;
    }

    const parts = message.value;
    const command = parts[0]?.value?.toString().toUpperCase();

    switch (command) {
      case "PING": {
        connection.write(RESLEncoder.simple("PONG"));
        return;
      }
      case "ECHO": {
        if (parts.length !== 2) {
          connection.write(
            RESLEncoder.error("ERROR wrong numbers of arguments"),
          );
          return;
        }
        connection.write(RESLEncoder.bulk(String(parts[1].value) ?? ""));
        return;
      }
      case "SET": {
        if (parts.length < 3) {
          connection.write(
            RESLEncoder.error("ERROR wrong numbers of arguments"),
          );
          return;
        }

        let ttlCommand: string | null = null;
        let ttl: number | null = null;
        if (parts.length === 5) {
          ttlCommand = String(parts[3].value).toUpperCase();
          ttl = Number(parts[4].value);

          if (
            (ttlCommand !== "EX" && ttlCommand !== "PX") ||
            !Number.isInteger(ttl) ||
            ttl <= 0
          ) {
            connection.write(
              RESLEncoder.error("ERROR syntax error"),
            );
            return;
          }
        } else if (parts.length !== 3) {
          connection.write(
            RESLEncoder.error("ERROR wrong numbers of arguments"),
          );
          return;
        }

        setData(
          String(parts[1].value),
          String(parts[2].value),
          ttlCommand,
          ttl,
        );
        connection.write(RESLEncoder.simple("OK"));
        return;
      }
      case "GET": {
        if (parts.length !== 2) {
          connection.write(
            RESLEncoder.error("ERROR wrong number of arguments"),
          );
          return;
        }
        const value = getData(String(parts[1].value));
        connection.write(RESLEncoder.bulk(value));
        return;
      }

      case "RPUSH": {
        if(parts.length < 2) {
          connection.write(RESLEncoder.error("ERROR worng number of arguments"));
        }
        const value = list.rpush(String(parts[1].value));
        connection.write(RESLEncoder.integer(value));
        return;
      }

      case "LPUSH": {
        if(parts.length < 2) {
          connection.write(
            RESLEncoder.error("ERROR wrong number of arguments")
          )
        }
        const value = list.lpush(String(parts[1].value));
        connection.write(RESLEncoder.integer(value));
        return;
      }
      default:
        connection.write(RESLEncoder.simple("wrong argument"));
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
