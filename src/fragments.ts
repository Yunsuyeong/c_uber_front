import { gql } from "@apollo/client";

export const Restaurant_Fragment = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    address
    category {
      name
    }
    isPromoted
  }
`;

export const Category_Fragment = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`;

export const Dish_Fragment = gql`
  fragment DishParts on Dish {
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
`;
