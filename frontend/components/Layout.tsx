import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material'
import { FunctionComponent, ReactNode } from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setModal, setSnackBar } from '../redux/silces/alertSlice'
import Header from './Header'

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const alert = useSelector((state: RootState) => {
    return state.alert
  }, shallowEqual)
  const dispatch = useDispatch()

  return (
    <>
      <Header />
      <Backdrop
        sx={{ color: '#fff', zIndex: 5000 }}
        open={alert.loading}
        onClick={() => {
          dispatch(setSnackBar([true, '잠시만 기다리세요']))
        }}
      >
        <CircularProgress color="inherit" sx={{ zIndex: 5001 }} />
      </Backdrop>
      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={alert.modal}
        onClose={() => {
          dispatch(setModal([false, alert.message]))
        }}
      >
        <DialogTitle fontFamily="nanumSquare">알림</DialogTitle>
        <DialogContent>
          <DialogContentText fontFamily="nanumSquare">
            {alert.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ fontFamily: 'nanumSquare' }}
            onClick={() => {
              dispatch(setModal([false, alert.message]))
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alert.snackBar}
        autoHideDuration={4000}
        onClose={() => {
          dispatch(setSnackBar([false, alert.message]))
        }}
      >
        <Alert
          onClose={() => {
            dispatch(setSnackBar([false, alert.message]))
          }}
          severity="success"
          sx={{ width: '100%', fontFamily: 'nanumSquare' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      {children}
    </>
  )
}

export default Layout
