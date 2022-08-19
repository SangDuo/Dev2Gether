import { css } from '@emotion/react'

const global = css`
  @import url('https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css');
  html,
  body,
  div#__next {
    margin: 0;
    width: 100%;
    height: 100%;
    font-family: 'NanumSquare';
  }
`

export default global
