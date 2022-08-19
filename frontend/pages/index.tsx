import styled from '@emotion/styled'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PeopleIcon from '@mui/icons-material/People'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import ComputerIcon from '@mui/icons-material/Computer'
import { motion, useScroll, useSpring } from 'framer-motion'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Router from 'next/router'

const Body = styled(motion.div)``

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0.3rem;
  background-color: #b0b0b0;
  mix-blend-mode: difference;
  transform-origin: 0%;
  z-index: 2;
`

const Title = styled(motion.div)`
  position: relative;
  height: 44rem;
  overflow: hidden;
  z-index: 1;
  color: white;
  font-weight: bold;

  & .container {
    display: flex;
    flex-direction: column;
    margin: 11rem 0 0 15rem;
  }

  & .background {
    z-index: -1;
    width: 100vw;
    height: 100%;
    object-fit: cover;
    position: absolute;
  }

  & .title {
    color: #afbffc;
    font-size: 5.5rem;
    font-weight: 1000;
    letter-spacing: -0.2rem;
  }

  & .subtitle {
    font-size: 3rem;
  }

  & .signIn {
    font-size: 1rem;
    width: 12rem;
    margin-top: 1.8rem;
    background-color: white;
    color: black;
    transition: 1s;
  }

  & .signIn:hover {
    background-color: #b5b3b3;
  }
`

const Section_1 = styled(motion.div)`
  background-color: #f5f5f5;
  height: 40rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;

  & .description_1 {
    padding-top: 2rem;
    font-size: 3.2rem;
    font-weight: bold;
  }

  & .description_2 {
    font-size: 1.4rem;
  }

  & .marks {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 40rem;
    padding-right: 2rem;
  }

  & > .marks > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  & .mark_description {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1rem;
  }
`

const Mark = styled(motion.div)`
  border-radius: 50%;
  height: 10rem;
  width: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: white;
`

const Section_2 = styled(motion.div)`
  height: 42rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-weight: bold;

  & .description_1 {
    padding-top: 2rem;
    font-size: 3.7rem;
    font-weight: bold;
  }

  & .description_2 {
    font-size: 3rem;
  }
`

const Image = styled(motion.img)`
  position: fixed;
  z-index: -1;
  top: 0;
  object-fit: cover;
  width: 100%;
`

const Footer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  height: 8rem;
  color: black;
  font-size: 1.2rem;
  font-weight: bold;
`

const Index = () => {
  const [modal, setModal] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })
  const login = useSelector((state: RootState) => {
    return state.user.login
  })

  const clickHandler = useCallback(() => {
    login ? Router.push('/board/contest') : setModal(true)
  }, [login])

  return (
    <Body>
      <Head>
        <title>DevTogether</title>
      </Head>
      <ProgressBar style={{ scaleX }} />
      <Title>
        <motion.img
          className="background"
          src="img/contest.jpg"
          alt=""
          initial={{ scale: 1.3, filter: 'blur(0px) brightness(70%)' }}
          animate={{
            scale: 1,
            filter: 'blur(3px) brightness(40%)',
            transition: { duration: 2.5 },
          }}
        />
        <motion.div className="container">
          <motion.div
            className="title"
            initial={{
              opacity: 0,
              x: 15,
              filter: 'blur(4px)',
            }}
            animate={{
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              transition: { duration: 1, delay: 0.5 },
            }}
          >
            DEV
            <span
              style={{ fontSize: '9rem', fontWeight: 'bolder', color: 'white' }}
            >
              2
            </span>
            GETHER
          </motion.div>
          <motion.div
            className="subtitle"
            initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              transition: { duration: 1, delay: 1 },
            }}
          >
            함께해요, 공모전!
          </motion.div>
          <motion.div
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            animate={{
              opacity: 0.8,
              filter: 'blur(0px)',
              transition: { duration: 1.5, delay: 1.5 },
            }}
          >
            <Button
              className="signIn"
              variant="contained"
              onClick={clickHandler}
              startIcon={<PlayArrowIcon />}
            >
              <div>Get Started</div>
            </Button>
          </motion.div>
        </motion.div>
      </Title>
      <Section_1>
        <motion.div
          initial={{ opacity: 0, filter: 'blur(3px)' }}
          whileInView={{
            opacity: 1,
            filter: 'blur(0px)',
            transition: { duration: 1, delay: 0.3 },
          }}
          className="description_1"
        >
          우리 소통해요~
        </motion.div>
        <motion.div
          className="description_2"
          initial={{ opacity: 0, filter: 'blur(2px)' }}
          whileInView={{
            opacity: 1,
            filter: 'blur(0px)',
            transition: { delay: 0.5, duration: 1 },
          }}
        >
          <b
            style={{
              fontSize: '1.8rem',
              color: '#849af4',
              letterSpacing: '-0.15rem',
            }}
          >
            {'DEV TOGETHER'}
          </b>{' '}
          는 스펙을 쌓고 싶은 개발자 진로 희망 대학생들을 위한 공모전 팀원{' '}
          <b>구인구직</b> 웹 서비스입니다.
        </motion.div>
        <motion.div className="marks">
          <div>
            <Mark>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 1, duration: 0.5 },
                }}
              >
                <PeopleIcon sx={{ fontSize: '5rem' }} />
              </motion.div>
            </Mark>
            <motion.div
              className="mark_description"
              initial={{ opacity: 0, filter: 'blur(3px)' }}
              whileInView={{
                opacity: 1,
                filter: 'blur(0px)',
                transition: { delay: 1, duration: 0.5 },
              }}
            >
              Communication
            </motion.div>
          </div>
          <div>
            <Mark>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 1.5, duration: 0.5 },
                }}
              >
                <AutoStoriesIcon sx={{ fontSize: '5rem' }} />
              </motion.div>
            </Mark>
            <motion.div
              className="mark_description"
              initial={{ opacity: 0, filter: 'blur(3px)' }}
              whileInView={{
                opacity: 1,
                filter: 'blur(0px)',
                transition: { delay: 1.5, duration: 0.5 },
              }}
            >
              Study
            </motion.div>
          </div>
          <div>
            <Mark>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 2, duration: 0.5 },
                }}
              >
                <ComputerIcon sx={{ fontSize: '5rem' }} />
              </motion.div>
            </Mark>
            <motion.div
              className="mark_description"
              initial={{ opacity: 0, filter: 'blur(3px)' }}
              whileInView={{
                opacity: 1,
                filter: 'blur(0px)',
                transition: { delay: 2, duration: 0.5 },
              }}
            >
              Developement
            </motion.div>
          </div>
        </motion.div>
      </Section_1>
      <Section_2
        initial={{ backdropFilter: 'blur(0px) brightness(40%)' }}
        whileInView={{
          backdropFilter: 'blur(2px) brightness(70%)',
          transition: { duration: 2.5 },
        }}
      >
        <motion.div
          className="description_1"
          initial={{ opacity: 0, filter: 'blur(3px)' }}
          whileInView={{
            opacity: 1,
            filter: 'blur(0px)',
            transition: { delay: 0.5, duration: 1 },
          }}
        >
          너, 아직도 혼자 공모전 나가니?
        </motion.div>
        <motion.div
          className="description_2"
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          whileInView={{
            opacity: 0.8,
            filter: 'blur(0px)',
            transition: { delay: 0.8, duration: 1 },
          }}
        >
          {/** */}
        </motion.div>
      </Section_2>
      <Image src="img/zo_glass.jpg" alt=""></Image>
      <Footer>
        <Box
          textAlign="center"
          style={{
            fontWeight: 'bold',
            margin: '0',
            fontSize: '0.9rem',
          }}
        >
          <div>Copyright © Dev2Gether 2022. All rights reserved.</div>
          <div>https://github.com/SangDuo</div>
        </Box>
      </Footer>
      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={modal}
        onClose={() => {
          setModal(false)
        }}
      >
        <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>알림</DialogTitle>
        <DialogContent>로그인이 필요한 서비스입니다.</DialogContent>
        <DialogActions>
          <Link href="/signIn">
            <Button>로그인</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </Body>
  )
}

export default Index
