import { render } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";

describe("<Restaurant />", () => {
  it("renders OK", () => {
    const { debug, getByText, container } = render(
      <Restaurant id="1" coverImg="x" name="nameTest" categoryName="catTest" />
    );
    debug();
    getByText("nameTest");
    getByText("catTest");
  });
});
