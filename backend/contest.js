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

const data = require('../../../tils/data')
const logger = require('../../../utils/logger')
const utils = require('../../utils/utils')

const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')

const mysql = require('mysql')
const pool = mysql.createPool(data.mysql_data('user'))

// BOARD START -------------------------------------------------

/**
 * request : board/contest/myPost {GET}
 */
 router.get('/myPost', function(req, res){
 
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 내가 쓴 게시판 불러오기 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT id, title, tag, writer_id, writer, date, like_user_id, join_user_id, state, join_count FROM contest WHERE writer_id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error
      
      connection.release()

      if (results.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      results = results.map((row) => {

        let tag_array = row.tag.split(',').map(String)

        if (row.tag == ''){
          tag_array = []
        }

        row.tag = tag_array

        let like_array = row.like_user_id.split(',').map(Number)

        if (row.like_user_id == ''){
          like_array = []
        }

        row.like_user_id = like_array

        let join_array =  row.join_user_id

        if ( row.join_user_id == ''){
          join_array = []
        }else{
          join_array = JSON.parse(row.join_user_id)
        }

        row.join_user_id = join_array

        return row
        
      })

      res.status(200).send(results)
    })
  })

})

/**
 * request : board/contest/myLike {GET}
 */
router.get('/myLike', function(req, res){
 
  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 내가 좋아요 누른 게시판 불러오기 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT id, title, tag, writer_id, writer, date, like_user_id, join_user_id, state, join_count FROM contest', function(error, results, fields){
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
 * request : board/contest {GET}
 */
router.get('/', function(req, res){

  logger.getInfo(req.session.userId + ', 게시판 전체 불러오기 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT id, title, tag, writer_id, writer, date, like_user_id, join_user_id, state, join_count FROM contest ORDER BY id DESC', function(error, results, fields){
      if (error) throw error
      
      connection.release()

      if (results.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      results = results.map((row) => {

        let tag_array = row.tag.split(',').map(String)

        if (row.tag == ''){
          tag_array = []
        }

        row.tag = tag_array

        let like_array = row.like_user_id.split(',').map(Number)

        if (row.like_user_id == ''){
          like_array = []
        }

        row.like_user_id = like_array

        let join_array = row.join_user_id

        if (row.join_user_id == ''){
          join_array = []
        }else{
          join_array = JSON.parse(row.join_user_id)
        }

        row.join_user_id = join_array

        return row
        
      })

      res.status(200).send(results)
    })
  })

})

/**
 * request : board/contest {POST} {params: title, tag, join_count, content}
 */
router.post('/', body('title').exists(), body('tag').exists(), body('join_count').exists(), body('content').exists(), function(req, res){
 
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }

  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const { title, join_count, content } = req.body
  const tag = req.body.tag.join(',')
  
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

      connection.query('INSERT INTO contest (title, tag, writer_id, writer, date, content, like_user_id, join_user_id, state, join_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, tag, req.session.userId, results1[0].fakename, date_, content, '', '', '신청 가능', join_count], function(error, results){
        if (error) throw error

        connection.release()

        res.status(200).send({id: results2.insertId})
      })
    })
  })

})

/**
 * request : board/contest/:id {GET}
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

    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      connection.release()

      if (results.length <= 0){
        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      let tag_array = results[0].tag.split(',').map(String)

      if (results[0].tag == ''){
        tag_array = []
      }

      results[0].tag = tag_array
      
      let like_array = results[0].like_user_id.split(',').map(Number)

      if (results[0].like_user_id == ''){
        like_array = []
      }

      results[0].like_user_id = like_array

      let join_array = results[0].join_user_id

      if (results[0].join_user_id == ''){
        join_array = []
      }else{
        join_array = JSON.parse(results[0].join_user_id)
      }

      results[0].join_user_id = join_array

      res.status(200).send(results[0])
    })
  })

})

/**
 * request : board/contest/:id {PUT} {params: title, tag, join_count, content}
 */
router.put('/:id', body('title').exists(), body('tag').exists(), body('join_count').exists(), body('content').exists(), function(req, res){
 
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

  const { title, join_count, content } = req.body
  const tag = req.body.tag.join(',')

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 특정 업데이트 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
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

      connection.query('UPDATE contest SET title = ?, tag = ?, join_count = ?, content = ? WHERE id = ?', [title, tag, join_count, content, id], function(error, resultss){
        if (error) throw error

        connection.release()

        //resultss[0].tag = resultss[0].tag.split(',')

        res.status(200).send('성공적으로 게시판을 수정했습니다.')
      })
    })
  })

})

/**
 * request : board/contest/:id {DELETE}
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

    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
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

      connection.query('SELECT id, join_board_id FROM profile', function(error, results, fields){
        if (error) throw error

        if (results.length <= 0){
          connection.release()
  
          res.status(400).send('잘못된 접근입니다. (데이터 오류)')
          return
        }
        
        results.forEach(function(item){
          let json_array = []

          if (!item.join_board_id || item.join_board_id == ''){
            json_array = []
          }else{
            json_array = JSON.parse(item.join_board_id)
          }
      
          if (json_array.filter(i => i.id == id)){
      
            json_array.splice(json_array.findIndex(i => i.id == id))
      
            connection.query('UPDATE profile SET join_board_id = ? WHERE id = ?', [JSON.stringify(json_array), item.id], function(error, results){
              if (error) throw error
            })
          }
        })
      })

      connection.query('DELETE FROM contest WHERE id = ?', [id], function(error, results, fields){
        if (error) throw error
  
        connection.release()
  
        res.status(200).send('성공적으로 게시판을 삭제했습니다.')
      })
    })
  })

})

/**
 * request : board/contest/:id/like {GET}
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

    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
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

        connection.query('UPDATE contest SET like_user_id = ? WHERE id = ?', [array.join(','), id], function(error, results){
          if (error) throw error
    
          connection.release()
    
          res.status(200).send('성공적으로 게시판 좋아요를 취소했습니다.')
        })

        return
      }

      array.push(req.session.userId)

      connection.query('UPDATE contest SET like_user_id = ? WHERE id = ?', [array.join(','), id], function(error, results){
        if (error) throw error
  
        connection.release()
  
        res.status(200).send('성공적으로 게시판 좋아요를 눌렀습니다.')
      })
    })
  })

})

/**
 * request : board/contest/:id/join {GET}
 */
router.get('/:id/join', function(req, res){

  if (!req.session.userId){
    res.status(400).send('잘못된 접근입니다. (세션 오류)')
    return
  }

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 특정 신청 취소 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      let json_array = []
      if (results[0].join_user_id == ''){
        json_array = []
      }else{
        json_array = JSON.parse(results[0].join_user_id)
      }

      if (json_array.filter(i => i.id == req.session.userId)){

        json_array.splice(json_array.findIndex(i => i.id == req.session.userId))

        connection.query('UPDATE contest SET join_user_id = ? WHERE id = ?', [JSON.stringify(json_array), id], function(error, results){
          if (error) throw error

          //connection.release()
    
          //res.status(200).send('성공적으로 게시판 신청을 취소했습니다.')
        })

      }

      //res.status(400).send('잘못된 접근입니다.')
    })

    connection.query('SELECT * FROM profile WHERE id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }
  
      let json_array = []

      if (!results[0].join_board_id || results[0].join_board_id == ''){
        json_array = []
      }else{
        json_array = JSON.parse(results[0].join_board_id)
      }
  
      if (json_array.filter(i => i.id == id)){
  
        json_array.splice(json_array.findIndex(i => i.id == id))

        connection.query('UPDATE contest SET state = ? WHERE id = ?', ['신청 가능', id], function(error, results){
          if (error) throw error
        })
  
        connection.query('UPDATE profile SET join_board_id = ? WHERE id = ?', [JSON.stringify(json_array), req.session.userId], function(error, results){
          if (error) throw error

          connection.release()
    
          res.status(200).send('성공적으로 게시판 신청을 취소했습니다.')
        })
  
        return
      }
  
      res.status(400).send('잘못된 접근입니다.')
    })
  })

})

/**
 * request : board/contest/:id/join {POST} {params: message}
 */
router.post('/:id/join', body('message').exists(), function(req, res){
 
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

  const message = req.body.message

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  logger.getInfo(req.session.userId + ', 게시판 특정 신청 API 감지')

  pool.getConnection(function(error, connection){
    if (error) throw error

    const date_ = logger.getYMD() + ' ' + logger.getHMS()

    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      let json_array = []

      if (!results[0].join_user_id || results[0].join_user_id == ''){
        json_array = []
      }else{
        json_array = JSON.parse(results[0].join_user_id)
      }

      let json = {}
      json.id = req.session.userId
      json.date = date_
      json.message = message
      json.state = '대기'
      json_array.push(json)

      connection.query('UPDATE contest SET join_user_id = ? WHERE id = ?', [JSON.stringify(json_array), id], function(error, results){
        if (error) throw error
      })

      if (json_array.length >= results[0].join_count){
        connection.query('UPDATE contest SET state = ? WHERE id = ?', ['신청 불가', id], function(error, results){
          if (error) throw error
        })
      }
    })

    connection.query('SELECT * FROM profile WHERE id = ?', [req.session.userId], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      let json_array_ = []

      if (!results[0].join_board_id || results[0].join_board_id == ''){
        json_array_ = []
      }else{
        json_array_ = JSON.parse(results[0].join_board_id)
      }
      let json_ = {}

      json_.id = Number(id)
      json_.date = date_
      json_.message = message
      json_.state = '대기'
      json_array_.push(json_)

      connection.query('UPDATE profile SET join_board_id = ? WHERE id = ?', [JSON.stringify(json_array_), req.session.userId], function(error, results){
        if (error) throw error
  
        connection.release()
  
        res.status(200).send('성공적으로 게시판 신청을 눌렀습니다.')
      })
    })
  })

})

/**
 * request : board/contest/:id/applications {GET}
 */
router.get('/:id/applications', function(req, res){

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  pool.getConnection(function(error, connection){
    if (error) throw error

    connection.query('SELECT join_user_id FROM contest WHERE id = ?', [id], function(error, results_1, fields){
      if (error) throw error

      if (results_1.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      const json_array = !results_1[0].join_user_id || results_1[0].join_user_id == '' ? [] : JSON.parse(results_1[0].join_user_id)

      const id_array = json_array.map((data) => data.id) 

      connection.query('SELECT * FROM profile WHERE id IN(?)', [id_array], function(error, results_2, fields){
        if (error) throw error

        connection.release()

        const result = json_array.map((data) => {
          return {id: data.id, date: data.date, fakename: results_2.find((profile) => {return data.id === profile.id}).fakename, message: data.message, state: data.state}
        })

        res.status(200).send(result)

      })
    })
  })

})

/**
 * request : board/contest/:id/accpet {POST} {params: ids}
 */
router.post('/:id/accept', body('ids').exists(), function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }

  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const ids = req.body.ids

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  console.log(ids)

  pool.getConnection(function(error, connection){
    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      let json_array = []

      if (results[0].join_user_id == ''){
        json_array = []
      }else{
        json_array = JSON.parse(results[0].join_user_id)
      }
      
      for (let i=0; i<ids.length; i++){
        for (let ii=0; ii<json_array.length; ii++){
          if (json_array[ii].id == ids[i]){
            connection.query('SELECT * FROM profile WHERE id = ?', [ids[i]], function(error, resultss, fields){
              if (error) throw error
          
              let json_array = []
              if (!resultss[0].join_board_id || resultss[0].join_board_id == ''){
                json_array = []
              }else{
                json_array = JSON.parse(resultss[0].join_board_id)
              }

              let test = json_array.map(row => {
                if (row.id == id){
                  row.state = '수락'
                }
                return row
              })
          
              connection.query('UPDATE profile SET join_board_id = ? WHERE id = ?', [JSON.stringify(test), ids[i]], function(error, results){
                if (error) throw error
              })
            })
            json_array[ii].state = '수락'
            console.log(json_array[ii])
          }
        }
      }

      connection.query('UPDATE contest SET join_user_id = ? WHERE id = ?', [JSON.stringify(json_array), id], function(error, results){
        if (error) throw error

        connection.release()
      })

      
      res.status(200).send('성공적으로 게시판 공모전 신청을 수락했습니다.')
    })
  })

})

/**
 * request : board/contest/:id/reject {POST} {params: ids}
 */
router.post('/:id/reject', body('ids').exists(), function(req, res){

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return param + ': ' + msg
  }

  const result = validationResult(req).formatWith(errorFormatter)

  if (!result.isEmpty()){
    res.status(400).send(result.array().toString())
    return
  }

  const ids = req.body.ids

  const id = req.params.id

  if (!utils.isNumeric(id)){
    res.status(400).send('잘못된 접근입니다. (id 오류)')
    return
  }

  console.log(ids)

  pool.getConnection(function(error, connection){
    connection.query('SELECT * FROM contest WHERE id = ?', [id], function(error, results, fields){
      if (error) throw error

      if (results.length <= 0){
        connection.release()

        res.status(400).send('잘못된 접근입니다. (데이터 오류)')
        return
      }

      let json_array = []

      if (results[0].join_user_id == ''){
        json_array = []
      }else{
        json_array = JSON.parse(results[0].join_user_id)
      }

      for (let i=0; i<ids.length; i++){
        for (let ii=0; ii<json_array.length; ii++){
          if (json_array[ii].id == ids[i]){
            connection.query('SELECT * FROM profile WHERE id = ?', [ids[i]], function(error, resultss, fields){
              if (error) throw error
          
              let json_array = []
              if (!resultss[0].join_board_id || resultss[0].join_board_id == ''){
                json_array = []
              }else{
                json_array = JSON.parse(resultss[0].join_board_id)
              }

              let test = json_array.map(row => {
                if (row.id == id){
                  row.state = '거절'
                }
                return row
              })
          
              connection.query('UPDATE profile SET join_board_id = ? WHERE id = ?', [JSON.stringify(test), ids[i]], function(error, results){
                if (error) throw error
              })
            })
            json_array[ii].state = '거절'
            console.log(json_array[ii])
          }
        }
      }
      
      connection.query('UPDATE contest SET join_user_id = ? WHERE id = ?', [JSON.stringify(json_array), id], function(error, results){
        if (error) throw error

        connection.release()
      })
      
      res.status(200).send('성공적으로 게시판 공모전 신청을 거절했습니다.')
    })
  })

})

module.exports = router
