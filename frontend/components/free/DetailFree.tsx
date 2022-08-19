import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import axios, { AxiosError, AxiosResponse } from 'axios'
import Router from 'next/router'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Free } from '../../redux/silces/boardSlice'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import {
  setLoading,
  setModal,
  setSnackBar,
} from '../../redux/silces/alertSlice'
import styled from '@emotion/styled'
import { Box } from '@mui/system'
import PersonIcon from '@mui/icons-material/Person'
import { motion } from 'framer-motion'
import { Menu } from '../../pages/board/free/[id]'
import { Profile } from '../../redux/silces/userSlice'

const Body = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    display: block;
    width: 100%;
    height: auto;
  }

  & #detail {
    display: flex;
    margin-top: 4rem;
    width: 100%;
    column-gap: 1.5rem;
    justify-content: center;
  }

  & #section {
    background-color: #f5f5f5;
    border: 0.1rem solid #e2e2e2;
  }
`

const DetailFree: FunctionComponent<{ id: number }> = ({ id }) => {
  const [post, setPost] = useState<Free>()
  const [modal_1, setModal_1] = useState(false)
  const [user_1, setUser_1] = useState<Profile>()
  const dispatch = useDispatch()
  const user = useSelector((store: RootState) => {
    return store.user.profile
  })

  const fetchPost = useCallback(() => {
    axios
      .get(`http://163.44.181.194:1212/api/board/free/${id}`)
      .then((response: AxiosResponse<Free>) => {
        dispatch(setLoading(false))
        setPost(response.data)
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch, id])

  const likeHandler = useCallback(() => {
    dispatch(setLoading(true))

    axios
      .get(`http://163.44.181.194:1212/api/board/free/${post?.id}/like`)
      .then((response) => {
        fetchPost()
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch, fetchPost, post?.id])

  useEffect(() => {
    dispatch(setLoading(true))
    fetchPost()
  }, [dispatch, fetchPost])

  return (
    <Body>
      <Head>
        {post ? <title>{post?.title}</title> : <title>로딩 중</title>}
      </Head>
      <motion.div
        id="detail"
        initial={{ opacity: 0, filter: 'blur(px)' }}
        animate={{
          opacity: 1,
          filter: 'blur(0px)',
          transition: { duration: 1 },
        }}
      >
        <div
          style={{
            width: '14rem',
            maxWidth: 360,
            height: '22rem',
            backgroundColor: '#f5f5f5',
            border: '0.1rem solid #e2e2e2',
          }}
        >
          <Box justifyContent="center" sx={{ m: '40px 0px 0px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <Avatar
                className="profile"
                alt=""
                sx={{ width: '3rem', height: '3rem' }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
            </div>
            <div
              style={{
                fontFamily: 'nanumSquare',
                textAlign: 'center',
                fontWeight: 'bold',
                margin: '10px',
                fontSize: '1.4rem',
              }}
            >
              <Button
                onClick={() => {
                  dispatch(setLoading(true))
                  axios
                    .post('http://163.44.181.194:1212/api/getProfile', {
                      id: post?.writer_id,
                    })
                    .then((response: AxiosResponse<Profile>) => {
                      setUser_1(response.data)
                      dispatch(setLoading(false))
                      setModal_1(true)
                    })
                    .catch((error: AxiosError<string>) => {
                      dispatch(setLoading(false))
                      dispatch(setModal([true, error.response?.data as string]))
                    })
                }}
                sx={{
                  fontSize: '1rem',
                  fontFamily: 'nanumSquare',
                  fontWeight: 'bold',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#92929223',
                  },
                }}
              >
                {post?.writer}
              </Button>
            </div>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ marginRight: '1.2rem' }}>
              <IconButton aria-label="like" size="large" onClick={likeHandler}>
                {post?.like_user_id.includes(user?.id as number) ? (
                  <FavoriteIcon sx={{ color: 'red' }} fontSize="inherit" />
                ) : (
                  <FavoriteBorderIcon fontSize="inherit" />
                )}
              </IconButton>
              <b>{post?.like_user_id.length}개</b>
            </div>
          </Box>
        </div>
        <motion.div
          id="section"
          style={{
            width: '58rem',
          }}
          initial={{ opacity: 0, filter: 'blur(px)' }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            transition: { duration: 1 },
          }}
        >
          <Box sx={{ m: '30px 30px' }}>
            <Box sx={{ m: '0' }}>
              <div
                style={{ fontWeight: 'bold', margin: '0', fontSize: '2.8rem' }}
              >
                {post?.title}
              </div>
            </Box>
            <Box sx={{ m: '20px 0px 0px' }}>
              <span
                style={{
                  textAlign: 'right',
                  margin: '0',
                  fontSize: '0.8rem',
                  color: '#727272',
                }}
              >
                DATE: {post?.date}
              </span>
              <div
                style={{
                  margin: '0',
                  fontSize: '0.8rem',
                  color: '#727272',
                  float: 'right',
                  lineHeight: '1.6',
                }}
              >
                URL: http://d2g.kro.kr/board/free/{post?.id}
              </div>
            </Box>
            <hr />
            <Box sx={{ m: '50px 0px 0px' }}>
              <div
                dangerouslySetInnerHTML={{ __html: post?.content as string }}
              ></div>
            </Box>
          </Box>
        </motion.div>
      </motion.div>
      {Router.asPath.includes('/board/free/') &&
        post &&
        post.writer === user?.fakename && (
          <Menu post={post} setPost={setPost} />
        )}

      <Dialog
        open={modal_1}
        onClose={() => {
          setModal_1(false)
        }}
        maxWidth="md"
        fullWidth
        sx={{
          '& img': {
            display: 'block',
            width: '100%',
            height: 'auto',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>
          {user?.id === user_1?.id ? '내 프로필' : '유저 프로필'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
          <Box>
              <Box
                sx={{ m: '5px 5px', display: 'flex', alignContent: 'center' }}
              >
                <div>
                  <Avatar className="profile" alt="">
                    <PersonIcon fontSize="large" />
                  </Avatar>
                </div>
                <div style={{ lineHeight: '2.5', margin: '0px 15px' }}>
                  {user_1?.fakename}
                </div>
              </Box>
              <hr />
              <Box sx={{ m: '5px 5px', bgcolor: '#f5f5f5' }}>
                <Box sx={{ m: '15px', p: '10px' }}>
                <div
                    style={{
                      fontWeight: 'bold',
                      margin: '0',
                      fontSize: '1.8rem',
                    }}
                  >
                    Introduction.
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: user_1?.introduction as string,
                    }}
                  ></div>
                </Box>
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {user?.id === user_1?.id && (
            <Button
              onClick={() => {
                Router.push('/settings')
              }}
            >
              페이지로 이동
            </Button>
          )}
          <Button
            onClick={() => {
              setModal_1(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Body>
  )
}

export default DetailFree
