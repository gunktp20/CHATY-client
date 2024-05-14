import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/Login";
import { FormRow } from "../../components";
import { validate } from "email-validator";
import { MdOutlineEmail } from "react-icons/md";
import { Logo } from "../../components";
import { FiLock } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import api from "../../services/api";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setCredential } from "../../features/auth/auth.slice";

function Login() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);

  const { alertType, alertText, showAlert, displayAlert } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/auth/login/`, {
        email,
        password,
      });
      setIsLoading(false);
      return dispatch(setCredential({ token: data?.accessToken }));
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      displayAlert({
        msg: msg,
        type: "error",
      });
      return setIsLoading(false);
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      setEmailErrorMessage("* Please provide an email");
      setEmailError(true);
      return;
    }
    if (validate(e.target.value)) {
      setEmailErrorMessage("* Email is not valid");
      setEmailError(false);
    } else {
      setEmailErrorMessage("* Email is not valid");
      setEmailError(true);
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      setPasswordErrorMessage("* please provide a password");
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <Wrapper>
      <div className="w-[400px] bg-white border-[1px] shadow-sm rounded-md px-10 py-12 relative top-[11%] flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8">
          <Logo width="28px" />
          <div className="font-semibold text-[22px] text-primary-400">
            CHATY
          </div>
        </div>
        {showAlert && (
          <Alert
            severity={alertType}
            className="w-[100%]"
            sx={{
              fontSize: "11.4px",
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            {alertText}
          </Alert>
        )}
        <div className="w-[100%]">
          <FormRow
            type="text"
            name="email"
            labelText="E-mail"
            value={email}
            handleChange={handleChangeEmail}
            error={emailError}
            errMsg={emailErrorMessage}
            icon={<MdOutlineEmail />}
            tailwindClass="mt-[1.5rem]"
          />
        </div>
        <div className="w-[100%]">
          <FormRow
            type="password"
            name="password"
            labelText="Password"
            value={password}
            handleChange={handleChangePassword}
            error={passwordError}
            errMsg={passwordErrorMessage}
            icon={<FiLock />}
            tailwindClass="mt-[1.3rem]"
          />
        </div>
        <div className="w-[100%] flex justify-end mt-5">
          <button className="text-[11.5px] text-primary-400 hover:text-primary-500 transition-all font-semibold">
            Forget Password
          </button>
        </div>
        <button
          disabled={!email || !password || emailError || passwordError}
          className="bg-primary-500 text-white hover:bg-primary-600 transition-all w-[100%] h-[38px] disabled:bg-gray-200 text-sm font-sm mt-6 rounded-md"
          onClick={login}
        >
          {isLoading ? (
            <div className="loader w-[20px] h-[20px]"></div>
          ) : (
            "Sign In"
          )}
        </button>
        <div className="flex relative justify-center items-center mb-7 w-[100%] mt-7">
          <div className="absolute z-[2] px-2 text-gray-400 text-[12.5px]">
            Not a member yet ?{" "}
            <Link
              to="/register"
              className=" cursor-pointer text-primary-400 hover:text-primary-500 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
        <div className="flex relative justify-center items-center mb-7 mt-5 w-[100%]">
          <div className="absolute bg-white z-[2] px-2 rounded-[100%] text-gray-400 text-[14.2px]">
            OR
          </div>
          <div className="bg-gray-300 absolute w-[75%] h-[1px]"></div>
        </div>
        <button className="mb-5 w-[100%] rounded-md mt-4 border-[1px] h-[38px] border-primary-300 hover:bg-primary-500 text-primary-300 hover:text-white transition-all flex items-center justify-center">
          <FaGoogle className="text-[15.5px] " />
          <div className="text-[11.6px] ml-2 font-semibold  ">
            Sign In With Google
          </div>
        </button>
      </div>
    </Wrapper>
  );
}

export default Login;
