import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import useMe from "../hooks/useMe";
import logo from "../images/logo.svg";

interface IHeader {
  email: string;
}

const Header: React.FC<IHeader> = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-xs text-center text-white">
          <span>Please Verify your email</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full max-w-screen-2xl flex justify-around items-center mx-auto px-5 xl:px-2">
          <img src={logo} className="w-24" />
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
