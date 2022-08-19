import {
  Button,
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
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { setLoading, setSnackBar } from '../../../redux/silces/alertSlice'
import { setModal } from '../../../redux/silces/alertSlice'
import { Free } from '../../../redux/silces/boardSlice'
import EditFree from '../../../components/free/EditFree'
import DetailFree from '../../../components/free/DetailFree'

const Menu: FunctionComponent<{
  post: Free
  setPost: Dispatch<SetStateAction<Free | undefined>>
}> = ({ post, setPost }) => {
  const [modal_1, setModal_1] = useState(false)
  const [modal_2, setModal_2] = useState(false)
  const dispatch = useDispatch()

  const removeHandler = useCallback(() => {
    setModal_1(false)
    dispatch(setLoading(true))
    axios
      .delete(`http://163.44.181.194:1212/api/board/free/${Router.query.id}`)
      .then((response) => {
        dispatch(setLoading(false))
        Router.replace('/board/free').then(() => {
          dispatch(setSnackBar([true, '정상적으로 게시물이 삭제되었습니다.']))
        })
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch])

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
        <EditFree setOpen={setModal_2} free={post} setFree={setPost} />
      </Dialog>
    </>
  )
}

const Free = () => {
  const router = useRouter()

  return (
    <>
      {router.isReady === true && router.query.id && (
        <DetailFree id={parseInt(router.query.id as string)} />
      )}
    </>
  )
}

export { Menu }
export default Free
