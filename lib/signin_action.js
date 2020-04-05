import Api from "./api";

const signinAction = (email, password) => ({ authorizing: true, email, password });

const apiLoginAction = user => {
  return Api.login(user).then((user) => ({ authorized: true, user }));
}

// NAPs
const nap = (model) => () => {
  if (model.authorizing) {
    window.intents.apiLogin({
      email: model.email,
      password: model.password
    });

    return true;
  }

  return false;
}

export default (samApi, intents = {}) => {
  const [ signin, apiLogin ] = samApi.getIntents([ signinAction, apiLoginAction ]).intents;

  samApi.addNAPs([ nap ]);

  intents.signin = signin;
  intents.apiLogin = apiLogin;
}
