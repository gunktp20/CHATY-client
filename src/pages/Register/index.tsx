import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/Login";
import { FormRow } from "../../components";
import { validate } from "email-validator";
import { MdOutlineEmail } from "react-icons/md";
import { Logo } from "../../components";
import { FiLock } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Alert } from "@mui/material";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";
import { useAppSelector } from "../../app/hook";

function Register() {
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] =
    useState<string>("");

  const { alertType, alertText, showAlert, displayAlert } = useAlert();

  const [emailError, setEmailError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const register = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/auth/register/`, {
        email,
        password,
      });
      displayAlert({
        msg: data?.msg,
        type: "success",
      });
      return setIsLoading(false);
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
    const lower = new RegExp("(?=.*[a-z])");
    const upper = new RegExp("(?=.*[A-Z])");
    const number = new RegExp("(?=.*[0-9])");
    const special = new RegExp("(?=.*[!@#$%^&*])");
    const length = new RegExp("(?=.{8,})");

    if (lower.test(e.target.value)) {
      setPasswordErrorMessage("* at least one lowercase letter");
      setPasswordError(false);
    } else {
      setPasswordErrorMessage("* at least one lowercase letter");
      setPasswordError(true);
      return;
    }
    if (upper.test(e.target.value)) {
      setPasswordErrorMessage("* at least one uppercase letter");
      setPasswordError(false);
    } else {
      setPasswordErrorMessage("* at least one uppercase letter");
      setPasswordError(true);
      return;
    }
    if (number.test(e.target.value)) {
      setPasswordErrorMessage("* at least one number");
      setPasswordError(false);
    } else {
      setPasswordErrorMessage("* at least one number");
      setPasswordError(true);
      return;
    }
    if (special.test(e.target.value)) {
      setPasswordErrorMessage("* at least one special character");
      setPasswordError(false);
    } else {
      setPasswordErrorMessage("* at least one special character");
      setPasswordError(true);
      return;
    }

    if (length.test(e.target.value)) {
      setPasswordErrorMessage("* at least 8 character");
      setPasswordError(false);
    } else {
      setPasswordErrorMessage("* at least 8 character");
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === "") {
      setConfirmPasswordErrorMsg("* please provide a repeat password");
      setConfirmPasswordError(true);
      return;
    }
    setConfirmPasswordError(false);
  };

  useEffect(() => {
    if (confirmPassword !== password && confirmPassword) {
      setConfirmPasswordErrorMsg(
        "Repeat password must be the same with password"
      );
      setConfirmPasswordError(true);
      return;
    } else {
      setConfirmPasswordErrorMsg(
        "Repeat password must be the same with password"
      );
      setConfirmPasswordError(false);
      return;
    }
  }, [confirmPassword, password]);

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
        <div className="w-[100%]">
          <FormRow
            type="password"
            name="confirm_password"
            labelText="Repeat Password"
            value={confirmPassword}
            handleChange={handleChangeConfirmPassword}
            error={confirmPasswordError}
            errMsg={confirmPasswordErrorMsg}
            icon={<FiLock />}
            tailwindClass="mt-[1.3rem]"
          />
        </div>

        <button
          disabled={
            !email ||
            !password ||
            !confirmPassword ||
            emailError ||
            passwordError ||
            password !== confirmPassword
          }
          onClick={register}
          className="bg-primary-500 text-white flex justify-center items-center hover:bg-primary-600 transition-all w-[100%] h-[38px] disabled:bg-gray-200 text-sm font-sm mt-6 rounded-md"
        >
          {isLoading ? (
            <div className="loader w-[20px] h-[20px]"></div>
          ) : (
            "Sign Up"
          )}
        </button>
        <div className="flex relative justify-center items-center mb-7 w-[100%] mt-7">
          <div className="absolute z-[2] px-2 text-gray-400 text-[12.5px]">
            Have an account already ?{" "}
            <Link
              to="/login"
              className=" cursor-pointer text-primary-400 hover:text-primary-500 transition-all"
            >
              Sign In
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

export default Register;
