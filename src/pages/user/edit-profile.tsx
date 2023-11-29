import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import PageTitle from "../../components/page-title";
import useMe from "../../hooks/useMe";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/graphql";

interface IEditForm {
  email?: string;
  password?: string;
}

const Edit_Profile_Mutation = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

const EditProfile = () => {
  const { data: meData } = useMe();
  const client = useApolloClient();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IEditForm>({
    defaultValues: {
      email: meData?.me.email,
    },
  });
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && meData) {
      const {
        me: { email: prevEmail, id },
      } = meData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            vefiried: false,
            email: newEmail,
          },
        });
      }
    }
  };
  const [editProfile, { data: editData, loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(Edit_Profile_Mutation, { onCompleted });
  const onValid = () => {
    if (loading) {
      return;
    }
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <PageTitle title={"Edit Profile"} />
      <h4 className="text-2xl font-semibold mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onValid)}
        className="grid gap-3 w-full max-w-screen-sm my-5"
      >
        <input
          {...register("email", {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register("password")}
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Update Profile"
        />
      </form>
    </div>
  );
};

export default EditProfile;
