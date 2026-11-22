# Redis Server in TypeScript

A small Redis-compatible server built as a solution to the [CodeCrafters Build Your Own Redis challenge](https://codecrafters.io/challenges/redis). It listens for client connections over TCP, parses commands encoded with the Redis Serialization Protocol (RESP), and sends RESP replies.

## Current features

- `PING` replies with `PONG`.
- `ECHO <message>` returns the supplied message.
- `SET <key> <value>` stores a string value.
- `GET <key>` returns a stored value, or a null bulk reply when the key is missing.
- Data is held in an in-memory map and is shared by clients while the server process is running.

This is an educational implementation, not a full Redis replacement. Data is not persisted across restarts, and only the commands listed above are implemented.

## Requirements

- [Bun](https://bun.sh/) (the project uses Bun to run TypeScript)

## Run the server

Install dependencies:

```sh
bun install
```

Start the server on port `6379`:

```sh
bun run dev
```

The CodeCrafters launcher is also available:

```sh
./your_program.sh
```

Connect with `redis-cli` or another RESP-compatible client. For example:

```sh
redis-cli -p 6379 PING
redis-cli -p 6379 SET greeting "hello"
redis-cli -p 6379 GET greeting
redis-cli -p 6379 ECHO "hello from Redis"
```

## Project structure

- `app/main.ts` — TCP server, RESP command handling, and in-memory key-value store.
- `package.json` — package metadata, dependencies, and the `dev` script.
- `your_program.sh` — CodeCrafters-compatible launcher.
- `codecrafters.yml` — CodeCrafters project configuration.

## Submit to CodeCrafters

Use the CodeCrafters CLI from the project directory:

```sh
codecrafters submit
```
