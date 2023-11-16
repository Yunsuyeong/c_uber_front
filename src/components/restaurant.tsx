import React from "react";

interface IRestaurant {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurant> = ({
  coverImg,
  name,
  categoryName,
}) => (
  <div className="flex flex-col">
    <div
      style={{ backgroundImage: `url(${coverImg})` }}
      className="py-32 mb-2 bg-cover bg-center"
    ></div>
    <h3 className="text-xl font-bold">{name}</h3>
    <span className="text-xs opacity-50 border-t border-gray-200 mt-3 py-2">
      {categoryName}
    </span>
  </div>
);
