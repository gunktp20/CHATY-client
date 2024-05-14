import { useAppSelector } from "../app/hook";
import { Navigate } from "react-router-dom";

interface IProp {
  children: string | JSX.Element;
}

const ProtectedRoute = ({ children }: IProp) => {
  const { token } = useAppSelector((state) => state.auth);
  if (!token) {
    return <Navigate to="/home" />;
  }
  return children;
};

export default ProtectedRoute;
