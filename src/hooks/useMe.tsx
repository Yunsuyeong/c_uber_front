import { gql, useQuery } from "@apollo/client";
import { MeQuery, MeQueryVariables } from "../__generated__/graphql";

export const Me_Query = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

const useMe = () => {
  return useQuery<MeQuery, MeQueryVariables>(Me_Query);
};

export default useMe;
