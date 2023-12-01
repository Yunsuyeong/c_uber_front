import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Dish from "../../components/dish";
import PageTitle from "../../components/page-title";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/graphql";

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
      }
    }
  }
`;

const MyRestaurant = () => {
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
                  name={dish.name}
                  price={dish.price!}
                  description={dish.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
