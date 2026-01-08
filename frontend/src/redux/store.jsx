import { configureStore } from '@reduxjs/toolkit'
import Reducer from '@/redux/reducer'

export const store = configureStore({
  reducer: Reducer,
})