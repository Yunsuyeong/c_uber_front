import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
} from "../__generated__/graphql";

const Get_Order_Query = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`;

const Order = () => {
  const { id } = useParams() as { id: string };
  const { data, loading } = useQuery<GetOrderQuery, GetOrderQueryVariables>(
    Get_Order_Query,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  return (
    <div>
      <h1>Order</h1>
    </div>
  );
};

export default Order;
