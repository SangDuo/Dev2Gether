import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface alertState {
  snackBar: boolean
  modal: boolean
  loading: boolean
  message: string
}

const initialState: alertState = {
  snackBar: false,
  modal: false,
  loading: false,
  message: '',
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setSnackBar: (state, action: PayloadAction<[boolean, string]>) => {
      state.snackBar = action.payload[0]
      state.message = action.payload[1]
    },
    setModal: (state, action: PayloadAction<[boolean, string]>) => {
      state.modal = action.payload[0]
      state.message = action.payload[1]
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setSnackBar, setModal, setLoading } = alertSlice.actions
export type { alertState }
export default alertSlice.reducer
