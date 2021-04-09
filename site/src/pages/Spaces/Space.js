import React, { useEffect, useState } from "react"
import { withRouter, useParams, Link } from "react-router-dom"

import styles from "./Spaces.module.css"
import { Header } from "semantic-ui-react"
import { getSpace, deleteSpace } from "../../api/spaces-api"

const Space = (props) => {
	const [space, setSpaceState] = useState(null)
	const [idToken, setIdToken] = useState(null)
	const [showDeleteSpaceConfirmation, setDeleteSpaceConfirmation] = useState(
		false
	)
	const [spaceDoesNotExist, setSpaceDoesNotExist] = useState(false)
	const { spaceId } = useParams()

	useEffect(() => {
		;(async () => {
			console.log("Space useEffect props: ", props)
			console.log("Space useEffect spaceId: ", spaceId)

			let authIdToken = props.auth.getIdToken()
			console.log("Space useEffect authIdToken: ", authIdToken)

			setIdToken(authIdToken)
			console.log("Space useEffect idToken: ", idToken)

			try {
				const response = await getSpace(spaceId, authIdToken)
				console.log("Space useEffect getSpace response: ", response)

				if (!response || Object.keys(response).length === 0) {
					setSpaceDoesNotExist(true)
					setTimeout(() => {
						props.history.push(`/spaces`)
					}, 2500)
				}
				setSpaceState(response.Item)
			} catch (e) {
				console.error(e)
			}
		})()
	}, [props, spaceId])

	const deleteThisSpace = async () => {
		console.log("Space deleteSpace space: ", space)
		console.log("Space deleteSpace id: ", spaceId)
		console.log("Space deleteSpace idToken: ", idToken)

		try {
			const deleteResponse = await deleteSpace(idToken, space.spaceId)
			console.log("deleteSpace deleteResponse: ", deleteResponse)
		} catch (e) {
			console.error(e)
		}
		props.history.push(`/spaces`)
		setDeleteSpaceConfirmation(false)
	}

	console.log("Space space: ", space)

	if (spaceDoesNotExist) {
		return (
			<div className="ui negative orange floating message">
				<p>Spaces does not exist</p>
			</div>
		)
	}

	if (!space) {
		return <div>Loading...</div>
	}

	const deleteSpaceConfirmation = () => {
		return (
			<div class="ui teal active tiny modal">
				<div class="ui icon header">Delete Space?</div>
				<div class="actions">
					<div
						class="ui red basic cancel button"
						onClick={() => setDeleteSpaceConfirmation(false)}
					>
						<i class="remove icon"></i>
						No
					</div>
					<div class="ui green ok  button" onClick={() => deleteThisSpace()}>
						<i class="checkmark icon"></i>
						Yes
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={`${styles.container} animateFadeIn`}>
			<div className={styles.containerInner}>
				<div className={styles.containerHeader}>
					<Header textAlign="center" as="h1">
						Space
					</Header>
				</div>
				<div className={styles.containerContent}>
					<div key={space.spaceId} className="ui stackable one column grid">
						<div className="column">{space.name}</div>
						<div className="column">{space.description}</div>
					</div>
					{showDeleteSpaceConfirmation ? deleteSpaceConfirmation() : null}
				</div>

				<div className="ui twelve column centered grid">
					<div className="four wide column">
						<Link to={`/spaces/${space.spaceId}/attachments`}>
							<i className="image outline icon"></i>
						</Link>
					</div>
					<div className="four wide column">
						<Link to={`/spaces/${space.spaceId}/edit`}>
							<i className="edit icon"></i>
						</Link>
					</div>

					<div className="four wide column">
						<i
							className="trash alternate icon"
							onClick={() => setDeleteSpaceConfirmation(true)}
						></i>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withRouter(Space)
