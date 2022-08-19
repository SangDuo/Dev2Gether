import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Profile {
  id: number
  username: string
  email: string
  realname: string
  fakename: string
  phonenum: string
  introduction: string
}

interface UserState {
  profile?: Profile
  login: boolean
}

const initialState: UserState = {
  login: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile | undefined>) => {
      state.profile = action.payload
    },
    setLogin(state, action: PayloadAction<boolean>) {
      state.login = action.payload
    },
  },
})

export const { setProfile, setLogin } = userSlice.actions
export type { Profile, UserState }
export default userSlice.reducer
