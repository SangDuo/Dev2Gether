import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import axios, { AxiosError } from 'axios'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setModal, setSnackBar } from '../../redux/silces/alertSlice'
import { motion } from 'framer-motion'

const SetPassword = () => {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [newPW, setNewPW] = useState('')
  const [confirmPW, setConfirmPW] = useState('')
  const dispatch = useDispatch()

  const confirmHandler = useCallback(() => {
    dispatch(setLoading(true))
    axios
      .post('http://163.44.181.194:1212/auth/passwordCheck', {
        password: password,
      })
      .then((response) => {
        dispatch(setLoading(false))
        setPassword('')
        setOpen(true)
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [password, dispatch])
  const changeHandler = useCallback(() => {
    axios
      .post('http://163.44.181.194:1212/auth/passwordChange ', {
        password: newPW,
      })
      .then((response) => {
        dispatch(setLoading(false))
        setOpen(false)
        dispatch(setSnackBar([true, '정상적으로 비밀번호가 변경되었습니다.']))
        setConfirmPW('')
        setNewPW('')
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [newPW, dispatch])

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(2px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ m: '30px 30px' }}>
        <b style={{ fontSize: '3rem' }}>비밀번호 변경</b>
        <p>비밀번호를 변경 할 수 있습니다.</p>
      </Box>
      <Box sx={{ m: '100px 0px' }}>
        <Box sx={{ m: '30px 30px' }}>
          <b style={{ margin: '10px 10px', lineHeight: '2' }}>
            현재 비밀번호:{' '}
          </b>
          <TextField
            required
            variant="standard"
            value={password}
            type="password"
            onChange={(event) => {
              setPassword(event.target.value)
            }}
          />
        </Box>
        <Box display="flex" justifyContent="center" sx={{ m: '100px 30px' }}>
          <Button variant="outlined" onClick={confirmHandler}>
            비밀번호 확인
          </Button>
        </Box>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false)
          }}
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>
            비밀번호 변경
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="normal"
              type="password"
              fullWidth
              value={newPW}
              onChange={(event) => {
                setNewPW(event.target.value)
              }}
            />
            <DialogContentText fontFamily="nanumSquare">
              새 비밀번호를 입력해주세요.
            </DialogContentText>
            {newPW.length < 8 && (
              <DialogContentText
                fontFamily="nanumSquare"
                sx={{ fontSize: '0.9rem', color: 'red' }}
              >
                비밀번호는 최소 8자리 이상이어야 합니다.
              </DialogContentText>
            )}

            <TextField
              margin="normal"
              fullWidth
              type="password"
              value={confirmPW}
              onChange={(event) => {
                setConfirmPW(event.target.value)
              }}
            />
            <DialogContentText fontFamily="nanumSquare">
              새 비밀번호를 한번 더 입력해주세요.
            </DialogContentText>
            {newPW != confirmPW && (
              <DialogContentText
                fontFamily="nanumSquare"
                sx={{ fontSize: '0.9rem', color: 'red' }}
              >
                비밀번호가 일치하지 않습니다.
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false)
              }}
            >
              취소
            </Button>
            <Button
              disabled={newPW != confirmPW || newPW.length < 8}
              onClick={changeHandler}
            >
              변경
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  )
}

export default SetPassword
