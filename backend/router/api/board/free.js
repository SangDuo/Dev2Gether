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

const data = require('../../../utils/data')
const logger = require('../../../utils/logger')
const utils = require('../../../utils/utils')

const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')

const mysql = require('mysql')
const pool = mysql.createPool(data.mysql_data('user'))

// FREE BOARD START -------------------------------------------------

/**
 * request : board/free/myPost {GET}
 */
 router.get('/myPost', function(req, res){
 
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 내가 쓴 게시판 불러오기 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT id, title, writer_id, writer, date, like_user_id FROM free WHERE writer_id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error
      
      connection.release()

      if (results.length <= 0){
        res.status(200).send([])
        return
      }

      results = results.map((row) => {

        let like_array = row.like_user_id.split(',').map(Number)

        if (row.like_user_id == ''){
          like_array = []
        }

        row.like_user_id = like_array

        return row
        
      })

      res.status(200).send(results)
    })
  })

})

/**
 * request : board/free/myLike {GET}
 */
router.get('/myLike', function(req, res){
 
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 내가 좋아요 누른 게시판 불러오기 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT id, title, writer_id, writer, date, like_user_id FROM free', function(error, results, fields){
      if (error) throw error

      connection.release()

      if (results.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      let result_ = []

      results.forEach(function(item){
        let array = item.like_user_id.split(',').map(Number)

        if (item.like_user_id == ''){
          array = []
        }

        if (array.includes(req.session.userId)){
          result_.push(item)
        }
      })

      res.status(200).send(result_)
    })
  })

})

/**
 * request : board/free {GET}
 */
router.get('/', function(req, res){

  logger.getInfo(req.session.userId + ', 게시판 전체 불러오기 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT id, title, writer_id, writer, date, like_user_id FROM free ORDER BY id DESC', function(error, results, fields){
      if (error) throw error
      
      connection.release()

      if (results.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      results = results.map((row) => {

        let like_array = row.like_user_id.split(',').map(Number)

        if (row.like_user_id == ''){
          like_array = []
        }

        row.like_user_id = like_array

        return row
        
      })

      res.status(200).send(results)
    })
  })

})

/**
 * request : board/free {POST} {params: title, content}
 */
router.post('/', body('title').exists(), body('content').exists(), function(req, res){
 
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }

  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const { title, content } = req.body
  
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 작성 API 감지')

  const date_ = logger.getYMD() + ' ' + logger.getHMS()

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM profile WHERE id = ?', [req.session.userId], function(error, results1, fields){
      if (error) throw error

      if (results1.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      connection.query('INSERT INTO free (title, writer_id, writer, date, content, like_user_id) VALUES (?, ?, ?, ?, ?, ?)', [title, req.session.userId, results1[0].fakename, date_, content , ''], function(error, results){
        if (error) throw error

        connection.release()

        res.status(200).send({id: results.insertId})
      })
    })
  })

})

/**
 * request : board/free/:id {GET}
 */
router.get('/:id', function(req, res){

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 특정 불러오기 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM free WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      connection.release()

      if (results.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }
      
      let like_array = results[0].like_user_id.split(',').map(Number)

      if (results[0].like_user_id == ''){
        like_array = []
      }

      results[0].like_user_id = like_array

      res.status(200).send(results[0])
    })
  })

})

/**
 * request : board/free/:id {PUT} {params: title, content}
 */
router.put('/:id', body('title').exists(), body('content').exists(), function(req, res){
 
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }

  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const { title, content } = req.body

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 특정 업데이트 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM free WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      if (results[0].writer_id != req.session.userId){
        connection.release()
        
        res.status(400).send('본인 게시판만 수정할 수 있습니다.')
        return
      }

      connection.query('UPDATE free SET title = ?, content = ? WHERE id = ?', [title, content, id], function(error, resultss){
        if (error) throw error

        connection.release()

        //resultss[0].tag = resultss[0].tag.split(',')

        res.status(200).send('성공적으로 게시판을 수정했습니다.')
      })
    })
  })

})

/**
 * request : board/free/:id {DELETE}
 */
router.delete('/:id', function(req, res){
 
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 특정 삭제 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM free WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error
      
      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      if (results[0].writer_id != req.session.userId){
        connection.release()
        
        res.status(400).send('본인 게시판만 삭제할 수 있습니다.')
        return
      }

      connection.query('DELETE FROM free WHERE id = ?', [id], function(error, results, fields){
        if (error) throw error
  
        connection.release()
  
        res.status(200).send('성공적으로 게시판을 삭제했습니다.')
      })
    })
  })

})

/**
 * request : board/free/:id/like {GET}
 */
router.get('/:id/like', function(req, res){
 
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 특정 좋아요 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM free WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }
      
      let array = results[0].like_user_id.split(',').map(Number)

      if (!results[0].like_user_id || results[0].like_user_id == ''){
        array = []
      }

      if (array.includes(req.session.userId)){

        array.splice(array.indexOf(req.session.userId))

        connection.query('UPDATE free SET like_user_id = ? WHERE id = ?', [array.join(','), id], function(error, results){
          if (error) throw error
    
          connection.release()
    
          res.status(200).send('성공적으로 게시판 좋아요를 취소했습니다.')
        })

        return
      }

      array.push(req.session.userId)

      connection.query('UPDATE free SET like_user_id = ? WHERE id = ?', [array.join(','), id], function(error, results){
        if (error) throw error
  
        connection.release()
  
        res.status(200).send('성공적으로 게시판 좋아요를 눌렀습니다.')
      })
    })
  })

})

// FREE BOARD END -------------------------------------------------

module.exports = router
