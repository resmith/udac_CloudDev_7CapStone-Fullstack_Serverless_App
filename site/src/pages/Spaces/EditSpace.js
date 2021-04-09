import React, { useEffect, useState } from "react"
import { withRouter, useParams } from "react-router-dom"
import styles from "./Spaces.module.css"

import { saveSession } from "../../utils"
import { ActionButton } from "../../components/Buttons"
import { Header } from "semantic-ui-react"
import { Form } from "semantic-ui-react"
import { getSpace, patchSpace } from "../../api/spaces-api"

const EditSpace = (props) => {
	const [space, setSpace] = useState(null)
	const [idToken, setIdToken] = useState(props.auth.getIdToken())
	const [formSpaceName, setFormSpaceName] = useState(null)
	const [formSpaceDescription, setformSpaceDescription] = useState(null)
	const [loading, setLoading] = useState(true)
	const [formError, setFormError] = useState(null)

	let { spaceId } = useParams()

	useEffect(() => {
		;(async () => {
			console.log("Space props: ", props)
			console.log("Space spaceId: ", spaceId)

			let authIdToken = props.auth.getIdToken()
			console.log("Space useEffect authIdToken: ", authIdToken)

			setIdToken(authIdToken)
			console.log("Space useEffect idToken: ", idToken)

			try {
				const response = await getSpace(spaceId, authIdToken)
				console.log("Space useEffect getSpace: ", response)
				setSpace(response.Item)
				setFormSpaceName(response.Item.name)
				setformSpaceDescription(response.Item.description)
				setLoading(false)
			} catch (e) {
				console.error(e)
			}
			// this.handleFormInput = this.handleFormInput.bind(this)
			// this.handleFormSubmit = this.handleFormSubmit.bind(this)
		})()
	}, [props, spaceId])

	/**
	 * Handle text changes within form fields
	 */

	const handleFormInput = (field, value) => {
		// const _getKeyValue_ = (key: string, value: any) => (obj: Record<string, any>) => obj[key] = value;

		console.log("EditSpace handleFormInput field: ", field)
		console.log("EditSpace handleFormInput value: ", value)
		switch (field) {
			case "formSpaceName":
				setFormSpaceName(value)
				break
			case "formSpaceDescription":
				setformSpaceDescription(value)
				break
			default:
				console.log(
					"error: EditSpace handleFormInput field unrecognized: ",
					field
				)
		}
	}

	/**
	 * Handles form submission
	 * @param {object} evt
	 */
	async function handleFormSubmit(evt) {
		evt.preventDefault()

		let spaceInfo
		setLoading(true)
		setFormError("")

		// Validate space Name
		if (!formSpaceName || formSpaceName === "") {
			setLoading(false)
			setFormError("Space Name is required")
			return
		}

		const updateParams = {
			name: formSpaceName,
			description: formSpaceDescription,
		}

		console.log("EditSpace space.spaceId: ", space.spaceId)
		console.log("EditSpace updateParams: ", updateParams)
		try {
			spaceInfo = await patchSpace(idToken, space.spaceId, updateParams)
		} catch (error) {
			console.log(error)
			if (error.message) {
				setFormError(error.message)
				setLoading(false)
			} else {
				setFormError("Sorry, something unknown went wrong.  Please try again.")
				setLoading(false)
			}
			return
		}

		// saveSession(user.spaceId, user.email, idToken.idToken);
		saveSession(spaceInfo)

		window.location.replace("/spaces")
	}

	if (loading) return <i className="spinner icon"></i>

	return (
		<div className={`${styles.container} animateFadeIn`}>
			<div className={styles.containerInner}>
				<div className={styles.containerHeader}>
					<Header textAlign="center" as="h1">
						Edit Space
					</Header>
				</div>
				<div className={styles.containerContent}>
					<Form onSubmit={handleFormSubmit}>
						<Form.Field>
							<label>Space Name</label>
							<input
								placeholder="A sample space"
								value={formSpaceName}
								onChange={(e) => {
									handleFormInput("formSpaceName", e.target.value)
								}}
							/>
						</Form.Field>
						<Form.Field>
							<label>Space Description</label>
							<input
								placeholder="Something descriptive"
								value={formSpaceDescription}
								onChange={(e) => {
									handleFormInput("formSpaceDescription", e.target.value)
								}}
							/>
						</Form.Field>
						<ActionButton primary content={"Submit"} type="submit" />
					</Form>
				</div>
				<div>
					{formError && <div className={styles.formError}>{formError}</div>}
				</div>
			</div>
		</div>
	)
}

export default withRouter(EditSpace)
