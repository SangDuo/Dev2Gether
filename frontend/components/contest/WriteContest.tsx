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

const WholeBox = styled.div`
  font-family: 'nanumSquare';
  margin-top: 1rem;
`

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: transparent;
  }
  &:hover {
    border-color: transparent;
  }
  & .MuiOutlinedInput-root,
  & .MuiOutlinedInput-root:hover {
    &.Mui-focused fieldset {
      border-color: transparent;
    }
    & fieldset {
      border-color: transparent;
    }
  }
`

const TagBox = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 40px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;

  &:focus-within {
    border: 2px solid #8c62e6;
  }
`

const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  padding: 5px;
  background-color: #7592ea;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
`

const TagInput = styled(WhiteBorderTextField)`
  display: inline-flex;
  width: auto;
  background: transparent;
  border: none;
  outline: none;
  cursor: text;
`

const Content = styled.div`
  margin-top: 1.5rem;
  & .ck-editor__editable_inline {
    min-height: 16rem;
  }
`

const Tag: FunctionComponent<{
  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
}> = ({ tags, setTags }) => {
  const [tagItem, setTagItem] = useState('')

  const submitTagItem = useCallback(() => {
    const updatedTags = [...tags]
    updatedTags.push(tagItem)
    setTags(updatedTags)
    setTagItem('')
  }, [tags, setTags, tagItem])

  const onKeyPress = useCallback(
    (e: any) => {
      if (tags.join('').length + tagItem.length >= 30) {
        e.preventDefault()
        tagItem.length !== 0 && submitTagItem()
      } else if (
        e.target.value.length !== 0 &&
        e.target.value !== ' ' &&
        (e.key === ' ' || e.key === 'Enter')
      ) {
        if (!tags.includes(tagItem)) {
          e.preventDefault()
          submitTagItem()
        } else if (e.key === ' ') {
          e.preventDefault()
        }
      } else if (
        (e.target.value.length === 0 || e.target.value === ' ') &&
        (e.key === ' ' || e.key === 'Enter')
      ) {
        e.preventDefault()
      }
    },
    [submitTagItem, tags, tagItem]
  )

  const onKeyDown = useCallback(
    (e: any) => {
      if ((tagItem === '' || tagItem.length === 0) && e.key === 'Backspace') {
        e.preventDefault()
        setTags((current) => {
          return [...current].slice(0, -1)
        })
      }
    },
    [setTags, tagItem]
  )

  const deleteTagItem = useCallback(
    (e) => {
      const deleteTagItem = e.target.parentElement.firstChild.innerText
      const filteredTagList = tags.filter(
        (tagItem) => tagItem !== deleteTagItem
      )
      setTags(filteredTagList)
    },
    [setTags, tags]
  )

  return (
    <WholeBox>
      <TagBox>
        {tags.map((tagItem, index) => {
          return (
            <TagItem onClick={deleteTagItem} key={index}>
              <span>{tagItem} </span>
              <CancelIcon sx={{ ml: '0.2rem' }} />
            </TagItem>
          )
        })}
        <TagInput
          type="text"
          tabIndex={2}
          onChange={(e) => setTagItem(e.target.value)}
          value={tagItem}
          placeholder="해쉬태그"
          InputProps={{ style: { fontFamily: 'nanumSquare' } }}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
        />
      </TagBox>
      {tags.join('').length >= 30 && (
        <DialogContentText
          fontFamily="nanumSquare"
          sx={{ fontSize: '0.9rem', color: 'red', mt: '0.5rem' }}
        >
          해쉬태그는 총 30글자 이하이어야 합니다.
        </DialogContentText>
      )}
    </WholeBox>
  )
}

const Editor = dynamic(() => import('../editor/Editor'), { ssr: false })

const WriteContest: FunctionComponent<{
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ setOpen }) => {
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [count, setCount] = useState(2)
  const dispatch = useDispatch()

  const submitHandler = useCallback(() => {
    setOpen(false)
    dispatch(setLoading(true))
    axios
      .post('http://163.44.181.194:1212/api/board/contest', {
        title: title,
        tag: tags,
        content: content,
        join_count: count,
      })
      .then((response) => {
        dispatch(setLoading(false))
        Router.push(`/board/contest/${response.data.id}`).then(() => {
          dispatch(setSnackBar([true, '정상적으로 게시물이 작성되었습니다.']))
        })
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [setOpen, dispatch, title, tags, content, count])

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
        <FormControl fullWidth sx={{ mt: '1rem' }}>
          <InputLabel id="count" sx={{ fontFamily: 'nanumSquare' }}>
            팀원 수
          </InputLabel>
          <Select
            labelId="count"
            value={count}
            label="팀원 수"
            onChange={(event) => {
              setCount(event.target.value as number)
            }}
            inputProps={{ style: { fontFamily: 'nanumSquare' } }}
            sx={{ fontFamily: 'nanumSquare' }}
          >
            <MenuItem value={2} selected sx={{ fontFamily: 'nanumSquare' }}>
              2인
            </MenuItem>
            <MenuItem value={3} sx={{ fontFamily: 'nanumSquare' }}>
              3인
            </MenuItem>
            <MenuItem value={4} sx={{ fontFamily: 'nanumSquare' }}>
              4인
            </MenuItem>
            <MenuItem value={5} sx={{ fontFamily: 'nanumSquare' }}>
              5인
            </MenuItem>
          </Select>
        </FormControl>

        <Tag tags={tags} setTags={setTags} />
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
        <Button
          onClick={submitHandler}
          disabled={title.length > 30 || tags.join('').length >= 30}
        >
          작성
        </Button>
      </DialogActions>
    </>
  )
}

export default WriteContest
