import { faUser, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import useMe from "../hooks/useMe";
import logo from "../images/logo.svg";

interface IHeader {
  email: string;
}

const Header: React.FC<IHeader> = () => {
  const { data } = useMe();
  const navigate = useNavigate();
  const onLogout = () => {
    const ok = window.confirm("Do you want to log out?");
    if (ok) {
      isLoggedInVar(false);
      navigate("/");
    }
  };
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-xs text-center text-white">
          <span>Please Verify your email</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full max-w-screen-xl flex justify-around items-center mx-auto px-5 xl:px-2">
          <img
            onClick={() => navigate("/")}
            src={logo}
            className="w-24 cursor-pointer"
          />
          <div className="flex gap-4">
            <span className="text-xs">
              <Link to="/edit-profile">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />
              </Link>
            </span>
            <span onClick={onLogout} className="text-xs cursor-pointer">
              <FontAwesomeIcon icon={faUserLock} className="text-2xl" />
            </span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
