const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const authConfig = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    clientSecret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
    callbackURL: process.env.REACT_APP_AUTH0_CALLBACK_URL
  };

passport.use(new Auth0Strategy(authConfig,
  function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
