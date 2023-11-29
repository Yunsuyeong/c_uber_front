describe("Log in", () => {
  const user = cy;
  it("should see Login page", () => {
    user.visit("/").title().should("eq", "Login | Uber Eats");
  });

  it("can fill out the form", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("vanquishr@daum.net");
    user.findByPlaceholderText(/password/i).type("1234");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
  });
});
