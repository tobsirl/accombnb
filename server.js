const express = require('express');
const next = require('next');
const session = require('express-session');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  // Log error with redis
  redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
  });

  server.use(
    session({
      secret: 'thecakeisalie',
      resave: false,
      saveUninitialized: true,
      name: 'accombnb',
      cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
      store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient,
        ttl: 86400,
      }),
    })
  );

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
