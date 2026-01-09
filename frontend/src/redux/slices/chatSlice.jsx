import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  loading: false,
  selectedChat: null,
  messages: [],
  messagesLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    clearSelectedChat(state) {
      state.selectedChat = null;
      state.messages = [];
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setMessagesLoading(state, action) {
      state.messagesLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setChats,
  setSelectedChat,
  clearSelectedChat,
  setMessages,
  addMessage,
  setLoading,
  clearLoading,
  setMessagesLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;