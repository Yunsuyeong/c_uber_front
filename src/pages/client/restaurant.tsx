import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../__generated__/graphql";

const Restaurant_Query = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
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
      }
    }
  }
`;

const Restaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const { data, loading } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
    Restaurant_Query,
    {
      variables: {
        input: {
          restaurantId: +id,
        },
      },
    }
  );
  console.log(data);
  return (
    <div>
      <div
        className="bg-gray-700 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className=" w-1/4 bg-white py-4 pl-48">
          <h4 className="text-3xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5
            onClick={() =>
              navigate(
                `/category/${data?.restaurant.restaurant?.category?.slug}`
              )
            }
            className="text-sm font-light mb-2 cursor-pointer hover:underline"
          >
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
