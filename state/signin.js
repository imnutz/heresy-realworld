export default {
  acceptors: [
    model => proposal => {
      const { authorizing, authorized, user, email, password } = proposal;

      if (authorizing) {
        model.authorizing = true;
        model.email = email;
        model.password = password;
      }

      if (authorized) {
        model.authorizing = false;
        model.email = null;
        model.password = null;

        model.user = user.user;
        model.header.nav["authorized"] = {
          name: model.user.username,
          hash: "#/profile"
        }
      }

      return model;
    }
  ]
}
