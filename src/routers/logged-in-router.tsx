import { gql, useQuery } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "../apollo";
import { ReportHandler } from "web-vitals";
import { MeQuery, MeQueryVariables } from "../__generated__/graphql";

const Me_Query = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery, MeQueryVariables>(
    Me_Query
  );
  console.log(data);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <h1>{data?.me?.role}</h1>
      <button onClick={() => isLoggedInVar(false)}>Logout</button>
    </div>
  );
};
