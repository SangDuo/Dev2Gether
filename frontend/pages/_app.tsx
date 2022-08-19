import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import global from '../public/css/global'
import Layout from '../components/Layout'
import wrapper, { persistor, store } from '../redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { FunctionComponent, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  axios.defaults.withCredentials = true

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={router.asPath}
            className="mui-fixed"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.4 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.3 },
            }}
          >
            <Layout>
              <Global styles={global} />
              <Component {...pageProps} />
            </Layout>
          </motion.div>
        </AnimatePresence>
      </PersistGate>
    </Provider>
  )
}

export default wrapper.withRedux(App)
