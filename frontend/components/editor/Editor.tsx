import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Base64UploadAdapter from './plugin/Base64Upload'
import React from 'react'

const Editor = ({ onChange, data }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        placeholder: '내용을 입력하세요.',
        extraPlugins: [Base64UploadAdapter],
      }}
      data={data}
      onChange={onChange}
    />
  )
}

export default Editor
