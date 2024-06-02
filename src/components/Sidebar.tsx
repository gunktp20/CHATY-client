import { useEffect, useState } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "../app/hook";
import useAlert from "../hooks/useAlert";
import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";
import { ChatItem, Logo } from "./index";
import { GrSearch } from "react-icons/gr";
import userAvatar from "../assets/images/user-avatar.png";
import { FaUserFriends } from "react-icons/fa";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { BiSolidDonateHeart } from "react-icons/bi";
import {
  setRecipientUser,
  setChatSelected,
  setUserChats,
  setChatNotifications,
} from "../features/chat/chat.slice";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  roles: [];
  iat: number;
  exp: number;
}

function Sidebar() {
  const { onlineUsers, chatNotifications, userChats } = useAppSelector(
    (state) => state.chat
  );

  const { userId } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [allUsers, setAllUsers] = useState<{ _id: string; email: string }[]>(
    []
  );

  const [search, setSearch] = useState<string>("");
  const { token } = useAppSelector((state) => state.auth);
  const [selectedOption, setSelectedOption] = useState<string>("friend");

  const { displayAlert } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const decoded: AccessTokenPayload = jwtDecode(token);

  const startChatting = async (recipientId: string) => {
    try {
      const { data } = await api.post("chat/", {
        firstId: decoded?.userId,
        secondId: recipientId,
      });
      dispatch(setChatSelected(data?._id));
      console.log(data?._id);
      getUserChats();
    } catch (err) {
      console.log(err);
    }
  };

  const getUserChats = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/chat/${userId}`);
      console.log("userChats", data);
      dispatch(setUserChats(data));
      return setIsLoading(false);
    } catch (err) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg: msg,
        type: "error",
      });
      return setIsLoading(false);
    }
  };

  const getUnreadChats = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/chat/checkUnread/${userId}`);
      console.log("unread chats", data);
      dispatch(setChatNotifications(data));
      return setIsLoading(false);
    } catch (err) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg: msg,
        type: "error",
      });
      return setIsLoading(false);
    }
  };

  const getAllUsers = async () => {
    const { data } = await api.get("/user");
    console.log(data);
    setAllUsers(data);
  };

  useEffect(() => {
    getAllUsers();
    getUserChats();
    getUnreadChats();
  }, []);

  return (
    <div className="bg-white w-[380px] h-[100%] border-r-[1px] shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 justify-center mt-10">
        <Logo width="30px" />
        <div className="font-semibold text-[22px] text-primary-400">CHATY</div>
      </div>
      {/* Search Input */}
      <div className="max-w-sm space-y-3 px-6">
        <div className="relative">
          <input
            type="email"
            className="peer py-3 px-4 ps-11 block w-full bg-gray-100 border-[1px] focus:border-primary-700 outline-none rounded-lg text-[12.2px] disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Search Contract"
          ></input>
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
            <GrSearch className="w-[18px] h-[18px]" />
          </div>
        </div>
      </div>
      <div className="w-[100%] flex gap-9 px-6 mt-6">
        {/* Option */}
        <div
          onClick={() => {
            setSelectedOption("friend");
          }}
          className="text-[20px] text-[#0000007a] bg-[#e4e6eb] p-2 rounded-xl cursor-pointer"
        >
          <FaUserFriends />
        </div>
        {/* Option */}
        <div
          onClick={() => {
            setSelectedOption("chat");
          }}
          className="relative text-[20px] text-[#0000007a] bg-[#e4e6eb] p-2 rounded-xl cursor-pointer"
        >
          <IoChatboxEllipsesSharp />
          {chatNotifications.length > 0 && (
            <div className="absolute top-[-0.5rem] right-[-0.3rem] text-[11.4px] bg-red-500 text-white rounded-[100%] h-[19px] w-[19px] flex justify-center items-center">
              {chatNotifications?.length}
            </div>
          )}
        </div>
      </div>

      {/* Friends */}
      {selectedOption === "friend" && (
        <div className="h-[60%] flex flex-col overflow-y-scroll mt-6">
          {allUsers.length > 0 &&
            allUsers.map((user, index) => {
              if (user._id === userId) return;

              const isOnline = onlineUsers?.some((u) => {
                return user?._id === u?.userId;
              });

              return (
                <div
                  onClick={() => {
                    dispatch(setRecipientUser(user._id));
                    startChatting(user._id);
                  }}
                  key={index}
                  className={`w-[100%] p-5 py-4 border-[#472d2d36] flex cursor-pointer`}
                >
                  {/* User Info */}
                  <div className="relative flex w-[100%] h-[100%] pl-3">
                    <div className=" rounded-[100%] h-[40px] w-[40px] flex items-center justify-center">
                      <img src={userAvatar} className="opacity-[58%]"></img>
                    </div>
                    <div className=" flex-grow flex justify-center pl-5 flex-col">
                      <div className="text-sm mb-1">{user?.email}</div>
                      <div className="text-[11.3px]">
                        {isOnline ? "online" : "offline"}
                      </div>
                    </div>
                    <div
                      className={`absolute bottom-[0px] left-[2.55rem] ${
                        isOnline ? "bg-green-500" : "bg-none bg-red-500"
                      } rounded-[100%] h-[10px] w-[10px]`}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {/* Chats */}
      {selectedOption === "chat" && (
        <div className="h-[60%] flex flex-col overflow-y-scroll mt-6">
          {userChats &&
            userChats.map((chat, index) => {
              const recipientUser = chat?.members.find(
                (member) => member?.user?._id !== userId
              );

              const isOnline = onlineUsers?.some((u) => {
                return recipientUser?.user?._id === u?.userId;
              });

              return (
                <ChatItem
                  key={"ChatItem-" + index}
                  recipientEmail={recipientUser?.user?.email}
                  isOnline={isOnline}
                  lastestMessage={chat?.lastestMessage}
                />
                // <div
                //   onClick={() => {
                //     dispatch(setRecipientUser(recipientUser?.user._id));
                //     startChatting(
                //       recipientUser?.user._id ? recipientUser?.user._id : ""
                //     );
                //   }}
                //   key={index}
                //   className={`w-[100%] p-5 py-4 border-[#472d2d36] flex cursor-pointer`}
                // >
                //   {/* User Info */}
                //   <div className="relative flex w-[100%] h-[100%] pl-3">
                //     <div className=" rounded-[100%] h-[40px] w-[40px] flex items-center justify-center">
                //       <img src={userAvatar} className="opacity-[58%]"></img>
                //     </div>
                //     <div className=" flex-grow flex justify-center pl-5 flex-col">
                //       <div className="text-sm mb-1">
                //         {recipientUser?.user?.email}
                //       </div>
                //       <div className="text-[11.3px] text-[#777777]">
                //         {chat?.lastestMessage
                //           ? chat?.lastestMessage?.senderId === userId
                //             ? "you: "
                //             : ""
                //           : ""}
                //         {chat?.lastestMessage
                //           ? chat?.lastestMessage?.message
                //           : ""}
                //       </div>
                //     </div>
                //     <div
                //       className={`absolute bottom-[0px] left-[2.55rem] ${
                //         isOnline ? "bg-green-500" : "bg-none bg-red-500"
                //       } rounded-[100%] h-[10px] w-[10px]`}
                //     ></div>
                //   </div>
                // </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
