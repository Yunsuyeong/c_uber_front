import { render } from "@testing-library/react";
import React from "react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("renders OK", () => {
    const { debug, getByText } = render(<FormError errorMessage="test" />);
    getByText("test");
    debug();
  });
});
