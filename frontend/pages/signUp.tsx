import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import styled from '@emotion/styled'
import Router from 'next/router'
import axios, { AxiosError } from 'axios'
import { FormEvent, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { setLoading, setModal, setSnackBar } from '../redux/silces/alertSlice'
import Head from 'next/head'

const Body = styled(motion.div)``

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phonenum, setPhonenum] = useState('')
  const [fakename, setFakename] = useState('')
  const [realname, setRealname] = useState('')
  const dispatch = useDispatch()

  const signUpHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      dispatch(setLoading(true))
      axios
        .post('http://163.44.181.194:1212/auth/register/', {
          username: username,
          email: email,
          password: password,
          realname: realname,
          fakename: fakename,
          phonenum: phonenum,
        })
        .then((response) => {
          dispatch(setLoading(false))
          Router.replace('/signIn')
          dispatch(setSnackBar([true, '정상적으로 회원가입 되었습니다.']))
        })
        .catch((error: AxiosError<string>) => {
          dispatch(setLoading(false))
          dispatch(setModal([true, error.response?.data as string]))
        })
    },
    [dispatch, username, email, password, realname, fakename, phonenum]
  )
  return (
    <Body>
      <Head>
        <title>회원가입</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={signUpHandler}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="아이디"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                  inputProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                />
              </Grid>
              {username && (username.length < 8 || username.length > 30) && (
                <div
                  style={{
                    marginTop: '0.1rem',
                    marginLeft: '1rem',
                    color: 'red',
                  }}
                >
                  아이디는 8자 이상, 30자 이하이어야 합니다.
                </div>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="이메일"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                  inputProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                />
              </Grid>
              {email && (!email?.includes('@') || email?.length > 30) && (
                <div
                  style={{
                    marginTop: '0.1rem',
                    marginLeft: '1rem',
                    color: 'red',
                  }}
                >
                  이메일은 30자 이하, 이메일 형식에 맞추어 작성해야 합니다.
                </div>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="본명"
                  value={realname}
                  onChange={(event) => {
                    setRealname(event.target.value)
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                  inputProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                />
              </Grid>
              {realname.length > 4 && (
                <div
                  style={{
                    marginTop: '0.1rem',
                    marginLeft: '1rem',
                    color: 'red',
                  }}
                >
                  본명은 4글자 이하이어야 합니다.
                </div>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="닉네임"
                  value={fakename}
                  onChange={(event) => {
                    setFakename(event.target.value)
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                  inputProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                />
              </Grid>
              {fakename.length > 8 && (
                <div
                  style={{
                    marginTop: '0.1rem',
                    marginLeft: '1rem',
                    color: 'red',
                  }}
                >
                  닉네임은 8글자 이하이어야 합니다.
                </div>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="연락처"
                  InputLabelProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                  inputProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                  value={phonenum}
                  onChange={(event) => {
                    setPhonenum(event.target.value)
                  }}
                />
              </Grid>
              {phonenum &&
                (!phonenum?.includes('-') || phonenum?.length != 13) && (
                  <div
                    style={{
                      marginTop: '0.1rem',
                      marginLeft: '1rem',
                      color: 'red',
                    }}
                  >
                    연락처는 13글자, 연락처 형식(010-xxxx-xxxx)에 맞추어
                    작성해야 합니다.
                  </div>
                )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'nanumSquare' },
                  }}
                />
              </Grid>
              {password && (password.length < 8 || password.length > 30) && (
                <div
                  style={{
                    marginTop: '0.1rem',
                    marginLeft: '1rem',
                    color: 'red',
                  }}
                >
                  비밀번호는 8글자 이상, 30글자 이하이어야 합니다.
                </div>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                username.length < 8 ||
                username.length > 30 ||
                !email.includes('@') ||
                email.length > 30 ||
                realname.length > 4 ||
                realname === '' ||
                fakename.length > 8 ||
                fakename === '' ||
                !phonenum.includes('-') ||
                phonenum.length != 13 ||
                password.length < 8 ||
                password.length > 30
              }
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signIn">
                  <a>Sign In</a>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Body>
  )
}

export default SignUp
