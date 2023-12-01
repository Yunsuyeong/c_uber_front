import React from "react";

interface IDish {
  name: string;
  price: string;
  description: string;
}

const Dish: React.FC<IDish> = ({ name, price, description }) => {
  return (
    <div className="px-8 pt-4 pb-8 border hover:border-gray-700 transition-all">
      <div className="mb-5">
        <h3 className="text-lg font-bold">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
    </div>
  );
};

export default Dish;
