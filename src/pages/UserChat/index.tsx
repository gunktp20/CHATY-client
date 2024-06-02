import {
  Sidebar,
  ChatBox,
  RecipientInfo,
} from "../../components";
import Wrapper from "../../assets/wrappers/UserChat";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setOnlineUsers } from "../../features/chat/chat.slice";
import { Socket, io } from "socket.io-client";


function UserChat() {
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { userId, email } = useAppSelector((state) => state.auth);
  const { chatSelected } = useAppSelector((state) => state.chat);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null) return;

    const userInfo = {
      userId: userId,
      email: email,
    };
    socket.emit("addNewUser", userInfo);

    socket.on("getOnlineUsers", (res) => {
      console.log("getOnlineUsers", res);
      dispatch(setOnlineUsers(res));
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  return (
    <Wrapper>
      <Sidebar />
      <ChatBox socket={socket} />
      <RecipientInfo />
    </Wrapper>
  );
}

export default UserChat;
