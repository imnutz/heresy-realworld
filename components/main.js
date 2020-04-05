import { html } from "heresy";

import Header from "./header";
import SignIn from "./signin";
import SignUp from "./signup";
import Home from "./home";
import Footer from "./footer";

const Conduit = {
  extends: "div",
  includes: {
    Header,
    Home,
    SignIn,
    SignUp,
    Footer
  },

  mappedAttributes: ["state"],
  onstate() { this.render(); },

  getPage(hash) {
    switch(hash) {
      case "#/login":
        return html`<SignIn .intents=${this.intents}/>`;
      case "#/register":
        return html`<SignUp />`;
      default:
        return html`<Home />`;
    }
  },

  render() {
    const { currentHash } = this.state.header;

    this.html`
      <Header .state=${this.state.header}/>
      ${this.getPage(currentHash)}
      <Footer />
    `;
  }
}

export default Conduit;
