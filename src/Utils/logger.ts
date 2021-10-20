const logger = {
  log: (...args: any) => {
    console.log(...args);
  },
  error: (...args: any) => {
    console.error(...args);
  },
  info: (...args: any) => {
    console.info(...args);
  },
};

export { logger };
