import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Dish from "../../components/dish";
import PageTitle from "../../components/page-title";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  PendingOrdersSubscription,
  PendingOrdersSubscriptionVariables,
} from "../../__generated__/graphql";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

export const My_Restaurant_Query = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        id
        name
        coverImg
        address
        category {
          slug
          name
        }
        isPromoted
        menu {
          id
          name
          price
          photo
          description
          options {
            name
            extra
            choices {
              name
              extra
            }
          }
        }
        orders {
          id
          total
          createdAt
        }
      }
    }
  }
`;

const Pending_Orders_Subscription = gql`
  subscription pendingOrders {
    pendingOrders {
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

const MyRestaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const { data, loading } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(My_Restaurant_Query, {
    variables: {
      input: {
        id: +id,
      },
    },
  });
  const { data: subscriptionData } = useSubscription<
    PendingOrdersSubscription,
    PendingOrdersSubscriptionVariables
  >(Pending_Orders_Subscription);
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      navigate(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);
  return (
    <div>
      <PageTitle title={"My Restaurant"} />
      <div
        className="bg-gray-700 bg-center bg-cover py-28"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-bold mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurant/${data?.myRestaurant.restaurant?.id}/add-dish`}
          className="text-white bg-black px-10 py-3 mr-8"
        >
          Add Dish &rarr;
        </Link>
        <Link to={``} className="bg-lime-600 text-white px-10 py-3">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please Upload Dish</h4>
          ) : (
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10 mb-5">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  price={dish.price!}
                  description={dish.description}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center font-medium text-2xl">Sales</h4>
          <div className="mt-10">
            <VictoryChart
              theme={VictoryTheme.material}
              width={window.innerWidth}
              height={500}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 15 }}
                    renderInPortal
                    dy={-10}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 3,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: { fontSize: 15, fill: "#4D7C0F" },
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
