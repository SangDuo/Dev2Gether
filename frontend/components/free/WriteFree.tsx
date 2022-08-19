import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import styled from '@emotion/styled'
import CancelIcon from '@mui/icons-material/Cancel'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import {
  setLoading,
  setModal,
  setSnackBar,
} from '../../redux/silces/alertSlice'
import Router from 'next/router'
import dynamic from 'next/dynamic'

const Content = styled.div`
  margin-top: 1.5rem;
  & .ck-editor__editable_inline {
    min-height: 16rem;
  }
`

const Editor = dynamic(() => import('../editor/Editor'), { ssr: false })

const WriteFree: FunctionComponent<{
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ setOpen }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const dispatch = useDispatch()

  const submitHandler = useCallback(() => {
    setOpen(false)
    dispatch(setLoading(true))
    axios
      .post('http://163.44.181.194:1212/api/board/free', {
        title: title,
        content: content,
      })
      .then((response) => {
        dispatch(setLoading(false))
        Router.push(`/board/free/${response.data.id}`).then(() => {
          dispatch(setSnackBar([true, '정상적으로 게시물이 작성되었습니다.']))
        })
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [setOpen, dispatch, title, content])

  return (
    <>
      <DialogTitle sx={{ fontFamily: 'nanumSquare' }}>게시물 작성</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="none"
          inputProps={{ style: { fontFamily: 'nanumSquare' } }}
          fullWidth
          label="제목"
          InputLabelProps={{ style: { fontFamily: 'nanumSquare' } }}
          placeholder="제목"
          onChange={(event) => {
            setTitle(event.target.value)
          }}
          value={title}
          sx={{ mt: '1rem' }}
        />

        {title.length > 30 && (
          <DialogContentText
            fontFamily="nanumSquare"
            sx={{ fontSize: '0.9rem', color: 'red', marginBottom: '0.5rem' }}
          >
            제목은 30자 이하이어야 합니다.
          </DialogContentText>
        )}
        <Content>
          <Editor
            onChange={(event, editor) => {
              setContent(editor.getData())
            }}
            data=""
          />
        </Content>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false)
          }}
        >
          취소
        </Button>
        <Button onClick={submitHandler} disabled={title.length > 30}>
          작성
        </Button>
      </DialogActions>
    </>
  )
}

export default WriteFree
