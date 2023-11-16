import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Category } from "../../components/category";
import { Restaurant } from "../../components/restaurant";
import {
  RestaurantsQuery,
  RestaurantsQueryVariables,
} from "../../__generated__/graphql";

const Restaurants_Query = gql`
  query restaurants($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        address
        category {
          name
        }
        isPromoted
      }
    }
  }
`;

const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    RestaurantsQuery,
    RestaurantsQueryVariables
  >(Restaurants_Query, {
    variables: {
      input: {
        page,
      },
    },
  });
  const onNextPage = () => {
    setPage((cur) => cur + 1);
  };
  const onPrevPage = () => {
    setPage((cur) => cur - 1);
  };
  return (
    <div>
      <form className="w-full flex items-center justify-center bg-gray-700 py-32">
        <input
          type="Search"
          className="input w-1/4 rounded-md border-0"
          placeholder="Search Restaurant..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 px-8 pb-20">
          <div className="max-w-xs flex justify-around mx-auto">
            {data?.allCategories?.categories?.map((category) => (
              <Category
                id={category.id + ""}
                coverImg={category.coverImg!}
                name={category.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-10 mb-5">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="max-w-md grid grid-cols-3 items-center mx-auto mt-10 text-center">
            {page > 1 ? (
              <button
                onClick={onPrevPage}
                className="font-medium text-2xl focus:outline-none"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="mx-5">
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPage}
                className="font-medium text-2xl focus:outline-none"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
