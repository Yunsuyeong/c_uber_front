import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../components/page-title";
import useMe from "../hooks/useMe";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
  OrderUpdatesSubscriptionVariables,
  UserRole,
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

const Edit_Order_Mutation = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

const Order = () => {
  const { id } = useParams() as { id: string };
  const { data: meData } = useMe();
  const [editOrder] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(Edit_Order_Mutation);
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
  const onClick = (newStatus: OrderStatus) => {
    editOrder({
      variables: {
        input: {
          id: +id,
          status: newStatus,
        },
      },
    });
  };
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
          {meData?.me?.role === UserRole.Client && (
            <span className="text-center text-lime-600 text-2xl mt-5 mb-3">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {meData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onClick(OrderStatus.Cooking)}
                  className="btn"
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onClick(OrderStatus.Cooked)}
                  className="btn"
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className="text-center text-lime-600 text-2xl mt-5 mb-3">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
          {meData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onClick(OrderStatus.PickedUp)}
                  className="btn"
                >
                  Picked Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onClick(OrderStatus.Delivered)}
                  className="btn"
                >
                  Order Delivered
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className="text-center text-lime-600 text-2xl mt-5 mb-3">
              Thank you for Using Uber Eats.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
