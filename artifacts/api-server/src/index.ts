import app from "./app";
import { logger } from "./lib/logger";

const requestedPort = Number(process.env["PORT"] ?? "3000");

if (Number.isNaN(requestedPort) || requestedPort <= 0) {
  throw new Error(`Invalid PORT value: "${process.env["PORT"] ?? "3000"}"`);
}

function listenOnPort(port: number): void {
  const server = app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE" && port === requestedPort) {
      const fallbackPort = port + 1;
      logger.warn(
        { requestedPort: port, fallbackPort },
        "Port already in use, retrying on fallback port",
      );
      listenOnPort(fallbackPort);
      return;
    }

    logger.error({ err }, "Error listening on port");
    process.exit(1);
  });
}

listenOnPort(requestedPort);
