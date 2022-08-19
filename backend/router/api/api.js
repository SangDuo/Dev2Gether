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
const utils = require('../../utils/utils')

const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')

const mysql = require('mysql')
const pool = mysql.createPool(data.mysql_data('user'))

/**
 * request : session {GET}
 */
router.get('/session', function(req, res){

  logger.getInfo(req.session.userId + ', 세션 API 감지')

  if (!req.session.userId){
    res.status(400).send('비정상적인 접근입니다. (세션 오류)')
    return
  }

  res.status(200).send('정상적인 접근입니다. (세션 오류)')

})

/**
 * request : getProfile {GET}
 */
router.get('/getProfile', function(req, res){

  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 프로필 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM profile WHERE id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }
      
      const json_array = results[0].join_board_id == '' ? [] : JSON.parse(results[0].join_board_id)
      const id_array = json_array.map((data) => data.id)

      if (id_array == ''){
        connection.release()

        res.status(200).send([])

        return
      }

      connection.query('SELECT * FROM contest WHERE id IN(?)', [id_array], function(error, resultss, fields){
        if (error) throw error

        connection.release()

        const result = json_array.map((data) => {
          return {id: data.id, date: data.date, title: resultss.find((post) => {return data.id === post.id}).title, message: data.message, state: data.state}
        })

        res.status(200).send(result)
      })
    })
  })

})

/**
 * request : getProfile {POST} {params: id}
 */
router.post('/getProfile', body('id').exists(), function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }
  
  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const id = req.body.id

  logger.getInfo(id + ', 프로필 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM profile WHERE id = ?', [id], function(error, results, fields){
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

/**
 * request : getResume {POST} {params: id}
 */
router.post('/getResume', body('id').exists(), function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }

  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const id = req.body.id

  logger.getInfo(id + ', 이력서 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM resume WHERE id = ?', [id], function(error, results, fields){
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
