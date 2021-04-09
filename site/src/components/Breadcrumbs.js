import React, { Component } from "react"
import { Menu } from "semantic-ui-react"
// import { useHistory } from "react-router-dom"

const nameLink = {
	spaces: "/spaces",
	home: "/",
}

export default class BreadCrumbs extends Component {
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

	render() {
		console.log(`Breadcrumbs render props: `, this.props)
		console.log(`Breadcrumbs render state: `, this.state)
		const { activeItem } = this.state

		// const { isAuthenticated, user, loginWithRedirect, logout } = this.props.auth
		const { auth } = this.props

		return (
			<div class="ui breadcrumb">
				<a class="section" href="/">
					Home
				</a>
				<div class="divider"> / </div>
				<a class="section">Spaces</a>
				<div class="divider"> / </div>
				<div class="active section">T-Shirt</div>
			</div>
		)
	}
}
