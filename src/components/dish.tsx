import React from "react";
import { DishOption } from "../__generated__/graphql";

interface IDish {
  id?: number;
  name: string;
  price: string;
  description: string;
  isCustomer?: boolean;
  isSelected?: boolean;
  options?: DishOption[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  children?: any;
}

const Dish: React.FC<IDish> = ({
  id = 0,
  name,
  price,
  description,
  isCustomer = false,
  isSelected,
  options,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`px-8 pt-4 pb-8 border transition-all cursor-pointer ${
        isSelected ? "border-gray-700" : "hover:border-gray-700"
      }`}
    >
      <div className="mb-5">
        <h3 className="flex items-center text-lg font-bold">
          {name}{" "}
          {orderStarted && (
            <button
              className={`text-sm text-white px-3 py-1 ml-3 ${
                isSelected ? "bg-red-500" : "bg-lime-600"
              }`}
              onClick={onClick}
            >
              {isSelected ? "Remove" : "Add"}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-5 mb-3 font-medium">Dish Options:</h5>
          <div className="grid gap-2 justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};

export default Dish;
