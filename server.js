const express = require('express');
const next = require('next');
const session = require('express-session');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, done) {
      if (!email || !password) {
        done('Email and password required', null);
        return;
      }

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        done('User not found', null);
        return;
      }

      const valid = await user.isPasswordValid(password);

      if (!valid) {
        done('Email and password do not match', null);
        return;
      }

      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ where: { email: email } }).then((user) => {
    done(null, user);
  });
});

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
    }),

    passport.initialize(),
    passport.session()
  );

  // routes
  server.post('/api/auth/register', async (req, res) => {
    const { email, password, passwordconfirmation } = req.body;

    if (password !== passwordconfirmation) {
      res.end(
        JSON.stringify({ status: 'error', message: 'Passwords do not match' })
      );
      return;
    }

    try {
      const user = await User.create({ email, password });
      res.end(JSON.stringify({ status: 'success', message: 'User added' }));
    } catch (error) {
      res.statusCode = 500;
      let message = 'An error occurred';
      if (error.name === 'SequelizeUniqueConstraintError') {
        message = 'User already exists';
      }
      res.end(JSON.stringify({ status: 'error', message }));
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
