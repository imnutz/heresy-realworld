import { ref } from "heresy";

const SignIn = {
  extends: "div",

  oninit() {
    this.classList.add("auth-page");

    this.emailField = ref();
    this.passwordField = ref();
  },

  onclick(evt) {
    evt.preventDefault();

    console.log(this.emailField.current.value);
    console.log(this.passwordField.current.value);

    this.intents.signin(this.emailField.current.value, this.passwordField.current.value);
  },

  render() {
    this.html`
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
              <a href="#/register">Don't have an account?</a>
            </p>

            <ul class="error-messages">
              <li>That email is already taken</li>
            </ul>

            <form>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" ref=${this.emailField}>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password" ref=${this.passwordField}>
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" onclick=${this}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

export default SignIn;
