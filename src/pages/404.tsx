import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Helmet>
        <title>Not Found | User Eats</title>
      </Helmet>
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
