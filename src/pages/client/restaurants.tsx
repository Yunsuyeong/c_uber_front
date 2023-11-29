import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Category } from "../../components/category";
import PageTitle from "../../components/page-title";
import { Restaurant } from "../../components/restaurant";
import {
  RestaurantsQuery,
  RestaurantsQueryVariables,
} from "../../__generated__/graphql";

interface ISearchForm {
  searchTerm: string;
}

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
  const navigate = useNavigate();
  const { register, handleSubmit, getValues } = useForm<ISearchForm>();
  const onValid = () => {
    const searchTerm = getValues().searchTerm;
    navigate({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };
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
      <PageTitle title={"Home"} />
      <form
        onSubmit={handleSubmit(onValid)}
        className="w-full flex items-center justify-center bg-gray-700 py-32"
      >
        <input
          {...register("searchTerm", { required: true })}
          required
          type="Search"
          className="input w-3/4 rounded-md border-0 md:w-1/4"
          placeholder="Search Restaurant..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8 px-8 pb-20">
          <div className="max-w-xs flex justify-around mx-auto">
            {data?.allCategories?.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Category
                  id={category.id + ""}
                  coverImg={category.coverImg!}
                  name={category.name}
                />
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10 mb-5">
            {data?.restaurants.results?.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <Restaurant
                  id={restaurant.id + ""}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              </Link>
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
