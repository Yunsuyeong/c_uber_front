import React from "react";

interface IButton {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButton> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    className={` mt-4 text-white text-lg font-medium transition-colors py-4 focus:outline-none ${
      canClick
        ? "bg-lime-600 hover:bg-lime-800"
        : "bg-gray-300 pointer-events-none"
    }`}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
