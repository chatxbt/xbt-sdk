import { createConsola } from "consola";

const logger = createConsola({
  level: process.env.NODE_ENV === 'development' && process.env.DEBUG ? -999 : 2,
});

logger.wrapConsole();

export default logger;