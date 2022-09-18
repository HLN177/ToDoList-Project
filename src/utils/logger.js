const pino = require('pino');
const pretty = require('pino-pretty');
const dayjs = require('dayjs');

const stream = pretty({
  colorize: true
});

const pinoConfig = {
  base: {
    pid: false
  },
  timestamp: () => `,"time": "${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`
};

const log = pino(pinoConfig, stream);

module.exports = log;