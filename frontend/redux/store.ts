import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import rootReducer from './rootReducer'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistedReducer = persistReducer(
  { key: 'redux', storage: storage, whitelist: ['user'] },
  rootReducer
)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

const createStore = () => {
  return store
}

const wrapper = createWrapper(createStore)

const persistor = persistStore(store)

declare global {
  type RootState = ReturnType<typeof store.getState>
}

export { persistor, store }
export default wrapper
