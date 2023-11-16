import { gql, useMutation, useApolloClient } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import useMe from "../../hooks/useMe";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";

const Verify_Email_Mutation = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail = () => {
  const { data: meData, refetch } = useMe();
  const client = useApolloClient();
  const navigate = useNavigate();
  const onCompleted = async (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && meData?.me.id) {
      /* client.writeFragment({
        id: `User:${meData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          vefiried: true,
        },
      }); */
      await refetch();
      navigate("/");
    }
  };
  const [verifyEmail, { data, loading, error }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(Verify_Email_Mutation, {
    onCompleted,
  });
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
    navigate("/");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-52">
      <Helmet>
        <title>Verify Email | Uber Eats</title>
      </Helmet>
      <h2 className="text-lg font-medium mb-2">Confirming Email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait. Don't close this page
      </h4>
    </div>
  );
};

export default ConfirmEmail;
