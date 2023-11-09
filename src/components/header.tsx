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
    <header className="py-4">
      <div className="w-full max-w-screen-xl flex justify-between items-center mx-auto px-5 xl:px-0">
        <img src={logo} className="w-24" />
        <span className="text-xs">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-2xl" />
          </Link>
        </span>
      </div>
    </header>
  );
};

export default Header;
