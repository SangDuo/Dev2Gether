import styled from '@emotion/styled'
import { Avatar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import LoginIcon from '@mui/icons-material/Login'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import axios, { Axios, AxiosError } from 'axios'
import { setLogin, setProfile } from '../redux/silces/userSlice'
import Router from 'next/router'
import { setLoading, setModal, setSnackBar } from '../redux/silces/alertSlice'
import { motion } from 'framer-motion'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const Body = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border: 0.1rem solid #d5d5d5;
  height: 5rem;
  z-index: 5;

  & .profile {
    transition: background-color 0.5s;
  }

  & .profile:hover {
    background-color: #969696;
    cursor: pointer;
  }

  & .signIn {
    font-size: 1rem;
    width: 8rem;
    color: black;
    border: 0.1rem solid #b5b3b3;
    transition: background-color 1s;
  }

  & .signIn:hover {
    border: 0.1rem solid #b5b3b3;
    background-color: #b5b3b3;
    cursor: pointer;
  }
`

const ContestBoard = styled(Button)`
  font-size: 1.1rem;
  margin-left: 3rem;
  transition: 0.5s;
  color: black;
  font-family: nanumSquare;

  &:hover {
    background-color: #92929223;
  }
`

const FreeBoard = styled(Button)`
  font-size: 1.1rem;
  transition: 0.5s;
  color: black;
  font-family: nanumSquare;

  &:hover {
    background-color: #92929223;
  }
`

const Header = () => {
  const [anchor, setAnchor] = useState<HTMLElement>()
  const [menu, setMenu] = useState(false)
  const { login, profile } = useSelector((state: RootState) => {
    return state.user
  })
  const dispatch = useDispatch()

  const logoutHandler = useCallback(() => {
    dispatch(setLoading(true))
    axios
      .get('http://163.44.181.194:1212/auth/logout')
      .then((response) => {
        dispatch(setLogin(false))
        Router.replace('/').then(() => {
          dispatch(setProfile(undefined))
          dispatch(setLoading(false))
        })
        dispatch(setSnackBar([true, '정상적으로 로그아웃 되었습니다.']))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch])

  return (
    <Body>
      {Router.asPath.includes('/board/contest/') && (
        <IconButton
          aria-label="back"
          size="large"
          sx={{ ml: '0.5rem' }}
          onClick={() => {
            Router.push('/board/contest')
          }}
        >
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
      )}
      <Link href="/">
        <motion.div
          style={{
            fontSize: '1.7rem',
            marginLeft: Router.asPath.includes('/board/contest/')
              ? '0.5rem'
              : '2rem',
            opacity: 1,
            fontWeight: 900,
            color: '#849af4',
            letterSpacing: '-0.15rem',
          }}
          whileHover={{
            opacity: 0.6,
            transition: { duration: 0.5 },
            cursor: 'pointer',
          }}
        >
          DEV TOGETHER
        </motion.div>
      </Link>
      {login && (
        <>
          <Link href="/board/contest">
            <ContestBoard
              style={
                Router.asPath.includes('/board/contest')
                  ? { backgroundColor: '#92929223', fontWeight: 'bold' }
                  : { fontWeight: 'bold' }
              }
            >
              공모전 게시판
            </ContestBoard>
          </Link>
          <hr
            style={{
              height: '1.8rem',
              width: '0.15rem',
              borderWidth: 0,
              opacity: '0.8',
              backgroundColor: '#000',
              margin: '0 1rem',
            }}
          />
          <Link href="/board/free">
            <FreeBoard
              style={
                Router.asPath.includes('/board/free')
                  ? { backgroundColor: '#92929223', fontWeight: 'bold' }
                  : { fontWeight: 'bold' }
              }
            >
              자유 게시판
            </FreeBoard>
          </Link>
        </>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
        }}
      >
        <Avatar
          className="profile"
          alt=""
          sx={{ width: '3rem', height: '3rem', mr: '1rem' }}
          onClick={(event) => {
            setAnchor(event.currentTarget)
            setMenu(true)
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box sx={{ mr: '5rem' }}>
          {!login ? (
            <Link href="/signIn">
              <Button
                className="signIn"
                variant="outlined"
                startIcon={<LoginIcon />}
              >
                <div>Sign In</div>
              </Button>
            </Link>
          ) : (
            <motion.div
              whileHover={{
                opacity: 0.6,
                transition: { duration: 0.4 },
              }}
            >
              <Link href="/settings">
                <b style={{ fontSize: '1.4rem', cursor: 'pointer' }}>
                  {profile?.fakename ? profile?.fakename : profile?.username}
                </b>
              </Link>
            </motion.div>
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchor}
        open={menu}
        onClose={() => {
          setMenu(false)
        }}
        onClick={() => {
          setMenu(false)
        }}
        sx={{ mt: 1 }}
        disableAutoFocusItem
      >
        {login ? (
          <div>
            <Link href="/settings">
              <MenuItem>My Profile</MenuItem>
            </Link>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </div>
        ) : (
          <Link href="/signIn">
            <MenuItem>Login</MenuItem>
          </Link>
        )}
      </Menu>
    </Body>
  )
}

export default Header
