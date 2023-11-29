import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/page-title";
import { Restaurant } from "../../components/restaurant";
import {
  MyRestaurantsQuery,
  MyRestaurantsQueryVariables,
} from "../../__generated__/graphql";

const My_Restaurants_Query = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
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

const MyRestaurants = () => {
  const { data, loading } = useQuery<
    MyRestaurantsQuery,
    MyRestaurantsQueryVariables
  >(My_Restaurants_Query);
  console.log(data);
  return (
    <div>
      <PageTitle title={"Home"} />
      <div className="max-w-screen-xl mx-auto mt-32">
        <h2 className="text-4xl font-bold mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no Restaurants</h4>
            <Link
              className="text-lime-600 hover:underline"
              to="/add-restaurant"
            >
              Create Restaurant &rarr;
            </Link>
          </>
        ) : (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10 mb-5">
            {data?.myRestaurants.restaurants.map((restaurant) => (
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
        )}
      </div>
    </div>
  );
};

export default MyRestaurants;
