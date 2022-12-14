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
        dispatch(setSnackBar([true, '??????????????? ???????????? ?????????????????????.']))
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
        description: '?????????',
        sortable: false,
        width: 550,
      },
      {
        field: 'writer',
        headerName: 'Writer',
        description: '????????? ?????????',
        sortable: false,
        width: 180,
      },
      {
        field: 'date',
        headerName: 'Date',
        description: '?????? ??????',
        width: 180,
      },
      { field: 'state', headerName: 'State', description: '??????', width: 100 },
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
          ??? ?????? ??????
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
            ??????
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            ??????
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
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>??????</DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
            ????????? ???????????? ?????? ?????? ????????????????????????? ?????? ????????? ????????????
            ???????????? ???????????????.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRemove(false)
            }}
          >
            ??????
          </Button>
          <Button onClick={removeHandler}>??????</Button>
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
        dispatch(setSnackBar([true, '??????????????? ???????????? ?????????????????????.']))
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
          applicant: '????????? ?????????',
          post: '?????? ??? ???????????????',
          state: 'Pending',
        },
        {
          id: 2,
          applicant: '??????????????? ???????????????',
          post: '????????? ????????????',
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
        description: '?????????',
        sortable: false,
        width: 550,
      },
      {
        field: 'applicant',
        headerName: 'Applicant',
        description: '?????????',
        sortable: false,
        width: 180,
      },
      {
        field: 'date',
        headerName: 'Date',
        description: '?????? ??????',
        width: 180,
      },
      { field: 'state', headerName: 'State', description: '??????', width: 100 },
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
          ?????? ?????? ??????
          <DialogContentText fontFamily="nanumSquare">
            ?????????????????? ??????????????? ??? ??? ????????????.
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
            ??????
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            ??????
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
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>??????</DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
            ????????? ???????????? ?????? ?????? ????????????????????????? ?????? ????????? ????????????
            ???????????? ???????????????.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRemove(false)
            }}
          >
            ??????
          </Button>
          <Button onClick={removeHandler}>??????</Button>
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
          ?????? ????????????
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <>
            <Button>??????</Button>
            <Button>??????</Button>
          </>
          <Button
            onClick={() => {
              setDetail(false)
            }}
          >
            ??????
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
        ??? ?????? ??????
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setOpen_2(true)
        }}
      >
        ?????? ??????
      </Button>
      {open_1 && <Modal_1 setOpen={setOpen_1} />}
      {open_2 && <Modal_2 setOpen={setOpen_2} />}
    </motion.div>
  )
}

export { Modal_1, Modal_2 }
export default ManageContest
