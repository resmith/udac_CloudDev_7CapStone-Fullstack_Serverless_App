import React, { Component } from "react"
import { Router, Route, Switch } from "react-router-dom"
import { Container } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"
import { Button } from "semantic-ui-react"

import Auth from "./auth/Auth"
import history from "./history"

// import Loading from "./components/Loading"
import AppMenu from "./components/AppMenu"

import Home from "./pages/Home/Home"
import CreateSpace from "./pages/Spaces/CreateSpace"
import EditSpace from "./pages/Spaces/EditSpace"
import Spaces from "./pages/Spaces/Spaces"
import Space from "./pages/Spaces/Space"
import Pics from "./pages/Pics/Pics"
import NoMatch from "./pages/Nomatch/Nomatch"

const auth = new Auth(history)

export default class App extends Component {
	constructor(props) {
		super(props)

		this.handleLogin = this.handleLogin.bind(this)
		this.handleLogout = this.handleLogout.bind(this)
	}

	handleLogin() {
		this.props.auth.login()
	}

	handleLogout() {
		this.props.auth.logout()
	}

	render() {
		console.log("App this.props: ", this.props)
		console.log("App auth: ", auth)
		console.log("App auth.isAuthenticated(): ", auth.isAuthenticated())
		console.log("App auth.getIdToken(): ", auth.getIdToken())

		// if (!this.state.auth) {
		// 	return <Loading />
		// }

		return (
			<Router history={this.props.history}>
				<div id="app" className="d-flex flex-column h-100">
					<AppMenu auth={auth} />

					<Container className="flex-grow-1 mt-5">
						<Button
							className={`buttonPrimaryLarge`}
							onClick={() => this.props.auth.login()}
						>
							Click to Login
						</Button>

						{this.generateRoutes()}
					</Container>
					{/* <Footer /> */}
				</div>
			</Router>
		)
	}

	generateRoutes() {
		console.log(
			"App generateRoutes auth.isAuthenticated(): ",
			auth.isAuthenticated()
		)
		if (!auth.isAuthenticated()) {
			// >>> TODO: if (!this.props.auth.isAuthenticated()) {
			return <Home auth={auth} />
		}

		return (
			<Switch>
				<Route
					exact
					path="/"
					render={(props) => {
						return <Home auth={auth} {...props} />
					}}
				/>
				<Route
					exact
					path="/spaces"
					render={(props) => {
						return <Spaces auth={auth} {...props} />
					}}
				/>
				<Route
					exact
					path="/spaces"
					render={(props) => {
						return <Spaces auth={auth} {...props} />
					}}
				/>
				<Route
					exact
					path="/spaces/new"
					render={(props) => {
						return <CreateSpace auth={auth} {...props} />
					}}
				/>
				<Route
					exact
					path="/spaces/:spaceId"
					render={(props) => {
						return <Space auth={auth} {...props} />
					}}
				/>
				<Route
					exact
					path="/spaces/:spaceId/edit"
					render={(props) => {
						return <EditSpace auth={auth} {...props} />
					}}
				/>
				<Route
					exact
					path="/spaces/:spaceId/attachments"
					render={(props) => {
						return <Pics auth={auth} {...props} />
					}}
				/>
				<Route component={NoMatch} auth={auth} />
			</Switch>
		)
	}
}
