import { html } from "heresy";

const Header = {
  extends: "nav",

  mappedAttributes: ["data"],
  ondata() { this.render(); },

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
    this.html`
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          ${this.data.map(navItem => this._renderNavItem(navItem))}
        </ul>
      </div>
    `;
  }
}

export default Header;
