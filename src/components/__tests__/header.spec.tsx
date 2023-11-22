import { queryByText, render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import Header from "../header";
import { MockedProvider } from "@apollo/client/testing";
import { Me_Query } from "../../hooks/useMe";

describe("<Header />", () => {
  it("renders OK", async () => {
    await waitFor(async () => {
      const { debug, getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: Me_Query,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "x",
                    role: "a",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header email={"test"} />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      debug();
    });
  });
});
