#!/usr/bin/env node

'use strict';

require('../lib/env');

const app = require('../config/server');
const server = app.listen(process.env.PORT, process.env.HOST, ~~process.env.BACKLOG, function() {
  process.send && process.send({message: 'online', address: server.address().address, port: server.address().port});
});

server.timeout = ~~process.env.TIMEOUT;
