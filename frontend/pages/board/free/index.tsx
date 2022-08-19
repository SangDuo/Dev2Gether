import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import axios, { AxiosError, AxiosResponse } from 'axios'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Free, setFrees } from '../../../redux/silces/boardSlice'
import { setLoading, setModal } from '../../../redux/silces/alertSlice'
import Router from 'next/router'
import WriteFree from '../../../components/free/WriteFree'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import FeedIcon from '@mui/icons-material/Feed'
import { elapsedTime } from '../contest'

const Title = styled(motion.div)`
  height: 28rem;

  & .container {
    display: flex;
    flex-direction: column;
    margin: 5rem 0 0 15rem;
  }
`

const Container = styled(motion.div)`
  margin-top: 4rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  column-gap: 1.5rem;

  & #menu {
    display: flex;
    width: 14rem;
    height: 50rem;
    justify-content: center;
  }

  & #section {
    background-color: #f5f5f5;
    border: 0.1rem solid #e2e2e2;
  }
`

const Menu = () => {
  const [modal_1, setModal_1] = useState(false)

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'fixed', bottom: '3rem', right: '2rem' }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<EditIcon />}
          tooltipTitle="작성"
          onClick={() => {
            setModal_1(true)
          }}
        />
      </SpeedDial>

      <Dialog
        open={modal_1}
        onClose={() => {
          setModal_1(false)
        }}
        fullWidth
      >
        <WriteFree setOpen={setModal_1} />
      </Dialog>
    </>
  )
}

const Free = () => {
  const [myProfile, setMyProfile] = useState(false)
  const [userProfile, setUserProfile] = useState(false)
  const [search_writer, setSearch_writer] = useState('')
  const [search, setSearch] = useState('')
  const [modal_1, setModal_1] = useState(false)
  const [category, setCategory] = useState<number>()
  const posts = useSelector((store: RootState) => {
    return store.board.frees
  }, shallowEqual)
  const dispatch = useDispatch()
  const user = useSelector((store: RootState) => {
    return store.user.profile
  }, shallowEqual)

  useEffect(() => {
    dispatch(setLoading(true))
    axios
      .get('http://163.44.181.194:1212/api/board/free/')
      .then((response: AxiosResponse<Free[]>) => {
        dispatch(setLoading(false))
        dispatch(setFrees(response.data))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch])

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'title',
        headerName: 'Title',
        description: '제목',
        sortable: false,
        width: 280,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'writer',
        headerName: 'Writer',
        description: '작성자',
        sortable: false,
        width: 180,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }) => {
          return row.writer === user?.fakename ? (
            <>
              <Button
                sx={{ fontFamily: 'nanumSquare' }}
                onClick={() => {
                  setCategory(0)
                  dispatch(setLoading(true))
                  axios
                    .get('http://163.44.181.194:1212/api/board/free/')
                    .then((response: AxiosResponse<Free[]>) => {
                      dispatch(
                        setFrees(
                          response.data.filter((post) => {
                            return post.writer_id === user?.id
                          })
                        )
                      )
                      dispatch(setLoading(false))
                    })
                    .catch((error: AxiosError<string>) => {
                      dispatch(setLoading(false))
                      dispatch(setModal([true, error.response?.data as string]))
                    })
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {row.writer}
                </div>
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{ fontFamily: 'nanumSquare' }}
                onClick={() => {
                  setCategory(1)
                  dispatch(setLoading(true))
                  axios
                    .get('http://163.44.181.194:1212/api/board/free/')
                    .then((response: AxiosResponse<Free[]>) => {
                      setSearch_writer(row.writer)
                      dispatch(
                        setFrees(
                          response.data.filter((post) => {
                            return post.writer_id === row.writer_id
                          })
                        )
                      )
                      dispatch(setLoading(false))
                    })
                    .catch((error: AxiosError<string>) => {
                      dispatch(setLoading(false))
                      dispatch(setModal([true, error.response?.data as string]))
                    })
                }}
              >
                <div style={{ fontSize: '1rem' }}>{row.writer}</div>
              </Button>
            </>
          )
        },
      },
      {
        field: 'date',
        headerName: 'Date',
        description: '작성 날짜',
        width: 160,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => {
          return elapsedTime(row.date)
        },
      },
      {
        field: 'like',
        headerName: 'Like',
        description: '좋아요',
        width: 80,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => {
          return row.like_user_id.length
        },
      },
    ]
  }, [dispatch, user?.fakename, user?.id])

  return (
    <>
      <Head>
        <title>자유 게시판</title>
      </Head>
      <Title>
        <div className="container">
          <motion.div
            style={{
              fontSize: '2rem',
              fontWeight: 'lighter',
              marginBottom: '1rem',
            }}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 1 },
            }}
          >
            <span style={{ color: '#849af4' }}>DEV TOGETHER</span>
            ㆍFree Board
          </motion.div>
          <motion.hr
            style={{
              width: '32rem',
              height: '0.15rem',
              border: '0',
              backgroundColor: 'black',
              marginBottom: '6rem',
              marginLeft: '0',
            }}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 1, delay: 0.3 },
            }}
          />
          <motion.div
            style={{
              fontSize: '5rem',
              fontWeight: 'bold',
              marginBottom: '0.3rem',
            }}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 1, delay: 0.5 },
            }}
          >
            자유 게시판
          </motion.div>
          <motion.div
            style={{ fontSize: '2.5rem', fontWeight: 'lighter' }}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 1.5, delay: 1 },
            }}
          >
            자유롭게 이야기를 나눠보세요.
          </motion.div>
        </div>
      </Title>
      <Container
        initial={{ opacity: 0, filter: 'blur(2px)' }}
        animate={{
          opacity: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.5, delay: 1 },
        }}
      >
        <div id="menu">
          <List
            sx={{
              width: '14rem',
              maxWidth: 360,
              bgcolor: '#f5f5f5',
              height: '40rem',
              border: '0.1rem solid #e2e2e2',
              padding: 0,
            }}
          >
            <ListItem
              button
              onClick={() => {
                if (category === 0) {
                  setCategory(-1)
                  dispatch(setLoading(true))
                  axios
                    .get('http://163.44.181.194:1212/api/board/free/')
                    .then((response: AxiosResponse<Free[]>) => {
                      dispatch(setLoading(false))
                      dispatch(setFrees(response.data))
                    })
                    .catch((error: AxiosError<string>) => {
                      dispatch(setLoading(false))
                      dispatch(setModal([true, error.response?.data as string]))
                    })
                } else {
                  setCategory(0)
                  dispatch(setLoading(true))
                  axios
                    .get('http://163.44.181.194:1212/api/board/free/')
                    .then((response: AxiosResponse<Free[]>) => {
                      dispatch(
                        setFrees(
                          response.data.filter((post) => {
                            return post.writer_id === user?.id
                          })
                        )
                      )
                      dispatch(setLoading(false))
                    })
                    .catch((error: AxiosError<string>) => {
                      dispatch(setLoading(false))
                      dispatch(setModal([true, error.response?.data as string]))
                    })
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={
                    category == 0
                      ? {
                          backgroundColor: '#7c7c7c',
                          transition: '0.5s',
                        }
                      : {
                          backgroundColor: '#bdbdbd',
                          transition: '0.5s',
                        }
                  }
                >
                  <FeedIcon />
                </Avatar>
              </ListItemAvatar>
              <span>{category === 0 ? '모든' : '내'} 게시물 보기</span>
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                setSearch_writer('')
                if (category === 1) {
                  setCategory(-1)
                  setSearch('')
                  dispatch(setLoading(true))
                  axios
                    .get('http://163.44.181.194:1212/api/board/free/')
                    .then((response: AxiosResponse<Free[]>) => {
                      dispatch(setLoading(false))
                      dispatch(setFrees(response.data))
                    })
                    .catch((error: AxiosError<string>) => {
                      dispatch(setLoading(false))
                      dispatch(setModal([true, error.response?.data as string]))
                    })
                } else {
                  setModal_1(true)
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={
                    category == 1
                      ? {
                          backgroundColor: '#7c7c7c',
                          transition: '0.5s',
                        }
                      : {
                          backgroundColor: '#bdbdbd',
                          transition: '0.5s',
                        }
                  }
                >
                  <SearchIcon />
                </Avatar>
              </ListItemAvatar>
              <span>
                {category === 1 ? (
                  <>
                    {search_writer === '' ? (
                      <>
                        제목: <b>{`'${search}'`}</b>(으)로 검색 중
                      </>
                    ) : (
                      <>
                        작성자: <b>{`'${search_writer}'`}</b>(으)로 검색 중
                      </>
                    )}
                  </>
                ) : (
                  '검색'
                )}
              </span>
            </ListItem>
            <Divider />
          </List>
        </div>
        <div
          id="section"
          style={{
            width: '66rem',
            height: '40rem',
          }}
        >
          <motion.div
            style={{ height: '100%', width: '100%', border: 0 }}
            initial={{ opacity: 0, filter: 'blur(2px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 1, delay: 0.5 },
            }}
          >
            <DataGrid
              rows={posts}
              columns={columns}
              disableColumnSelector
              disableColumnMenu
              disableSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10]}
              pagination
              onRowDoubleClick={(item) => {
                Router.push(`/board/free/${item.id}`)
              }}
              sx={{
                fontFamily: 'nanumSquare',
                fontSize: '1rem',
                border: 0,
              }}
              className="MuiDataGrid-aggregationColumnHeader--alignCenter"
            />
          </motion.div>
        </div>
      </Container>
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={myProfile}
        onClose={() => {
          setMyProfile(false)
        }}
      >
        <DialogTitle fontFamily="nanumSquare">내 프로필</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button
            sx={{ fontFamily: 'nanumSquare' }}
            onClick={() => {
              setMyProfile(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={userProfile}
        onClose={() => {
          setUserProfile(false)
        }}
      >
        <DialogTitle fontFamily="nanumSquare">유저 프로필</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button
            sx={{ fontFamily: 'nanumSquare' }}
            onClick={() => {
              setUserProfile(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
      {posts && <Menu />}
      <Dialog
        open={modal_1}
        onClose={() => {
          setModal_1(false)
        }}
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>검색</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'nanumSquare' }}>
            검색하고 싶은 게시물의 제목을 입력해주세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="제목"
            type="text"
            InputLabelProps={{ style: { fontFamily: 'nanumSquare' } }}
            fullWidth
            variant="standard"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
            }}
            inputProps={{ style: { fontFamily: 'nanumSquare' } }}
          />
          {search.length > 8 && (
            <DialogContentText
              fontFamily="nanumSquare"
              sx={{ fontSize: '0.9rem', color: 'red' }}
            >
              검색어는 8자 이하이어야 합니다.
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setModal_1(false)
            }}
          >
            취소
          </Button>
          <Button
            onClick={() => {
              setCategory(1)
              dispatch(setLoading(true))
              axios
                .get('http://163.44.181.194:1212/api/board/free/')
                .then((response: AxiosResponse<Free[]>) => {
                  dispatch(
                    setFrees(
                      response.data.filter((post) => {
                        return post.title.includes(search)
                      })
                    )
                  )
                  setModal_1(false)
                  dispatch(setLoading(false))
                })
                .catch((error: AxiosError<string>) => {
                  dispatch(setLoading(false))
                  dispatch(setModal([true, error.response?.data as string]))
                })
            }}
            disabled={search.length > 8}
          >
            검색
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Free
