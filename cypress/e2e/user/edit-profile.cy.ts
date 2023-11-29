describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    //@ts-ignore
    user.login("vanquishr@daum.net", "1234");
  });
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.wait(2000);
    user.title().should("eq", "Edit Profile | Uber Eats");
  });

  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        //@ts-ignore
        req.body?.variables?.input?.email = "vanquishr@daum.net";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("new@daum.net");
    user.findByRole("button").click();
  });
});
