import styled from '@emotion/styled'
import { Avatar, Divider, List, ListItem, ListItemAvatar } from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import EditProfile from '../components/profile/EditProfile'
import { useState } from 'react'
import Head from 'next/head'
import SetPassword from '../components/profile/SetPassword'
import DraftsIcon from '@mui/icons-material/Drafts'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MyContest from '../components/contest/MyContest'
import Manager from '../components/profile/Manager'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FolderIcon from '@mui/icons-material/Folder'
import EditIntroduction from '../components/profile/EditIntroduction'
import MyFree from '../components/free/MyFree'
import LikeContest from '../components/contest/LikeContest'
import LikeFree from '../components/free/LikeFree'

const Body = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  & #profile {
    display: flex;
    margin-top: 4rem;
    width: 100%;
    column-gap: 1.5rem;
    justify-content: center;
  }

  & #section {
    background-color: #f5f5f5;
    border: 0.1rem solid #e2e2e2;
  }
`

const Settings = () => {
  const [category, setCategory] = useState(0)
  const [board, setBoard] = useState('contest')

  return (
    <Body>
      <Head>
        <title>내 프로필</title>
      </Head>
      <div
        id="profile"
        style={{
          height: `100%`,
        }}
      >
        <List
          sx={{
            width: '14rem',
            maxWidth: 360,
            bgcolor: '#f5f5f5',
            height: '40rem',
            border: '0.1rem solid #e2e2e2',
            padding: 0,
          }}
        >
          <ListItem
            button
            onClick={() => {
              setCategory(0)
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={
                  category == 0
                    ? {
                        backgroundColor: '#7c7c7c',
                        transition: '0.5s',
                      }
                    : {
                        backgroundColor: '#bdbdbd',
                        transition: '0.5s',
                      }
                }
              >
                <AccountBoxIcon />
              </Avatar>
            </ListItemAvatar>
            <span>프로필 편집</span>
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              setCategory(5)
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={
                  category == 5
                    ? {
                        backgroundColor: '#7c7c7c',
                        transition: '0.5s',
                      }
                    : {
                        backgroundColor: '#bdbdbd',
                        transition: '0.5s',
                      }
                }
              >
                <AssignmentIcon />
              </Avatar>
            </ListItemAvatar>
            <span>소개</span>
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              setCategory(1)
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={
                  category == 1
                    ? {
                        backgroundColor: '#7c7c7c',
                        transition: '0.5s',
                      }
                    : {
                        backgroundColor: '#bdbdbd',
                        transition: '0.5s',
                      }
                }
              >
                <VpnKeyIcon />
              </Avatar>
            </ListItemAvatar>
            <span>비밀번호 변경</span>
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              setCategory(2)
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={
                  category == 2
                    ? {
                        backgroundColor: '#7c7c7c',
                        transition: '0.5s',
                      }
                    : {
                        backgroundColor: '#bdbdbd',
                        transition: '0.5s',
                      }
                }
              >
                <DraftsIcon />
              </Avatar>
            </ListItemAvatar>
            <span>내 신청 관리</span>
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              setCategory(3)
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={
                  category == 3
                    ? {
                        backgroundColor: '#7c7c7c',
                        transition: '0.5s',
                      }
                    : {
                        backgroundColor: '#bdbdbd',
                        transition: '0.5s',
                      }
                }
              >
                <FavoriteIcon />
              </Avatar>
            </ListItemAvatar>
            <span>좋아요한 게시물</span>
          </ListItem>
          <Divider />
          {category === 3 && (
            <>
              <ListItem
                button
                onClick={() => {
                  setBoard('contest')
                }}
                sx={
                  board === 'contest'
                    ? {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    : {}
                }
              >
                <span>공모전 게시판</span>
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => {
                  setBoard('free')
                }}
                sx={
                  board === 'free'
                    ? {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    : {}
                }
              >
                <span>자유 게시판</span>
              </ListItem>
              <Divider />
            </>
          )}
          <ListItem
            button
            onClick={() => {
              setCategory(4)
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={
                  category == 4
                    ? {
                        backgroundColor: '#7c7c7c',
                        transition: '0.5s',
                      }
                    : {
                        backgroundColor: '#bdbdbd',
                        transition: '0.5s',
                      }
                }
              >
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <span>내 게시물</span>
          </ListItem>
          <Divider />
          {category === 4 && (
            <>
              <ListItem
                button
                onClick={() => {
                  setBoard('contest')
                }}
                sx={
                  board === 'contest'
                    ? {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    : {}
                }
              >
                <span>공모전 게시판</span>
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => {
                  setBoard('free')
                }}
                sx={
                  board === 'free'
                    ? {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    : {}
                }
              >
                <span>자유 게시판</span>
              </ListItem>
              <Divider />
            </>
          )}
        </List>
        <div
          id="section"
          style={{
            width: `${
              category === 3 || category === 4 || category === 2
                ? '58rem'
                : '36rem'
            }`,
          }}
        >
          {category == 0 && <EditProfile />}
          {category == 1 && <SetPassword />}
          {category == 2 && <Manager />}
          {category == 3 && board === 'contest' && (
            <LikeContest board={board} />
          )}
          {category == 3 && board === 'free' && <LikeFree board={board} />}
          {category == 4 && board === 'contest' && <MyContest board={board} />}
          {category == 4 && board === 'free' && <MyFree board={board} />}
          {category == 5 && <EditIntroduction />}
        </div>
      </div>
    </Body>
  )
}

export default Settings
