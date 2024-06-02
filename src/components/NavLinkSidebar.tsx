import { VscGraph } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { GoHomeFill } from "react-icons/go";
import { AiFillMessage } from "react-icons/ai";

const NavLinks = () => {
  return (
    <div
      className={`bg-[#fff] h-[100%] w-[300px] shadow-md pt-5 w-sm flex flex-col sm:hidden transition-all`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 justify-center mt-4">
        <Logo width="30px" />
        <div className="font-semibold text-[22px] text-primary-400">CHATY</div>
      </div>
      <div className="flex flex-col">
        <NavLink
          to="/"
          id="home-navlink-sidebar"
          key={1}
          onClick={() => {}}
          className={({ isActive }) =>
            `flex pl-10 p-6 items-center font-400 ${
              isActive
                ? "text-primary-700 font-semibold text-[14.5px]"
                : "text-primary-500 text-[13px]"
            }`
          }
        >
          <GoHomeFill className={`mr-3 text-[20px]`} />
          Home
        </NavLink>
        <NavLink
          to="/message"
          id="message-navlink-sidebar"
          key={2}
          onClick={() => {}}
          className={({ isActive }) =>
            `flex pl-10 p-6 items-center font-400 ${
              isActive
                ? "text-primary-700 font-semibold text-[14.5px]"
                : "text-primary-500 text-[13px]"
            }`
          }
        >
          <AiFillMessage className={`mr-3 text-[20px]`} />
          Message
        </NavLink>
      </div>
    </div>
  );
};

export default NavLinks;
