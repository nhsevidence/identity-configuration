import React from 'react'
import Alert from '@nice-digital/nds-alert'
import pathOr from 'ramda/src/pathOr'
import { Input, Fieldset } from '@nice-digital/nds-forms'
// local imports
import { showNav, isDomainInUsername } from '../../../util'
import AuthApi from '../../../services/AuthApi'
import { auth as authOpts } from '../../../services/constants'
// import Logo from '../assets/logo.png'

import './LoginForm.scss'

export class Login extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      username: null,
      password: null,
      error: null,
      loading: false,
      isAD: false,
      connection: authOpts.connection,
      showGoogleLogin: false
    }
  }
  componentDidMount() {
    this.auth.fetchClientSettings().then(() => {
      this.googleConnection = pathOr(
        null,
        ['strategies', 'google-oauth2', 'connectionName'],
        window.Auth0
      )
      this.ADConnection = pathOr(
        null,
        ['strategies', 'waad', 'connectionName'],
        window.Auth0
      )
      this.setState({ showGoogleLogin: !!this.googleConnection })
    })
  }

  login = (e, isGoogle) => {
    if (e) e.preventDefault()
    const requestErrorCallback = err =>
      this.setState({ error: err.description || err.error_description, loading: false })
    try {
      this.setState({ loading: true }, () => {
        const { username, password, connection } = this.state
        const loginConnection = isGoogle ? this.googleConnection : connection
        this.auth.login(
          loginConnection,
          username,
          password,
          requestErrorCallback
        )
      })
    } catch (err) {
      // console.log(err)
      this.setState({ loading: false })
    }
  }

  handleChange = ({ target: { name, value } }) => {
    let isAD = null
    if (name === 'username') {
      isAD = isDomainInUsername(value)
    }
    this.setState({
      [name]: value,
      error: null,
      isAD,
      connection: isAD ? this.ADConnection : this.state.connection
    })
  }

  render() {
    showNav()
    const {
      error, loading, isAD, showGoogleLogin
    } = this.state

    return (
      <form className="">
        <Fieldset legend="Personal information">
          {error && <Alert type="error">{error}</Alert>}
          <Input
            data-qa-sel="login-email"
            label="Email"
            id="username"
            name="username"
            type="email"
            placeholder="eg: your.name@example.com..."
            onChange={this.handleChange}
          />
          {!isAD && (
            <Input
              data-qa-sel="login-password"
              name="password"
              type="password"
              label="Password"
              onChange={this.handleChange}
            />
          )}
        </Fieldset>
        {!loading ? (
          <div>
            <button
              data-qa-sel="login-button"
              className="btn btn--cta"
              onClick={e => this.login(e, false)}
              // disabled={!username}
            >
              Sign in
            </button>
            {showGoogleLogin && (
              <button
                data-qa-sel="login-button-social"
                className="iconBtn social"
                style={{ float: 'right' }}
                onClick={e => this.login(e, true)}
              >
                <span className="buttonLabel">Or sign in with</span>
                <img
                  className="iconBtn-icon"
                  alt="Sign in with google"
                  src="https://d2i72ju5buk5xz.cloudfront.net/gsc/OLZUJZ/b2/91/66/b29166a7cbbb4366a0489f51425d4eef/images/sign_in_nice_org_v1/u1197.png?token=e0f2a5088357cc15a5a882ace3c75abd"
                />
              </button>
            )}
          </div>
        ) : (
          'Loading...'
        )}
      </form>
    )
  }
}

export default Login
