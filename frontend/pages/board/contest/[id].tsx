import {
  Avatar,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material'
import axios, { AxiosError, AxiosResponse } from 'axios'
import Router, { useRouter } from 'next/router'
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import { setLoading, setSnackBar } from '../../../redux/silces/alertSlice'
import { setModal } from '../../../redux/silces/alertSlice'
import { Contest } from '../../../redux/silces/boardSlice'
import DetailContest from '../../../components/contest/DetailContest'
import EditContest from '../../../components/contest/EditContest'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { elapsedTime } from '.'
import { Profile } from '../../../redux/silces/userSlice'

const Menu: FunctionComponent<{
  post: Contest
  setPost: Dispatch<SetStateAction<Contest | undefined>>
}> = ({ post, setPost }) => {
  const [modal_1, setModal_1] = useState(false)
  const [modal_2, setModal_2] = useState(false)
  const [modal_3, setModal_3] = useState(false)
  const [modal_4, setModal_4] = useState(false)
  const [modal_5, setModal_5] = useState(false)
  const [modal_6, setModal_6] = useState(false)
  const [user, setUser] = useState<Profile>()
  const [message, setMessage] = useState<string>()
  const [rows, setRows] = useState<
    Array<{
      id: number
      applicant: string
      message: string
      state: string
      date: string
    }>
  >([])
  const [ids, setIds] = useState<any>([])
  const dispatch = useDispatch()

  const fetchApplications = useCallback(() => {
    dispatch(setLoading(true))
    axios
      .get(
        `http://163.44.181.194:1212/api/board/contest/${post.id}/applications`
      )
      .then(
        (
          response: AxiosResponse<
            Array<{
              id: number
              fakename: string
              message: string
              state: string
              date: string
            }>
          >
        ) => {
          setRows(
            response.data.map((data) => {
              return {
                id: data.id,
                applicant: data.fakename,
                message: data.message,
                state: data.state,
                date: data.date,
              }
            })
          )
          dispatch(setLoading(false))
        }
      )
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch, post.id])

  const showHandler = useCallback((id: number) => {
    dispatch(setLoading(true))
    axios
      .post('http://163.44.181.194:1212/api/getProfile', { id: id })
      .then((response: AxiosResponse<Profile>) => {
        setUser(response.data)
        dispatch(setLoading(false))
        setModal_6(true)
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [])

  const removeHandler = useCallback(() => {
    setModal_1(false)
    dispatch(setLoading(true))
    axios
      .delete(`http://163.44.181.194:1212/api/board/contest/${Router.query.id}`)
      .then((response) => {
        dispatch(setLoading(false))
        Router.replace('/board/contest').then(() => {
          dispatch(setSnackBar([true, '정상적으로 게시물이 삭제되었습니다.']))
        })
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch])

  const acceptHandler = useCallback(() => {
    setModal_5(false)
    dispatch(setLoading(true))
    axios
      .post(`http://163.44.181.194:1212/api/board/contest/${post.id}/accept`, {
        ids: ids,
      })
      .then((response) => {
        fetchApplications()
        dispatch(setLoading(false))
        dispatch(setSnackBar([true, '정상적으로 신청들이 수락되었습니다.']))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch, fetchApplications, ids, post.id])

  const rejectHandler = useCallback(() => {
    setModal_4(false)
    dispatch(setLoading(true))
    axios
      .post(`http://163.44.181.194:1212/api/board/contest/${post.id}/reject`, {
        ids: ids,
      })
      .then((response) => {
        fetchApplications()
        dispatch(setLoading(false))
        dispatch(setSnackBar([true, '정상적으로 신청들이 삭제되었습니다.']))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch, fetchApplications, ids, post.id])

  useEffect(() => {
    dispatch(setLoading(true))
    if (modal_3 === true) {
      fetchApplications()
    } else if (modal_3 === false) {
      axios
        .get(`http://163.44.181.194:1212/api/board/contest/${post.id}`)
        .then((response: AxiosResponse<Contest>) => {
          dispatch(setLoading(false))
          setPost(response.data)
        })
        .catch((error: AxiosError<string>) => {
          dispatch(setLoading(false))
          dispatch(setModal([true, error.response?.data as string]))
        })
    }
  }, [dispatch, fetchApplications, modal_3, post.id, setPost])

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'applicant',
        headerName: 'Applicant',
        description: '신청자',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        width: 200,
      },
      {
        field: 'date',
        headerName: 'Date',
        description: '신청 날짜',
        headerAlign: 'center',
        align: 'center',
        width: 160,
        valueGetter: ({ row }) => {
          return elapsedTime(row.date)
        },
      },
      {
        field: 'message',
        headerName: 'Message',
        description: '신청 메세지',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        width: 630,
      },
      {
        field: 'state',
        headerName: 'State',
        description: '상태',
        headerAlign: 'center',
        align: 'center',
        width: 100,
      },
    ]
  }, [])

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'fixed', bottom: '3rem', right: '2rem' }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<EditIcon />}
          tooltipTitle="수정"
          onClick={() => {
            setModal_2(true)
          }}
        />
        <SpeedDialAction
          icon={<DeleteIcon />}
          tooltipTitle="삭제"
          onClick={() => {
            setModal_1(true)
          }}
        />
        <SpeedDialAction
          icon={<PlaylistAddCheckIcon />}
          tooltipTitle="신청 리스트"
          onClick={() => {
            setModal_3(true)
          }}
        />
      </SpeedDial>
      <Dialog
        open={modal_1}
        onClose={() => {
          setModal_1(false)
        }}
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>알림</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'nanumSquare' }}>
            정말 해당 게시물을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModal_1(false)
            }}
          >
            취소
          </Button>
          <Button onClick={removeHandler}>삭제</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modal_2}
        onClose={() => {
          setModal_2(false)
        }}
      >
        <EditContest setOpen={setModal_2} contest={post} setContest={setPost} />
      </Dialog>

      <Dialog
        open={modal_3}
        onClose={() => {
          setModal_3(false)
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>
          받은 신청 기록
          <DialogContentText fontFamily="nanumSquare"></DialogContentText>
        </DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              disableColumnSelector
              disableColumnMenu
              disableSelectionOnClick
              pageSize={5}
              rowsPerPageOptions={[5]}
              pagination
              onSelectionModelChange={(items) => {
                setIds(items)
              }}
              onRowDoubleClick={({ row }) => {
                setMessage(row.message)
                showHandler(row.id)
              }}
              isRowSelectable={(params) => params.row.state === '대기'}
              sx={{ fontFamily: 'nanumSquare', fontSize: '1rem' }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModal_5(true)
            }}
            disabled={
              post.join_count -
                rows.filter((row) => {
                  return row.state === '수락'
                }).length -
                1 <
                ids.length ||
              post.join_count -
                rows.filter((row) => {
                  return row.state === '수락'
                }).length -
                1 ===
                0 ||
              ids.length === 0
            }
          >
            수락
          </Button>
          <Button
            onClick={() => {
              setModal_4(true)
            }}
            disabled={ids.length === 0}
          >
            거절
          </Button>
          <Button
            onClick={() => {
              setModal_3(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modal_4}
        onClose={() => {
          setModal_4(false)
        }}
        maxWidth="md"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>알림</DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
            해당 신청들을 거절하시겠습니까? 거절한 신청은 다시 수락할 수
            없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModal_4(false)
            }}
          >
            취소
          </Button>
          <Button onClick={rejectHandler}>삭제</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modal_5}
        onClose={() => {
          setModal_5(false)
        }}
        maxWidth="md"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>알림</DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
            선택한 신청들을 수락하겠습니까? 수락한 신청은 다시 거절할 수
            없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModal_5(false)
            }}
          >
            취소
          </Button>
          <Button onClick={acceptHandler}>수락</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modal_6}
        onClose={() => {
          setModal_6(false)
        }}
        fullWidth
        maxWidth="lg"
        sx={{
          '& img': {
            display: 'block',
            width: '100%',
            height: 'auto',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>
          유저 프로필
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
                  {user?.fakename}
                </div>
              </Box>
              <Box sx={{ m: '5px 5px' }}>
                <Box sx={{ p: '10px 0px' }}>
                  <div>{message}</div>
                </Box>
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
                      __html: user?.introduction as string,
                    }}
                  ></div>
                </Box>
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModal_6(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const Contest = () => {
  const router = useRouter()

  return (
    <>
      {router.isReady === true && router.query.id && (
        <DetailContest id={parseInt(router.query.id as string)} />
      )}
    </>
  )
}

export { Menu }
export default Contest
