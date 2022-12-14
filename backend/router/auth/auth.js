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

const data = require('../../utils/data')
const logger = require('../../utils/logger')

const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')

const mysql = require('mysql')
const pool = mysql.createPool(data.mysql_data('user'))

router.post('/register', body('username').exists().isLength({ min: 6, max: 30 }), body('email').exists().isEmail().isLength({ min: 6, max: 30 }), body('password').exists().isLength({ min: 6, max: 30 }), body('realname').exists().isLength({ max: 4 }), body('fakename').exists().isLength({ max: 8 }), body('phonenum').exists().isLength({ min: 13, max: 13 }), function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg;
  };
  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const { username, email, password, realname, fakename, phonenum } = req.body

  if (req.session.userId){
    res.status(400).send('????????? ???????????????. (?????? ??????)')
    return
  }

  /*if ((username.length < 6 && username.length > 30) || (email.length < 6 && email.length > 30) || (password.length < 6 && password.length > 30)){
    res.status(400).send({ result: '?????? 6??????, ?????? 30 ?????? ?????? ????????? ???????????????.' })
    return
  }*/

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM auth WHERE username = ?', [username], function(error, results, fields){
      if (error) throw error

      if (results.length > 0){
        res.status(400).send('?????? ????????? ????????????.')
        return
      }

      const date_ = logger.getYMD() + ' ' + logger.getHMS()

      connection.query('INSERT INTO profile (realname, fakename, phonenum) VALUES (?, ?, ?)', [realname, fakename, phonenum], function(error, results){
        if (error) throw error
      })

      connection.query('INSERT INTO resume () VALUES ()', [], function(error, results){
        if (error) throw error
      })

      connection.query('INSERT INTO auth (username, email, password, first_date, last_date) VALUES (?, ?, ?, ?, ?)', [username, email, password, date_, date_], function(error, results){
        if (error) throw error

        connection.release()
      })

      logger.getInfo('???????????? ??????')

      res.status(200).send('??????????????? ????????? ?????? ???????????????.')
    })
  })

})

router.post('/login', body('username').exists().isLength({ min: 6, max: 30 }), body('password').exists().isLength({ min: 6, max: 30 }), function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg;
  };

  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const { username, password } = req.body

  /*if (req.session.userId){
    res.status(400).send({ result: '????????? ???????????????. (?????? ??????)' })
    return
  }*/

  /*if (username.length > 30 || password.length > 30){
    res.status(400).send({ result: '?????? ?????? ??????????????????.' })
    return
  }*/

  pool.getConnection(function(error, connection){
    if (error) throw error

    const date_ = logger.getYMD() + ' ' + logger.getHMS()

    connection.query('SELECT * FROM auth WHERE username = ? AND password = ?', [username, password], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        res.status(400).send('????????? ???????????? ????????????.')
        return
      }

      connection.query('UPDATE auth SET last_date = ? WHERE id = ?', [date_, results[0].id], function(error, results){
        if (error) throw error
      })

      req.session.userId = results[0].id;
      req.session.save(function(error){
        if (error) throw error
      })

      connection.query('SELECT * FROM profile WHERE id = ?', [req.session.userId], function(error, resultss, fields){
        if (error) throw error

        connection.release()

        res.status(200).send({ 
          id: req.session.userId,
          username: results[0].username,
          email: results[0].email,
          realname: resultss[0].realname,
          fakename: resultss[0].fakename,
          phonenum: resultss[0].phonenum,
          introduction: resultss[0].introduction
        })
      })

      logger.getInfo(req.session.userId + ', ????????? ??????')
    })
  })

})

router.get('/logout', function(req, res){

  // if (!req.session.userId){
  //   res.status(400).send({ result: '????????? ???????????????. (?????? ??????)' })
  //   return
  // }

  logger.getInfo(req.session.userId + ', ???????????? ??????')

  req.session.destroy(function(error){
    if (error) throw error

    res.status(200).send('??????????????? ????????? ???????????? ???????????????.')
  })

})

router.post('/passwordCheck', function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg;
  };

  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const { password } = req.body

  if (!req.session.userId){
    res.status(400).send('????????? ???????????????. (?????? ??????)')
    return
  }

  logger.getInfo(req.session.userId + ', ???????????? ?????? ??????')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM auth WHERE id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error

      connection.release()

      if (results.length <= 0){
        res.status(400).send('????????? ???????????? ????????????.')
        return
      }

      if (results[0].password != password){
        res.status(400).send('??????????????? ???????????? ????????????.')
        return
      }
      
      res.status(200).send('??????????????? ???????????????.')
    })
  })

})

router.post('/passwordChange', function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg;
  };
  
  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const { password } = req.body

  if (!req.session.userId){
    res.status(400).send('????????? ???????????????. (?????? ??????)')
    return
  }

  logger.getInfo(req.session.userId + ', ???????????? ?????? ??????')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM auth WHERE id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        res.status(400).send('????????? ???????????? ????????????.')
        return
      }

      if (results[0].password == password){
        res.status(400).send('?????? ??????????????? ???????????????.')
        return
      }

      connection.query('UPDATE auth SET password = ?  WHERE id = ?', [password, results[0].id], function(error, results){
        if (error) throw error

        connection.release()
      })

      res.status(200).send('??????????????? ??????????????? ??????????????????.')
    })
  })
})

module.exports = router
