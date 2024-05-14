import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/Profile";
import useAlert from "../../hooks/useAlert";
import api from "../../services/api";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { useAppSelector } from "../../app/hook";
import { FaCircleUser } from "react-icons/fa6";

function Profile() {
  const { alertType, alertText, showAlert, displayAlert } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const { token } = useAppSelector((state) => state.auth);

  const getUserInfo = async () => {
    try {
      const { data } = await api.get("/user/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      setUser(data);
    } catch (err) {
      console.log(err);
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg: msg,
        type: "error",
      });
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return <Wrapper>
  
  </Wrapper>;
}

export default Profile;
