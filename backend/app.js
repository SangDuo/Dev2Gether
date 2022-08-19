/**
 *
 *            888                                               .d8888b.   .d8888b.
 *          888                                               d88P  Y88b d88P  Y88b
 *         888                                                     .d88P 888
 *     .d88888  .d88b.  888  888        888  888 .d8888b         8888"  888d888b.
 *   d88" 888 d8P  Y8b 888  888       888  888 88K               "Y8b. 888P "Y88b
 *  888  888 88888888 Y88  88P      888  888 "Y8888b.      888    888 888    888
 *  Y88b 888 Y8b.      Y8bd8P       Y88b 888      X88      Y88b  d88P Y88b  d88P
 *  "Y88888  "Y8888    Y88P         "Y88888  88888P'       "Y8888P"   "Y8888P"
 *                                     888
 *                               Y8b d88P
 *                                "Y88P"
 *
 * @author dev-ys-36
 * @link https://github.com/dev-ys-36
 * @license MIT LICENSE
 *
 * The copyright indication and this authorization indication shall be
 * recorded in all copies or in important parts of the Software.
 *
 */

const express = require('express')
const expressSession = require('express-session')
const FileStore = require('session-file-store')(expressSession)

const app = express()

const cors = require('cors')

const http = require('http')

const contestjs = require(__dirname + '/router/api/board/contest')
const freejs = require(__dirname + '/router/api/board/free')

const apijs = require(__dirname + '/router/api/api')
const authjs = require(__dirname + '/router/auth/auth')
const settingjs = require(__dirname + '/router/setting/setting')

const logger = require(__dirname + '/utils/logger')

const HTTP_PORT = 1212

app.use(cors({ origin: 'http://163.44.181.194', credentials: true }))

app.use(
  expressSession({
    secret: '1234',
    resave: false,
    saveUninitialized: true,
    store: new FileStore({logFn: function(){}})
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

app.use(function(req, res, next){ 
  logger.userInfo(req)
  next()
})

app.use('/api/board/contest', contestjs)
app.use('/api/board/free', freejs)

app.use('/api', apijs)
app.use('/auth', authjs)
app.use('/setting', settingjs)

app.use('*', function(req, res){ res.status(404).send('URL: ' + req.originalUrl + ' is not found.') })

http.createServer(app).listen(HTTP_PORT, '0.0.0.0')

logger.getLogo()
