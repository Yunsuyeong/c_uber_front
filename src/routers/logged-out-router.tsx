import React from "react";
import { isLoggedInVar } from "../apollo";
import { useForm } from "react-hook-form";

interface ILoginForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const { register, handleSubmit } = useForm<ILoginForm>();
  const onSubmit = () => {
    isLoggedInVar(true);
  };
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" {...register("email", { required: true })} />
          <input
            type="text"
            {...register("password", { minLength: 2, required: true })}
          />
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};
