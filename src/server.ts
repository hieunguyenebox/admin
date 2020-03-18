require('module-alias/register')
require('dotenv').config()

import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import { Strategy } from 'passport-local'
import dayjs from 'dayjs'
import compression from 'compression'
import bootstrap from './bootstrap'
import { signIn } from './modules/sign-in'
import { User } from './modules/models/types'
import { Req } from 'request'
import { findOneById, createAdmin } from './modules/user'
import { buildSchema } from 'graphql'
import path from 'path'
import fs from 'fs'
import graphqlHTTP from 'express-graphql'
import * as resolvers from './resolvers'
import connectMongoDB from 'connect-mongodb-session'
import { getDBUri } from 'modules/db'

const MongoStore = connectMongoDB(session)
const port = parseInt(process.env.NODE_PORT, 10) || 3000
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const app = next({ dev: IS_PRODUCTION === false })
const handle = app.getRequestHandler()
const SessionStore = new MongoStore({
  uri: getDBUri(),
  databaseName: process.env.DB_NAME,
  collection: 'sessions'
}, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log('==== connected to session store ====')
  }
})

passport.use(new Strategy(signIn))
passport.serializeUser((user: User, done: any) => {
  done(null, user.id)
})
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findOneById(id)
    done(null, user)
  } catch (ex) {
    done(null, null)
  }
})

app.prepare().then(async () => {
  const server = express()
  bootstrap(server)

  /** ===============
   * setup essential libs
   * =================
   */
  server.set('trust proxy', 1)
  server.use(compression())
  server.use(session({
    secret: process.env.SESSION_SECRET,
    store: SessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    name: "anonymous",
    // rolling: true, //reset cookie maxage every request
    cookie: {
      secure: IS_PRODUCTION,
      httpOnly: true,
      expires: dayjs().add(7, 'day').toDate()
    }
  }))
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())
  server.use(passport.initialize())
  server.use(passport.session())


  server.post('/signin', (req: Req, res) => {
    const auth = passport.authenticate('local', (_, user, err) => {
      if (err) {
        res.status(401).send(err.message)
      }
      req.logIn(user, () => { })
      res.sendStatus(200)
    })

    auth(req, res)
  })

  server.get('/signout', (req: Req, res) => {
    req.logout()
    res.sendStatus(200)
  })

  server.get('/hello', (req, res) => {
    createAdmin()
    res.sendStatus(200)
  })

  /** =============
   * setup graphql
   * ===============
   */
  server.use('/graphql', graphqlHTTP(req => {
    const schemaPath = path.join(__dirname, 'schema.gql')
    return {
      schema: buildSchema(fs.readFileSync(schemaPath, 'utf8')),
      rootValue: resolvers,
      graphiql: IS_PRODUCTION === false,
      customFormatErrorFn: (err: any) => {
        try {
          const { message, statusCode } = JSON.parse(err.message)
          return { message, statusCode }
        } catch (ex) {
          //
        }
        return { message: err.message }
      }
    }
  }))

  // for health check
  server.get('/health', (_, res) => {
    res.sendStatus(200)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
