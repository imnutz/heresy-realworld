const changePageAction = () => ({ hash: location.hash });

export default (samApi, intents = {}) => {
  const [changePage] = samApi.getIntents([ changePageAction ]).intents;

  intents.changePage = changePage;

  window.onhashchange = intents.changePage;
}
