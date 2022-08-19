import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { shallowEqual, useSelector } from 'react-redux'
import {
  setLoading,
  setModal,
  setSnackBar,
} from '../../redux/silces/alertSlice'
import { setProfile, Profile } from '../../redux/silces/userSlice'

const EditProfile = () => {
  const profile = useSelector((state: RootState) => {
    return state.user.profile
  }, shallowEqual)
  const dispatch = useDispatch()

  const [email, setEmail] = useState(profile?.email)
  const [realname, setRealname] = useState(profile?.realname)
  const [fakename, setFakename] = useState(profile?.fakename)
  const [phonenum, setPhonenum] = useState(profile?.phonenum)

  const editHandler = useCallback(() => {
    dispatch(setLoading(true))
    axios
      .post('http://163.44.181.194:1212/setting/profile/', {
        email: email,
        realname: realname,
        fakename: fakename,
        phonenum: phonenum,
      })
      .then((response: AxiosResponse<Profile>) => {
        dispatch(setProfile(response.data))
        dispatch(setLoading(false))
        dispatch(setSnackBar([true, '수정되었습니다.']))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [email, fakename, realname, phonenum, dispatch])

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(2px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(2px)' }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ m: '30px 30px' }}>
        <b style={{ fontSize: '3rem' }}>내 프로필</b>
        <p>
          내 프로필에서 이메일, 본명, 닉네임, 전화번호를 수정할 수 있습니다.
        </p>
      </Box>
      <Box sx={{ m: '100px 0px' }}>
        <Box sx={{ m: '30px 30px' }}>
          <b style={{ margin: '0px 24.56px 0px 10px', lineHeight: '2' }}>
            이메일
          </b>
          <TextField
            required
            variant="standard"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
            }}
            inputProps={{
              style: { fontFamily: 'nanumSquare', width: '20rem' },
            }}
          />
          {(!email?.includes('@') || email?.length > 30) && (
            <div
              style={{ marginTop: '0.1rem', marginLeft: '10px', color: 'red' }}
            >
              이메일은 30자 이하, 이메일 형식에 맞추어 작성해야 합니다.
            </div>
          )}
        </Box>
        <Box sx={{ m: '30px 30px' }}>
          <b style={{ margin: '0px 39.12px 0px 10px', lineHeight: '2' }}>
            본명
          </b>
          <TextField
            required
            variant="standard"
            value={realname}
            type="text"
            onChange={(event) => {
              setRealname(event.target.value)
            }}
            inputProps={{
              style: { fontFamily: 'nanumSquare', width: '20rem' },
            }}
          />
          {realname && realname?.length > 4 && (
            <div
              style={{ marginTop: '0.1rem', marginLeft: '10px', color: 'red' }}
            >
              본명은 4글자 이하이어야 합니다.
            </div>
          )}
        </Box>
        <Box sx={{ m: '30px 30px' }}>
          <b style={{ margin: '0px 24.56px 0px 10px', lineHeight: '2' }}>
            닉네임
          </b>
          <TextField
            required
            variant="standard"
            value={fakename}
            type="text"
            onChange={(event) => {
              setFakename(event.target.value)
            }}
            inputProps={{
              style: { fontFamily: 'nanumSquare', width: '20rem' },
            }}
          />
          {fakename && fakename?.length > 8 && (
            <div
              style={{ marginTop: '0.1rem', marginLeft: '10px', color: 'red' }}
            >
              닉네임은 8글자 이하이어야 합니다.
            </div>
          )}
        </Box>
        <Box sx={{ m: '30px 30px' }}>
          <b style={{ margin: '10px 10px', lineHeight: '2' }}>전화번호</b>
          <TextField
            required
            variant="standard"
            value={phonenum}
            type="tel"
            onChange={(event) => {
              setPhonenum(event.target.value)
            }}
            inputProps={{
              style: { fontFamily: 'nanumSquare', width: '20rem' },
            }}
          />
          {phonenum && (!phonenum?.includes('-') || phonenum?.length > 13) && (
            <div
              style={{
                marginTop: '0.1rem',
                marginLeft: '10px',
                color: 'red',
              }}
            >
              연락처는 13글자 이하, 하이픈(-)을 포함해야 합니다.
            </div>
          )}
        </Box>
        <Box display="flex" justifyContent="center" sx={{ m: '80px 30px' }}>
          <Button
            variant="outlined"
            onClick={editHandler}
            disabled={
              !phonenum?.includes('-') ||
              phonenum?.length > 13 ||
              (fakename && fakename?.length > 8) ||
              (realname && realname?.length > 4) ||
              !email?.includes('@') ||
              email?.length > 30
            }
          >
            변경
          </Button>
        </Box>
      </Box>
    </motion.div>
  )
}

export default EditProfile
