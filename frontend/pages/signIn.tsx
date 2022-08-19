import Router from 'next/router'
import axios, { AxiosError, AxiosResponse } from 'axios'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { FormEvent, useCallback, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Container,
} from '@mui/material'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { setLogin, setProfile, Profile } from '../redux/silces/userSlice'
import { setLoading, setModal, setSnackBar } from '../redux/silces/alertSlice'
import Head from 'next/head'

const Body = styled(motion.div)``

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const signInHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      dispatch(setLoading(true))
      axios
        .post('http://163.44.181.194:1212/auth/login/', {
          username: username,
          password: password,
        })
        .then((response: AxiosResponse<Profile>) => {
          dispatch(setLogin(true))
          dispatch(setProfile(response.data))
          dispatch(setLoading(false))
          Router.replace('/')
          dispatch(setSnackBar([true, '정상적으로 로그인 되었습니다.']))
        })
        .catch((error: AxiosError<string>) => {
          dispatch(setLoading(false))
          dispatch(setModal([true, error.response?.data as string]))
        })
    },
    [username, password, dispatch]
  )

  return (
    <Body>
      <Head>
        <title>로그인</title>
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
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={signInHandler}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
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
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="비밀번호"
              type="password"
              value={password}
              InputLabelProps={{
                style: { fontFamily: 'nanumSquare' },
              }}
              onChange={(event) => {
                setPassword(event.target.value)
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              disabled={username.length < 8 || password.length < 8}
            >
              Sign In
            </Button>

            <Grid container>
              <Link href="/signUp">
                <a>Sign Up</a>
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Body>
  )
}

export default SignIn
