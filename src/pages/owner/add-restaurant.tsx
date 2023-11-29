import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import PageTitle from "../../components/page-title";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";

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
    }
  }
`;

const AddRestaurants = () => {
  const [uploading, setUploading] = useState(false);
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, error },
    } = data;
    if (ok) {
      setUploading(false);
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
    <div className="container">
      <PageTitle title={"Add Restaurant"} />
      <h1>Add Restaurant</h1>
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
