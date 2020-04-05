import { html } from "heresy";

const Header = {
  extends: "nav",

  mappedAttributes: ["state"],
  onstate() { this.render(); },

  oninit() {
    this.classList.add("navbar", "navbar-light");
  },

  _renderNavItem(navItem) {
    return html`
      <li class="nav-item">
        <a class="nav-link" href="${navItem.hash}">${navItem.name}</a>
      </li>
    `;
  },

  render() {
    const { nav } = this.state;
    this.html`
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          ${Object.keys(nav).map(key => this._renderNavItem(nav[key]))}
        </ul>
      </div>
    `;
  }
}

export default Header;
