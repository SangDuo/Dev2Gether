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

router.post('/profile', body('email').exists().isLength({ min: 6, max: 30 }), body('realname').exists().isLength({ max: 4 }), body('fakename').exists().isLength({ max: 8 }), body('phonenum').exists().isLength({ min: 13, max: 13 }), function(req, res){
  
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg;
  };

  const result = validationResult(req).formatWith(errorFormatter);

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }
  
  const { email, realname, fakename, phonenum } = req.body

  logger.getInfo(req.session.userId + ', 프로필 셋팅 API 감지')

  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('UPDATE auth SET email = ?  WHERE id = ?', [email, req.session.userId], function(error, results){
      if (error) throw error
    })

    connection.query('UPDATE profile SET realname = ?, fakename = ?, phonenum = ?  WHERE id = ?', [realname, fakename, phonenum, req.session.userId], function(error, results){
      if (error) throw error
    })

    connection.query('UPDATE contest SET writer = ?  WHERE writer_id = ?', [fakename, req.session.userId], function(error, results){
      if (error) throw error
    })

    connection.query('SELECT * FROM auth WHERE id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error

      connection.release()

      if (results.length <= 0){
        res.status(400).send('계정이 존재하지 않습니다.')
        return
      }

      res.status(200).send({
        id: req.session.userId,
        username: results[0].username,
        email: email,
        realname: realname,
        fakename: fakename,
        phonenum: phonenum
      })
    })
  })
  
})

router.post('/introduction', body('introduction').exists(), function(req, res){
  
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }
  
  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const introduction = req.body.introduction

  console.log(req.body)

  logger.getInfo(req.session.userId + ', 자기 소개서 셋팅 API 감지')

  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('UPDATE profile SET introduction = ? WHERE id = ?', [introduction, req.session.userId], function(error, results){
      if (error) throw error
    })

    connection.query('SELECT * FROM profile WHERE id = ?', [req.session.userId], function(error, results){
      if (error) throw error

      connection.release()

      if (results.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      res.status(200).send(results[0])
    })
  })
  
})

module.exports = router
