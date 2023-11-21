module.exports = {
  client: {
    includes: ["./src/**/*.{ts,tsx}"],
    tagName: "gql",
    service: {
      name: "c_uber_backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
