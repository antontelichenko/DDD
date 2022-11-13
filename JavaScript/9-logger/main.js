'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./static.js');
const load = require('./load.js');
const config = require('./config');
const server = require(`./${config.transport}.js`);
const fastifyServer = require(`./fastifyServer`);
const db = require('./db.js')(config.pgConfig);
const hash = require('./hash.js');
const logger = require('./logger.js');
const pinoLogger = require('pino')();

const sandbox = {
  console: Object.freeze(config.customLogger ? pinoLogger : logger),
  db: Object.freeze(db),
  common: { hash },
};
const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[serviceName] = await load(filePath, sandbox);
  }

  staticServer('./static', config.staticPort);
  if (config.framework === 'native') {
    server(routing, config.apiPort);
  } else {
    fastifyServer(routing, config.apiPort)
  }
})();
