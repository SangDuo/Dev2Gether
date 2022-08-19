import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Contest {
  id: number
  title: string
  tag: string[]
  writer: string
  writer_id: number
  date: string
  content: string
  like_user_id: number[]
  join_user_id: Array<{
    id: number
    message: string
    date: string
    state: string
  }>
  join_count: number
  state: '신청 가능' | '신청 불가'
}

interface Free {
  id: number
  title: string
  writer: string
  writer_id: number
  date: string
  content: string
  like_user_id: number[]
}

interface BoardState {
  contests: Contest[]
  frees: Free[]
}

const initialState: BoardState = {
  contests: [],
  frees: [],
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setContests: (state, action: PayloadAction<Contest[]>) => {
      state.contests = action.payload
    },
    setFrees: (state, action: PayloadAction<Free[]>) => {
      state.frees = action.payload
    },
  },
})

export const { setContests, setFrees } = boardSlice.actions
export type { BoardState, Contest, Free }
export default boardSlice.reducer
