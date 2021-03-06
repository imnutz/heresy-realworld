export default {
  header: {
    title: 'Conduit',
    welcomeMessage: 'A place to share your knowledge.',

    nav: {
      home: {
        name: 'Home',
        hash: '#/home'
      },
      signin: {
        name: 'Sign In',
        hash: '#/login'
      },
      singup: {
        name: 'Sign Up',
        hash: '#/register'
      },
      settings: {
        name: 'Settings',
        hash: '#/settings'
      },
      editor: {
        name: 'New Article',
        hash: '#/editor'
      }
    }
  },

  getUnauthorizedNav() {
    return [
      this.header.nav.home,
      this.header.nav.signin,
      this.header.nav.singup
    ];
  },

  getAuthorizedNav() {
    return [
      this.header.nav.home,
      this.header.nav.settings,
      this.header.nav.editor,
      this.header.nav.authorized
    ]
  }
}
