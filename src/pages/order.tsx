import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../components/page-title";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderUpdatesSubscription,
  OrderUpdatesSubscriptionVariables,
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

const Order_Subscription = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
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
`;

const Order = () => {
  const { id } = useParams() as { id: string };
  const { data, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(Get_Order_Query, {
    variables: {
      input: {
        id: +id,
      },
    },
  });
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: Order_Subscription,
        variables: {
          input: {
            id: +id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);
  return (
    <div className="container flex justify-center mt-32">
      <PageTitle title={`Order #${id}`} />
      <div className="w-full max-w-screen-sm flex flex-col justify-center border border-gray-700">
        <h4 className="w-full text-white text-center text-xl bg-gray-700 py-5">
          Order #{id}
        </h4>
        <h5 className="text-center text-3xl p-5 pt-10">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="grid gap-6 text-xl p-5">
          <div className="border-t border-gray-700 pt-5">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t border-gray-700 pt-5">
            Deliver to:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b border-gray-700 py-5">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not Yet."}
            </span>
          </div>
          <span className="text-center text-lime-600 text-2xl mt-5 mb-3">
            Status: {data?.getOrder.order?.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Order;
