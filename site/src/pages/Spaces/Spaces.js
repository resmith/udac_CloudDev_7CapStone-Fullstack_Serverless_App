import React, { useEffect, useState } from "react"
import { Link, withRouter } from "react-router-dom"

import styles from "./Spaces.module.css"
import { ActionButton } from "../../components/Buttons"
import { Header } from "semantic-ui-react"
import { getSpaces } from "../../api/spaces-api"

const Spaces = (props) => {
	const [spaces, setSpaces] = useState(null)

	useEffect(() => {
		;(async () => {
			console.log("Spaces props: ", props)
			let token = props.auth.getIdToken()
			console.log("Spaces useEffect token: ", token)
			try {
				const response = await getSpaces(token)
				console.log("Spaces useEffect getSpaces: ", response)
				setSpaces(response)
			} catch (e) {
				console.error(e)
			}
		})()
	}, [props])

	console.log("Spaces spaces: ", spaces)

	if (!spaces) {
		return <div>Loading...</div>
	}

	return (
		<div className={`${styles.container} animateFadeIn`}>
			<div className={styles.containerInner}>
				<div className={styles.containerHeader}>
					<Header textAlign="center" as="h1">
						Spaces
					</Header>
				</div>
				<div className={styles.containerContent}>
					<div>{renderSpaces(spaces)}</div>
				</div>
				<div>
					<Link to="/spaces/new">
						<ActionButton primary content={"Create Space"} />
					</Link>
				</div>
			</div>
		</div>
	)
}

const renderSpaces = (spaces) => {
	return (
		<div>
			{spaces.map((space) => {
				return (
					<div key={space.spaceId} className="ui stackable four column grid">
						<div className="six wide column">
							<Link to={`/spaces/${space.spaceId}`}>{space.name}</Link>
						</div>
						<div className="ten wide column">{space.description}</div>
					</div>
				)
			})}
		</div>
	)
}

export default withRouter(Spaces)
