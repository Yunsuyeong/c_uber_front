import { render, waitFor } from "../../test-utils";
import React from "react";
import NotFound from "../404";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

describe("<NotFound />", () => {
  it("render OK", async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe("Not Found | User Eats");
    });
  });
});
