import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__generated__/graphql";

const Search_Restaurant_Query = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
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

const Search = () => {
  const location = useLocation();
  const [_, query] = location.search.split("?term=");
  const navigate = useNavigate();
  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(Search_Restaurant_Query);
  useEffect(() => {
    if (!query) {
      navigate("/", { replace: true });
    }
    queryReadyToStart({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, []);
  console.log(loading, data, called);
  return (
    <div>
      <Helmet>
        <title>{query} | Uber Eats </title>
      </Helmet>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 px-8 pb-20">
          <h1 className="text-xl text-center font-bold">
            Search results for '{query}' : {data?.searchRestaurant.totalResults}
          </h1>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10 mb-5 pt-5 border-t border-gray-200">
            {data?.searchRestaurant.restaurants?.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <Restaurant
                  id={restaurant.id + ""}
                  name={restaurant.name}
                  coverImg={restaurant.coverImg}
                  categoryName={restaurant.category?.name}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
