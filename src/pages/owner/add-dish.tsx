import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import PageTitle from "../../components/page-title";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/graphql";
import { My_Restaurant_Query } from "./my-restaurant";

const Create_Dish_Mutation = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;
interface ICreateForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

const AddDish = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const [createDish, { data, loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(Create_Dish_Mutation, {
    refetchQueries: [
      {
        query: My_Restaurant_Query,
        variables: {
          input: {
            id: +id,
          },
        },
      },
    ],
  });
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    unregister,
    formState: { errors, isValid },
  } = useForm<ICreateForm>({
    mode: "onChange",
    shouldUnregister: true,
  });
  const onValid = () => {
    const { name, price, description, ...rest } = getValues();
    const optionsObject = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));
    createDish({
      variables: {
        input: {
          name,
          price,
          description,
          restaurantId: +id,
          options: optionsObject,
        },
      },
    });
    navigate(-1);
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((cur) => [Date.now(), ...cur]);
  };
  const onDeleteOptionClick = (idToDelete: number) => {
    setOptionsNumber((cur) => cur.filter((id) => id !== idToDelete));
    unregister(`${idToDelete}-optionName`);
    unregister(`${idToDelete}-optionExtra`);
  };
  return (
    <div className="container flex flex-col items-center mt-28">
      <PageTitle title={"Add Dish"} />
      <h2 className="font-bold text-4xl mb-3">Add Dish</h2>
      <form onSubmit={handleSubmit(onValid)} className="grid gap-3 w-full my-5">
        <input
          type="text"
          className="input"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <input
          type="text"
          className="input"
          placeholder="Price"
          {...register("price")}
        />
        <input
          type="text"
          className="input"
          placeholder="Description"
          {...register("description", { required: true })}
        />
        <div className="my-10">
          <h4 className="font-medium text-lg mb-3">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="text-white bg-black px-2 py-1 mt-5 cursor-pointer"
          >
            Add Dish Options
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  // @ts-ignore
                  {...register(`${id}-optionName`)}
                  className="px-4 py-2 mr-3 focus:outline-none focus:border-gray-700 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  // @ts-ignore
                  {...register(`${id}-optionExtra`)}
                  className="px-4 py-2 focus:outline-none focus:border-gray-700 border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                />
                <span
                  onClick={() => onDeleteOptionClick(id)}
                  className="text-white bg-red-500 px-4 py-3 mt-5 ml-3 cursor-pointer"
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <Button loading={loading} actionText="Create Dish" canClick={isValid} />
      </form>
    </div>
  );
};

export default AddDish;
