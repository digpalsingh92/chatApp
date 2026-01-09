import { configureStore } from '@reduxjs/toolkit';
import  logger  from 'redux-logger';
import rootReducer from '@/redux/reducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(logger),
});

export default store;