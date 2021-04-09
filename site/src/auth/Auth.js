import auth0 from "auth0-js"
import { authConfig } from "../config"

export default class Auth {
	accessToken
	idToken
	expiresAt
	isLoggedIn

	auth0 = new auth0.WebAuth({
		domain: authConfig.domain,
		clientID: authConfig.clientId,
		redirectUri: authConfig.callbackUrl,
		responseType: "token id_token",
		scope: "openid",
	})

	constructor(history) {
		console.log("Auth constructor auth0: ", auth0)
		this.history = history

		this.login = this.login.bind(this)
		this.logout = this.logout.bind(this)
		this.handleAuthentication = this.handleAuthentication.bind(this)
		this.isAuthenticated = this.isAuthenticated.bind(this)
		this.getAccessToken = this.getAccessToken.bind(this)
		this.getIdToken = this.getIdToken.bind(this)
		this.renewSession = this.renewSession.bind(this)
	}

	login() {
		console.log("** Auth login")
		this.auth0.authorize()
	}

	handleAuthentication() {
		console.log("** Auth handleAuthentication")
		this.auth0.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				console.log("Access token: ", authResult.accessToken)
				console.log("id token: ", authResult.idToken)
				this.setSession(authResult)
				this.history.replace("/")
			} else if (err) {
				this.history.replace("/")
				console.log(err)
				alert(`Error: ${err.error}. Check the console for further details.`)
			}
		})
	}

	getAccessToken() {
		console.log("** Auth getAccessToken")
		return this.accessToken
	}

	getIdToken() {
		this.idToken = localStorage.getItem("idToken")
		console.log("** Auth getIdToken idToken: ", this.idToken)
		return this.idToken
	}

	setSession(authResult) {
		console.log("** Auth setSession")
		// Set variables
		let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

		// Set localStorage
		localStorage.setItem("isLoggedIn", "true")
		localStorage.setItem("expiresAt", expiresAt)
		localStorage.setItem("accessToken", authResult.accessToken)
		localStorage.setItem("idToken", authResult.idToken)

		// Set this
		this.isLoggedIn = true
		this.expiresAt = expiresAt
		this.accessToken = authResult.accessToken
		this.idToken = authResult.idToken

		// navigate to the home route
		this.history.replace("/")
	}

	renewSession() {
		console.log("** Auth renewSession")
		this.auth0.checkSession({}, (err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult)
			} else if (err) {
				this.logout()
				console.log(err)
				alert(
					`Could not get a new token (${err.error}: ${err.error_description}).`
				)
			}
		})
	}

	logout() {
		console.log("** Auth Logout")
		// Set localStorage
		localStorage.setItem("isLoggedIn", false)
		localStorage.setItem("expiresAt", 0)
		localStorage.setItem("accessToken", "")
		localStorage.setItem("idToken", "")

		// Set localStorage
		localStorage.removeItem("isLoggedIn")
		localStorage.removeItem("expiresAt")
		localStorage.removeItem("accessToken")
		localStorage.removeItem("idToken")

		// Set this
		this.isLoggedIn = false
		this.expiresAt = 0
		this.accessToken = null
		this.idToken = null

		this.auth0.logout({
			return_to: window.location.origin,
		})

		// navigate to the home route
		// this.history.replace("/")
	}

	isAuthenticated() {
		console.log("** Auth isAuthenticated")
		// Check whether the current time is past the
		// access token's expiry time
		console.log(
			`Auth localStorage.getItem("expiresAt") ${localStorage.getItem(
				"expiresAt"
			)}`
		)

		return new Date().getTime() < localStorage.getItem("expiresAt")
	}
}
