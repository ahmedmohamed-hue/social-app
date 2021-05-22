import passport from 'passport'
import LocalStartegy from 'passport-local'
import FacebookStargy, { StrategyOptionWithRequest } from 'passport-facebook'
import { prisma } from '..'
import { verify } from 'argon2'

const user = {
  username: 'admin',
  password: 'admin',
}

const local = LocalStartegy.Strategy

passport.use(
  new local(async (username, password, done) => {
    const user = await prisma.user.findUnique({ where: { email: username } })

    if (!user) {
      return done(null, false, { message: 'No user exits' })
    }

    const verfied = await verify(user.password, password)

    if (!verfied) return done(null, false, { message: 'Wrong password' })

    return done(null, user)
  })
)
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user as any)
})

const fbConfig: StrategyOptionWithRequest = {
  clientID: '758771334810657',
  clientSecret: '46979eb7893835388bfe23e83898f8fa',
  callbackURL: 'http://localhost:4000/auth/facebook/callback',
  passReqToCallback: true,
}

passport.use(
  new FacebookStargy.Strategy(
    fbConfig,
    (accessToken, refreshToken, _, profile, done) => {
      console.log(profile)

      done(null, profile)
    }
  )
)
