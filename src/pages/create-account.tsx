import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import logo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from "../__generated__/graphql";

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const Create_Account_Mutation = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

const CreateAccount = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    watch,
  } = useForm<ICreateAccountForm>({
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      navigate("/");
    }
  };
  const [createAccount, { data: createAccountData, loading }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(Create_Account_Mutation, {
    onCompleted,
  });
  const onValid = () => {
    if (loading) {
      return;
    }
    const { email, password, role } = getValues();
    createAccount({
      variables: {
        createAccountInput: {
          email,
          password,
          role,
        },
      },
    });
  };
  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={logo} className="w-52 mb-10" />
        <h4 className="w-full text-left text-3xl font-medium mb-5">
          Let's get started
        </h4>
        <form
          onSubmit={handleSubmit(onValid)}
          className="w-full grid gap-3 my-5"
        >
          <input
            {...register("email", {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            placeholder="Email"
            required
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid Email"} />
          )}
          <input
            {...register("password", { minLength: 2, required: true })}
            type="password"
            placeholder="Password"
            required
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role) => (
              <option>{role}</option>
            ))}
          </select>
          <Button
            loading={false}
            actionText="Create Account"
            canClick={isValid}
          />
          {createAccountData?.createAccount?.error && (
            <FormError errorMessage={createAccountData.createAccount.error} />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
