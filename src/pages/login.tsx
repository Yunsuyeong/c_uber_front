import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/graphql";
import logo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { isLoggedInVar, tokenVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

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
    formState: { errors, isValid },
  } = useForm<ILoginForm>();
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      tokenVar(token);
      isLoggedInVar(true);
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
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={logo} className="w-52 mb-10" />
        <h4 className="w-full text-left text-3xl font-medium mb-5">
          Welcome Back
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
          <Button loading={loading} actionText="Log In" canClick={isValid} />
          {loginData?.login.error && (
            <FormError errorMessage={loginData.login.error} />
          )}
        </form>
        <div>
          New to Nuber?
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
