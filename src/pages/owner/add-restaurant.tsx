import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import PageTitle from "../../components/page-title";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { My_Restaurants_Query } from "./my-restaurants";

interface ICreateForm {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

const Create_Restaurant_Mutation = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

const AddRestaurants = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, address, categoryName } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: My_Restaurants_Query });
      client.writeQuery({
        query: My_Restaurants_Query,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      navigate("/");
    }
  };
  const [createRestaurant, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(Create_Restaurant_Mutation, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ICreateForm>();
  const onValid = async (form: ICreateForm) => {
    try {
      setUploading(true);
      const { file, name, address, categoryName } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      createRestaurant({
        variables: {
          input: {
            name: form.name,
            categoryName: form.categoryName,
            address: form.address,
            coverImg,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container flex flex-col items-center mt-28">
      <PageTitle title={"Add Restaurant"} />
      <h2 className="font-bold text-4xl mb-3">Add Restaurant</h2>
      <form className="w-full grid gap-3 my-5" onSubmit={handleSubmit(onValid)}>
        <input
          className="input"
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <input
          className="input"
          type="text"
          placeholder="Address"
          {...register("address", { required: true })}
        />
        <input
          className="input"
          type="text"
          placeholder="Category Name"
          {...register("categoryName", { required: true })}
        />
        <div>
          <input
            type="file"
            accept="image/*"
            {...register("file", { required: true })}
          />
        </div>

        <Button
          loading={uploading}
          actionText="Create Restaurant"
          canClick={isValid}
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};

export default AddRestaurants;
