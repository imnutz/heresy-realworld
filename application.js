import { define, render, html } from "heresy";
import { createInstance, api } from "sam-pattern";

import Conduit from "./components/main";

import initialState from "./state/initial_state";
import startAction from "./lib/start_action";
import setupRouter from "./lib/routing_action";
import setupSignInAction from "./lib/signin_action";

import header from "./state/header";
import signin from "./state/signin";

const renderer = (state) => {
  render(document.body, html`<Conduit .state=${state} .intents=${window.intents}/>`);
}

// define Conduit component
define("Conduit", Conduit);

window.intents = window.intents || {};

// setup SAM
const samApi = api(createInstance());
samApi.addInitialState(initialState);

setupRouter(samApi, intents);
setupSignInAction(samApi, intents);

samApi.addComponent(header);
samApi.addComponent(signin);

const [startApplication] = samApi.getIntents([ startAction ]).intents;

samApi.setRender(renderer);
startApplication();

