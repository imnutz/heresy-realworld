const API_ENDPOINT = "https://conduit.productionready.io/api";

const resolver = (response) => response.ok ? response.json() : Promise.reject(response);

export default {
  login(user) {
    const body = {
      user
    };

    return fetch(`${API_ENDPOINT}/users/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(resolver);
  }
}
