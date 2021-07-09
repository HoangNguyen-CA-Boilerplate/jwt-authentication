const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/User');

//get public key from environment variables
const PUB_KEY = Buffer.from(process.env.PUB_KEY, 'base64').toString('utf8');

//verifying jwt options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = User.findById(payload.sub);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (e) {
    done(e, null);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};
