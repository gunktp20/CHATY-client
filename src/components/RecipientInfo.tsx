import { useEffect, useState } from "react";
import api from "../services/api";
import { useAppSelector } from "../app/hook";
import useAlert from "../hooks/useAlert";
import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";
import userAvatar from "../assets/images/user-avatar.png";
import { GrHelp } from "react-icons/gr";

function RecipientInfo() {
  const { recipientUser } = useAppSelector((state) => state.chat);
  const { displayAlert } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipientInfo, setRecipientInfo] = useState<{ email: string }>({
    email: "",
  });

  const getRecipientUserInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/user/info/${recipientUser}`);
      console.log(data);
      setRecipientInfo(data);
      setTimeout(() => {
        return setIsLoading(false);
      }, 500);
    } catch (err) {
      const msg = await getAxiosErrorMessage(err);
      console.log(msg);
      displayAlert({
        msg: msg,
        type: "error",
      });
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!recipientUser) return;
    getRecipientUserInfo();
  }, [recipientUser]);

  return (
    <div className="w-[350px] flex flex-col items-center pt-14 bg-white border-l-[1px]">
      {/* If Loading */}
      {isLoading && (
        <div className="flex flex-col gap-2 mt-4">
          <div className="text-primary-100">Loading</div>
          <div className="loader w-[8px] h-[8px]"></div>
        </div>
      )}
      {/* Recipient Information */}
      {!isLoading && (
        <div className="flex flex-col items-center">
          {/* Image profile of recipient */}
          <div className=" rounded-[100%] h-[65px] w-[65px] flex items-center justify-center">
            {recipientInfo?.email ? (
              <img src={userAvatar} className="opacity-[58%]"></img>
            ) : (
              <GrHelp className="text-[50px] text-gray-400 border-[2px] rounded-[100%] p-3" />
            )}
          </div>
          {/* Recipient E-mail */}
          <div className="flex mt-6">
            <div
              className={`${
                recipientInfo?.email ? "" : "text-gray-400 "
              } text-[11.6px] `}
            >
              {recipientInfo?.email
                ? recipientInfo?.email
                : "You haven't selected a conversation yet. "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipientInfo;
