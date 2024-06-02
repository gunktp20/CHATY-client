import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { PiChatCenteredSlashLight } from "react-icons/pi";
import api from "../services/api";
import moment from "moment";
import { Socket } from "socket.io-client";
import { SyntheticEvent } from "react";
import {
  setChatNotifications,
  setUserChats,
} from "../features/chat/chat.slice";
import { MdNotifications } from "react-icons/md";

interface IProp {
  socket: Socket | null;
}

interface IMessage {
  chatId: string;
  createdAt: string;
  senderId: string;
  text: string;
  _id: string;
}

function ChatBox({ socket }: IProp) {
  const { chatSelected, recipientUser, chatNotifications } = useAppSelector(
    (state) => state.chat
  );
  const dispatch = useAppDispatch();
  const { userId, email, token } = useAppSelector((state) => state.auth);
  const { userChats } = useAppSelector((state) => state.chat);
  const [currentChat, setCurrentChat] = useState<
    { _id: string; text: string; senderId: string; createdAt: string }[]
  >([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingBobbleRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  // handle typing both of talkers
  const [typing, setTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);

  const getChat = async () => {
    const { data } = await api.get(`/message/${chatSelected}`);
    setCurrentChat(data);
    messageEndRef.current?.scrollIntoView();
  };

  const [timeoutIds, setTimeoutIds] = useState([]);
  // Function to clear all running timeouts
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    setTimeoutIds([]); // Clear the timeout IDs from state
  };

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    if (event.target.value === "") {
      setTyping(false);
      socket?.emit("senderStopTyping", {
        chatId: chatSelected,
        email,
      });
      return clearAllTimeouts();
    }
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setTyping(true);
      socket?.emit("typing", {
        chatId: chatSelected,
        email,
      });
    }, 500);
    setTimeoutIds([newTimeoutId]); // Store the new timeout ID in state
  };

  const sendMessage = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    event.preventDefault();
    if (!message) return alert("Please provide a message");

    const response = await api.post(
      `message/`,
      {
        chatId: chatSelected,
        senderId: userId,
        text: message,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessage("");
    socket?.emit("sendMessage", {
      message: response.data,
      recipientId: recipientUser,
    });

    setTyping(false);
    socket?.emit("senderStopTyping", {
      chatId: chatSelected,
      email,
    });
    clearAllTimeouts();
    setCurrentChat([...currentChat, response.data]);

    const newUserChats = await userChats.map((chat) => {
      if (chat?._id === response.data?.chatId) {
        return {
          ...chat,
          lastestMessage: {
            message,
            senderId: userId,
          },
        };
      }
      return chat;
    });
    dispatch(setUserChats(newUserChats));
  };

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", async (newMessage: IMessage) => {
      console.log("GET_MSG", newMessage);
      if (!chatSelected || chatSelected !== newMessage?.chatId) {
        // const newNotifications =
        //   chatNotifications.length === 0
        //     ? [newMessage]
        //     : chatNotifications.push(newMessage);
        // console.log(newNotifications);
        // console.log([...chatNotifications, newMessage])
        dispatch(setChatNotifications([...chatNotifications, newMessage]));
        // console.log([...chatNotifications, newMessage]);
        return;
      }
      setRecipientTyping(false);
      setCurrentChat([...currentChat, newMessage]);

      const newUserChats = await userChats.map((chat) => {
        if (chat?._id === newMessage?.chatId) {
          return {
            ...chat,
            lastestMessage: {
              message: newMessage?.text,
              senderId: newMessage?.senderId,
            },
          };
        }
        return chat;
      });
      console.log("newUserChats", newUserChats);
      dispatch(setUserChats(newUserChats));
    });

    socket.on("someoneTypingToYou", (res) => {
      setRecipientTyping(true);
      setTimeout(() => {
        moveToBottomChatBox();
      }, 100);
    });
    socket.on("leaveTypingToYou", (res) => {
      console.log(res);
      setRecipientTyping(false);
    });

    messageEndRef.current?.scrollIntoView();
  }, [socket, currentChat]);

  useEffect(() => {
    if (chatSelected) {
      socket?.emit("chatting", {
        email,
        chatId: chatSelected,
      });
      getChat();
    }
  }, [chatSelected]);

  const moveToBottomChatBox = () => {
    messageEndRef.current?.scrollIntoView();
  };

  return (
    <div className="flex-grow h-[100%] relative ">
      {!chatSelected && (
        <div className="w-[100%] flex flex-col text-[12.5px] justify-center h-[100%] items-center text-gray-400">
          <PiChatCenteredSlashLight className="text-[100px] mb-6 text-gray-300" />
          <div>You haven't chosen a conversation partner yet.</div>
        </div>
      )}
      {/* Message Container */}
      {chatSelected && (
        <div className="flex w-[100%] flex-col overflow-y-scroll h-[93%]">
          {currentChat.length > 0 &&
            currentChat.map((m, index) => {
              if (m?.senderId === userId) {
                return (
                  <div className={`w-[100%] flex`} key={index}>
                    {/* Message  */}
                    <div className="flex w-[100%] justify-end mt-8 p-2 px-10">
                      <div className="w-[40%] flex justify-end h-[100%]">
                        <div className="relative bg-[#0084ff] text-[#fff] pt-2 pb-2 text-sm pl-5 pr-5 rounded-[10px] max-w-[500px] break-words">
                          <div className="h-[100%]">{m?.text}</div>
                          <div className="absolute bottom-[-1.3rem] text-[11px] w-max right-1 text-[#00000098]">
                            {moment(m?.createdAt).calendar()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className={`w-[100%] flex`} key={index}>
                    {/* Message  */}
                    <div className="flex w-[100%] justify-start mt-8 p-2 px-10">
                      <div className="w-[40%] flex justify-start h-[100%]">
                        <div className="relative bg-[#f0f0f0] text-[#000] pt-2 pb-2 text-sm pl-5 pr-5 rounded-[10px] max-w-[500px] break-words">
                          <div className="h-[100%]">{m?.text}</div>
                          <div className="absolute bottom-[-1.3rem] text-[11px] w-max left-0 text-[#00000098]">
                            {moment(m?.createdAt).calendar()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}

          {recipientTyping && (
            <div className="flex mb-12 w-[100%] justify-start mt-8 pl-10">
              <div className="w-[40%]">
                <div className="relative bg-[#f0f0f0] text-[#000] pt-3 pb-3 text-sm pl-5 pr-5 rounded-[10px] flex w-fit">
                  <span className="circle scaling"></span>
                  <span className="circle scaling"></span>
                  <span className="circle scaling"></span>
                </div>
              </div>
            </div>
          )}

          {/* Message End Ref */}
          <div ref={messageEndRef}></div>

          <form
            onSubmit={(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
              sendMessage(event);
            }}
            className="left-0 absolute bottom-0 bg-white pt-3 pb-3 w-[100%] border-t-[1px] border-[#00000048] pl-5 pr-5"
          >
            <input
              value={message}
              onChange={(event) => {
                handleTyping(event);
              }}
              type="text"
              placeholder="Aa"
              className="bg-[#f0f2f5] text-[#333] rounded-[100px] focus : outline-none pt-[0.5rem] pb-[0.5rem] pl-5 w-[100%]"
            ></input>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
