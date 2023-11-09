import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h2 className="font-bold text-3xl mb-2">Page Not Found</h2>
      <h4 className="text-semibold text-xl mb-5">
        The page you're looking for does not exist or has moved.
      </h4>
      <Link to="/" className="text-lime-500 hover:underline">
        Go back home &rarr;
      </Link>
    </div>
  );
};

export default NotFound;
