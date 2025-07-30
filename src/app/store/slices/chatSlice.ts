import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Chat {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
}

const initialState: ChatState = {
  chats: [],
  selectedChatId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    selectChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
    },
    clearChats: (state) => {
      state.chats = [];
      state.selectedChatId = null;
    },
  },
});

export const { setChats, selectChat, clearChats } = chatSlice.actions;

export default chatSlice.reducer;
