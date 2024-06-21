
import { createSlice } from '@reduxjs/toolkit';
import { Message } from '../chat/types';

const initialState = {
  messages: new Array<[string, Message]>(),
  alerts: new Array<NotificationAlert>(),
  requests: new Array<ConnectRequestAlert>(),
  newPosts: false,
  ping: 'connecting...',
};

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setAlert: (state, action) => {
      state.alerts = action.payload;
    },
    setRequest: (state, action) => {
      state.requests = action.payload;
    },
    setNewPostsFlag: (state, action) => {
      state.newPosts = action.payload
    },
    setPing: (state, action) => {
      state.ping = action.payload;
    },
  },
});

export const { setMessages, setAlert, setRequest, setNewPostsFlag, setPing } = sseSlice.actions;
export default sseSlice.reducer;

