import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Dish from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import PageTitle from "../../components/page-title";
import {
  CreateOrderItemInput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../__generated__/graphql";

const Restaurant_Query = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        id
        name
        coverImg
        address
        category {
          slug
          name
        }
        menu {
          id
          name
          price
          photo
          description
          options {
            name
            extra
            choices {
              name
              extra
            }
          }
        }
        isPromoted
      }
    }
  }
`;

const Create_Order_Mutation = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

const Restaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const { data, loading } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
    Restaurant_Query,
    {
      variables: {
        input: {
          restaurantId: +id,
        },
      },
    }
  );
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const onStartOrder = () => {
    setOrderStarted(true);
  };
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((cur) => [{ dishId, options: [] }, ...cur]);
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems((cur) => cur.filter((dish) => dish.dishId !== dishId));
  };
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((aOption) => aOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((cur) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...cur,
        ]);
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((cur) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...cur,
      ]);
      return;
    }
  };
  const onCompleted = (data: CreateOrderMutation) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      alert("Order created");
      navigate(`/orders/${orderId}`);
    }
  };
  const [createOrder, { loading: orderLoading, data: orderData }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(Create_Order_Mutation, { onCompleted });
  const onConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm("You are about to place an order?");
    if (ok) {
      createOrder({
        variables: {
          input: {
            restaurantId: +id,
            items: orderItems,
          },
        },
      });
    }
  };
  const onCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  console.log(orderItems);
  return (
    <div>
      <PageTitle title={`${data?.restaurant.restaurant?.name}`} />
      <div
        className="bg-gray-700 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className=" w-1/4 bg-white py-4 pl-48">
          <h4 className="text-3xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5
            onClick={() =>
              navigate(
                `/category/${data?.restaurant.restaurant?.category?.slug}`
              )
            }
            className="text-sm font-light mb-2 cursor-pointer hover:underline"
          >
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container flex flex-col items-end mt-20 pb-32">
        {!orderStarted && (
          <button onClick={onStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={onConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={onCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}
        <div className="w-full grid md:grid-cols-2 gap-x-5 gap-y-10 mt-10 mb-5">
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              key={dish.id}
              id={dish.id}
              name={dish.name}
              price={dish.price!}
              description={dish.description}
              isCustomer={true}
              options={dish.options}
              isSelected={isSelected(dish.id)}
              orderStarted={orderStarted}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  dishId={dish.id}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
