import React, { useEffect } from "react";
import { useAppSelector } from "../app/hook";
import userAvatar from "../assets/images/user-avatar.png";

interface IProp {
  recipientEmail: string | undefined;
  lastestMessage?: {
    message: string;
    senderId: string;
  };
  isOnline: boolean;
}

const ChatItem: React.FC<IProp> = React.memo(
  ({ recipientEmail, lastestMessage, isOnline }) => {
    const { userId } = useAppSelector((state) => state.auth);

    useEffect(() => {
      console.log("render chat item");
    }, []);

    return (
      <div
        onClick={() => {
          // dispatch(setRecipientUser(recipientUser?.user._id));
          // startChatting(recipientUser?.user._id ? recipientUser?.user._id : "");
        }}
        className={`w-[100%] p-5 py-4 border-[#472d2d36] flex cursor-pointer`}
      >
        {/* User Info */}
        <div className="relative flex w-[100%] h-[100%] pl-3">
          <div className=" rounded-[100%] h-[40px] w-[40px] flex items-center justify-center">
            <img src={userAvatar} className="opacity-[58%]"></img>
          </div>
          <div className=" flex-grow flex justify-center pl-5 flex-col">
            <div className="text-sm mb-1">{recipientEmail}</div>
            <div className="text-[11.3px] text-[#777777]">
              {lastestMessage
                ? lastestMessage?.senderId === userId
                  ? "you: "
                  : ""
                : ""}
              {lastestMessage ? lastestMessage?.message : ""}
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
  }
);

export default ChatItem;
