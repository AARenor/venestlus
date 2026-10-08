'use strict';

const { createApp } = require('./src/server');

const port = Number(process.env.PORT || 3000);
const server = createApp();

server.listen(port, '0.0.0.0', () => {
  console.log(`Venestlus listening on :${port}`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref();
  });
}
