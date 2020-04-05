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

  isAuthorized(user) {
    return user && user.token;
  },

  render() {
    const { currentHash } = this.state.header;
    const { user } = this.state;
    let navItems;

    if (this.isAuthorized(user)) {
      navItems = this.state.getAuthorizedNav();
    } else {
      navItems = this.state.getUnauthorizedNav();
    }


    this.html`
      <Header .data=${navItems}/>
      ${this.getPage(currentHash)}
      <Footer />
    `;
  }
}

export default Conduit;
