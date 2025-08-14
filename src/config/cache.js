const Valkey = require('iovalkey');

const cache = new Valkey({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT,
});

module.exports = cache;
