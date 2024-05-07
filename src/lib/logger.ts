import pino, { type Logger } from "pino";

let logger: Logger;

export const getLogger = () => {
  if (!logger) {
    logger = pino({
      level: "debug",
      formatters: {
        level(label) {
          return { level: label.toUpperCase() };
        },
      },
    });
  }
  return logger;
};
