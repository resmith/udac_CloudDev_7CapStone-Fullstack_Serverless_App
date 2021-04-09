import React, { Component } from "react"
import { Menu } from "semantic-ui-react"
// import { useHistory } from "react-router-dom"

const nameLink = {
	spaces: "/spaces",
	home: "/",
}

export default class AppMenu extends Component {
	state = {}

	handleItemClick = (e, { name }) => {
		console.log("AppMenu handleItemClick name")
		console.log(name)
		console.log(this.props)
		this.setState({ activeItem: name })
		const link = nameLink[name]
		console.log("AppMenu handleItemClick link: ", link)
		if (link) {
			this.props.auth.history.push(link)
		}
	}

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		console.log(`AppMenu render props: `, this.props)
		console.log(`AppMenu render state: `, this.state)
		const { activeItem } = this.state

		// const { isAuthenticated, user, loginWithRedirect, logout } = this.props.auth
		const { auth } = this.props

		return (
			<Menu fixed="top" inverted>
				<Menu.Item
					name="home"
					active={activeItem === "home"}
					content="Home"
					onClick={this.handleItemClick}
				/>

				<Menu.Item
					name="spaces"
					active={activeItem === "spaces"}
					content="Spaces"
					onClick={this.handleItemClick}
				/>

				<Menu.Item
					name="user"
					active={activeItem === "user"}
					content={auth.user && auth.user.name ? auth.user.name : ""}
					onClick={this.handleItemClick}
				/>

				<Menu.Item
					name="authentication"
					active={activeItem === "authentication"}
					content={!auth.isAuthenticated() ? "Login" : "LogOut"}
					onClick={
						!auth.isAuthenticated() ? () => auth.login() : () => auth.logout()
					}
				/>
			</Menu>
		)
	}
}

// onClick={
// 	!auth.isAuthenticated()
// 		? () => auth.login()
// 		: () => auth.logout({ returnTo: window.location.origin })
// }
