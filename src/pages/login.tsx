import React from "react";
import { Form, useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/graphql";

interface ILoginForm {
  email: string;
  password: string;
}

const Login_Mutation = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ILoginForm>();
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [login, { data: loginData, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(Login_Mutation, {
    onCompleted,
  });
  const onValid = () => {
    if (loading) {
      return;
    }
    const { email, password } = getValues();
    login({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className="h-screen flex justify-center items-center bg-gray-700">
      <div className="bg-white w-full max-w-lg py-10 pb-8 round-lg text-center">
        <h3 className="text-3xl">Log In</h3>
        <form onSubmit={handleSubmit(onValid)} className="grid gap-3 px-5 mt-5">
          <input
            {...register("email", { required: true })}
            placeholder="Email"
            required
            className="mb-3 input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          <input
            {...register("password", { minLength: 2 })}
            placeholder="Password"
            required
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          <button className="mt-4 btn">
            {loading ? "Loading..." : "Log In"}
          </button>
          {loginData?.login.error && (
            <FormError errorMessage={loginData.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
