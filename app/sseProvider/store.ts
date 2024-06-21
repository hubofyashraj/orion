import { configureStore } from '@reduxjs/toolkit'
import sseReducer from './reducers';

const store = configureStore({
  reducer: sseReducer
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;