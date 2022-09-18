const createServer = require('./utils/server');
const config = require('config');
const logger = require('./utils/logger');
const { connectToServer } = require('./db/connect');

const app = createServer();
const port = config.get('serverConfig.port');

app.listen(port, async () => {
  logger.info(`Server is running at ${port}`);
  await connectToServer();
});