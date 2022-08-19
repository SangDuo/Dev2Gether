import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { shallowEqual, useSelector } from 'react-redux'
import {
  setLoading,
  setModal,
  setSnackBar,
} from '../../redux/silces/alertSlice'
import { setProfile, Profile } from '../../redux/silces/userSlice'

const Content = styled.div`
  margin-top: 5rem;

  & .ck-editor__editable_inline {
    min-height: 25rem;
  }
`

const Editor = dynamic(() => import('../editor/Editor'), { ssr: false })

const EditIntroduction = () => {
  const profile = useSelector((state: RootState) => {
    return state.user.profile
  }, shallowEqual)
  const dispatch = useDispatch()
  const [content, setContent] = useState(profile?.introduction)

  const editHandler = useCallback(() => {
    dispatch(setLoading(true))
    axios
      .post('http://163.44.181.194:1212/setting/introduction', {
        introduction: content,
      })
      .then((response: AxiosResponse<Profile>) => {
        console.log(response.data)
        dispatch(setProfile(response.data))
        dispatch(setLoading(false))
        dispatch(setSnackBar([true, '수정되었습니다.']))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [content])

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(2px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(2px)' }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ m: '30px 30px' }}>
        <b style={{ fontSize: '3rem' }}>소개</b>
        <p>내 자기소개를 수정할 수 있습니다.</p>
      </Box>
      <Content>
        <Editor
          onChange={(event, editor) => {
            setContent(editor.getData())
          }}
          data={content}
        />
      </Content>
      <Box display="flex" justifyContent="center" sx={{ m: '60px 30px' }}>
        <Button
          variant="outlined"
          onClick={editHandler}
          disabled={content === undefined || content === ''}
        >
          {profile?.introduction ? '수정' : '작성'}
        </Button>
      </Box>
    </motion.div>
  )
}

export default EditIntroduction
