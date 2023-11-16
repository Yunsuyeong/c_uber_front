import React from "react";

interface ICategory {
  id: string;
  coverImg?: string;
  name: string;
}

export const Category: React.FC<ICategory> = ({ id, coverImg, name }) => (
  <div className="flex flex-col items-center cursor-pointer group">
    <div
      className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100"
      style={{ backgroundImage: `url(${coverImg})` }}
    ></div>
    <span className="text-sm text-center font-bold">{name}</span>
  </div>
);
