describe("Create Account", () => {
  const user = cy;
  it("should be able to create account", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccount") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
              },
            },
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("abc123@gmail.com");
    user.findByPlaceholderText(/password/i).type("12345");
    user.findByRole("button").click();
    user.wait(1000);
    user.title().should("eq", "Login | User Eats");
    user.findByPlaceholderText(/email/i).type("abc123@gmail.com");
    user.findByPlaceholderText(/password/i).type("12345");
    user.findByRole("button").click();
    user.window().its("localStorage.uber-token").should("be.a", "string");
    // @ts-ignore
    user.assertLoggedIn();
  });
});
