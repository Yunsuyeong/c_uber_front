import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/page-title";
import { Restaurant } from "../../components/restaurant";
import { Category_Fragment } from "../../fragments";
import {
  FindCategoryBySlugQuery,
  FindCategoryBySlugQueryVariables,
} from "../../__generated__/graphql";

const Category_Query = gql`
  query findCategoryBySlug($input: CategoryInput!) {
    findCategoryBySlug(input: $input) {
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
      category {
        ...CategoryParts
      }
    }
  }
  ${Category_Fragment}
`;

const Category = () => {
  const { slug } = useParams();
  const { data, loading } = useQuery<
    FindCategoryBySlugQuery,
    FindCategoryBySlugQueryVariables
  >(Category_Query, {
    variables: {
      input: {
        page: 1,
        slug: slug!,
      },
    },
  });
  return (
    <div>
      <PageTitle title={`${slug}`} />
      <Helmet>
        <title> {slug} | Uber Eats</title>
      </Helmet>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8 px-8 pb-20">
          <h1 className="text-xl text-center font-bold">
            Number of results in category '{slug}' :{" "}
            {data?.findCategoryBySlug.totalResults}
          </h1>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10 mb-5 pt-5 border-t border-gray-200">
            {data?.findCategoryBySlug.restaurants?.map((restaurant) => (
              <Link to={`/restaurant/${restaurant.id}`}>
                <Restaurant
                  key={restaurant.id}
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

export default Category;
