module.exports = {
  client: {
    includes: ["./src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "c_uber_backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
