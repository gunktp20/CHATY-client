import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface IUser {
  email: string;
  userId: string;
  socketId: string;
}

interface IUserChat {
  _id: string;
  members: { user: { _id: string; email: string }; isUptoDate: boolean }[];
  lastestMessage: {
    message: string;
    senderId: string;
  };
}
[];

interface IChatState {
  userChats: IUserChat[];
  chatSelected: string;
  onlineUsers: IUser[];
  recipientUser: string;
  chatNotifications: IMessage[];
}

interface IMessage {
  chatId: string;
  createdAt: string;
  senderId: string;
  text: string;
  _id: string;
}

const initialState: IChatState = {
  userChats: [],
  chatSelected: "",
  onlineUsers: [],
  recipientUser: "",
  chatNotifications: [],
};

const ChatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setUserChats: (state, action) => {
      return {
        ...state,
        userChats: action.payload,
      };
    },
    setOnlineUsers: (state, action) => {
      return {
        ...state,
        onlineUsers: action.payload,
      };
    },
    setRecipientUser: (state, action) => {
      return {
        ...state,
        recipientUser: action.payload,
      };
    },
    setChatSelected: (state, action) => {
      return {
        ...state,
        chatSelected: action.payload,
      };
    },
    setChatNotifications: (state, action) => {
      return {
        ...state,
        chatNotifications: action.payload,
      };
    },
  },
});

export const {
  setUserChats,
  setOnlineUsers,
  setRecipientUser,
  setChatSelected,
  setChatNotifications,
} = ChatSlice.actions;

export default ChatSlice.reducer;
