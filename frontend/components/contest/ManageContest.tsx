import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { motion } from 'framer-motion'
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
import {
  setLoading,
  setModal,
  setSnackBar,
} from '../../redux/silces/alertSlice'
import { Contest } from '../../redux/silces/boardSlice'

const Modal_1: FunctionComponent<{
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ setOpen }) => {
  const [rows, setRows] = useState<
    Array<{ id: number; writer: string; post: string; state: string }>
  >([])
  const [selected, setSelected] = useState<GridSelectionModel>()
  const [remove, setRemove] = useState(false)
  const dispatch = useDispatch()

  const fetchApplications = useCallback(() => {
    dispatch(setLoading(true))
    axios
      .get('http://163.44.181.194:1212/api/getProfile')
      .then(
        (response_1: AxiosResponse<Array<{ id: number; message: string }>>) => {
          axios
            .get('http://163.44.181.194:1212/api/board/contest/')
            .then((response_2: AxiosResponse<Contest[]>) => {
              setRows(
                response_2.data
                  .filter((post) => {
                    return response_1.data
                      .map((applications) => {
                        return applications.id
                      })
                      .includes(post.id)
                  })
                  .map((post) => {
                    return {
                      id: post.id,
                      post: post.title,
                      writer: post.writer,
                      state: 'Pending',
                    }
                  })
              )
              dispatch(setLoading(false))
            })
            .catch((error: AxiosError<string>) => {
              dispatch(setLoading(false))
              dispatch(setModal([true, error.response?.data as string]))
            })
        }
      )
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch])

  const removeHandler = useCallback(() => {
    dispatch(setLoading(true))
    console.log(selected)
    axios
      .post('http://163.44.181.194:1212/api/getProfile/cancel', {
        ids: selected,
      })
      .then((response) => {
        fetchApplications()
        setRemove(false)
        dispatch(setSnackBar([true, '정상적으로 신청들이 삭제되었습니다.']))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [selected, dispatch, fetchApplications])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'post',
        headerName: 'Post',
        description: '게시물',
        sortable: false,
        width: 550,
      },
      {
        field: 'writer',
        headerName: 'Writer',
        description: '게시물 작성자',
        sortable: false,
        width: 180,
      },
      {
        field: 'date',
        headerName: 'Date',
        description: '신청 날짜',
        width: 180,
      },
      { field: 'state', headerName: 'State', description: '상태', width: 100 },
    ]
  }, [])

  return (
    <>
      <Dialog
        open={true}
        onClose={() => {
          setOpen(false)
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>
          내 신청 기록
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
                setSelected(items)
              }}
              sx={{ fontFamily: 'nanumSquare', fontSize: '1rem' }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRemove(true)
            }}
          >
            삭제
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={remove}
        onClose={() => {
          setRemove(false)
        }}
        maxWidth="md"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>알림</DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
            선택한 신청들을 정말 전부 삭제하시겠습니까? 대기 상태의 신청들은
            자동으로 철회됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRemove(false)
            }}
          >
            취소
          </Button>
          <Button onClick={removeHandler}>삭제</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const Modal_2: FunctionComponent<{
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ setOpen }) => {
  const [rows, setRows] = useState<any[]>([])
  const [selected, setSelected] = useState<GridSelectionModel>()
  const [remove, setRemove] = useState(false)
  const [detail, setDetail] = useState(false)
  const [detailed, setDetailed] = useState()

  const dispatch = useDispatch()
  const removeHandler = useCallback(() => {
    dispatch(setLoading(true))
    axios
      .post('', { ids: selected })
      .then((response) => {
        dispatch(setLoading(false))
        setRemove(false)
        dispatch(setSnackBar([true, '정상적으로 신청들이 삭제되었습니다.']))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [selected, dispatch])

  const detailHandler = useCallback(({ row }) => {
    setDetailed(row)
    setDetail(true)
  }, [])

  useEffect(() => {
    remove == false && dispatch(setLoading(true))
    axios.get('').then((response: AxiosResponse<any>) => {
      dispatch(setLoading(false))
      setRows([
        {
          id: 1,
          applicant: '여기는 신청자',
          post: '내가 쓴 게시물들은',
          state: 'Pending',
        },
        {
          id: 2,
          applicant: '유저네임이 있을거고요',
          post: '여기에 있습니다',
          state: 'Rejected',
        },
      ])
    })
  }, [remove, dispatch])

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'post',
        headerName: 'Post',
        description: '게시물',
        sortable: false,
        width: 550,
      },
      {
        field: 'applicant',
        headerName: 'Applicant',
        description: '신청자',
        sortable: false,
        width: 180,
      },
      {
        field: 'date',
        headerName: 'Date',
        description: '신청 날짜',
        width: 180,
      },
      { field: 'state', headerName: 'State', description: '상태', width: 100 },
    ]
  }, [])

  return (
    <>
      <Dialog
        open={true}
        onClose={() => {
          setOpen(false)
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>
          받은 신청 기록
          <DialogContentText fontFamily="nanumSquare">
            더블클릭하면 세부사항을 볼 수 있습니다.
          </DialogContentText>
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
                setSelected(items)
                console.log(items)
              }}
              onRowDoubleClick={detailHandler}
              sx={{ fontFamily: 'nanumSquare', fontSize: '1rem', border: 0 }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRemove(true)
            }}
          >
            삭제
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={remove}
        onClose={() => {
          setRemove(false)
        }}
        maxWidth="md"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>알림</DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
            선택한 신청들을 정말 전부 삭제하시겠습니까? 대기 상태의 신청들은
            자동으로 철회됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRemove(false)
            }}
          >
            취소
          </Button>
          <Button onClick={removeHandler}>삭제</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detail}
        onClose={() => {
          setDetail(false)
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>
          신청 세부사항
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <>
            <Button>수락</Button>
            <Button>거절</Button>
          </>
          <Button
            onClick={() => {
              setDetail(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const ManageContest = () => {
  const [open_1, setOpen_1] = useState(false)
  const [open_2, setOpen_2] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(2px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="contained"
        onClick={() => {
          setOpen_1(true)
        }}
      >
        내 신청 기록
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setOpen_2(true)
        }}
      >
        받은 신청
      </Button>
      {open_1 && <Modal_1 setOpen={setOpen_1} />}
      {open_2 && <Modal_2 setOpen={setOpen_2} />}
    </motion.div>
  )
}

export { Modal_1, Modal_2 }
export default ManageContest
