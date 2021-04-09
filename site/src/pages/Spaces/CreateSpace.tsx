import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import styles from "./Spaces.module.css"

import { saveSession } from "../../utils"
import { ActionButton } from "../../components/Buttons"
import { Header } from "semantic-ui-react"
import { Form } from "semantic-ui-react"
import { createSpace } from "../../api/spaces-api"

const InitialState = {
	state: "",
	loading: true,
	error: null,
	formSpaceName: "",
	formSpaceDescription: "",
	type: "",
	formError: "",
	token: "",
}

type State = typeof InitialState

class CreateSpace extends React.Component<RouteComponentProps, State> {
	constructor(props: any) {
		super(props)

		const token: string = props.auth.getIdToken()
		console.log("Spaces token: ", token)

		this.state = { ...InitialState, token: token }

		// Bindings
		this.handleFormInput = this.handleFormInput.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleFormTypeChange = this.handleFormTypeChange.bind(this)
	}

	componentDidMount() {
		this.setState({
			loading: false,
		})

		// Clear query params
		const url = document.location.href
		window.history.pushState({}, "", url.split("?")[0])
	}

	handleFormTypeChange(type: string) {
		this.setState({ state: type }, () => {
			this.props.history.push(`/${type}`)
		})
	}

	/**
	 * Handle text changes within form fields
	 */

	handleFormInput(field: string, value: string) {
		// const _getKeyValue_ = (key: string, value: any) => (obj: Record<string, any>) => obj[key] = value;

		console.log("CreateSpace handleFormInput field: ", field)
		console.log("CreateSpace handleFormInput value: ", value)

		const nextState = { [field]: value }
		console.log("CreateSpace handleFormInput nextState: ", nextState)

		// nextState[field] = value;

		this.setState(Object.assign(this.state, nextState))
	}

	/**
	 * Handles form submission
	 * @param {object} evt
	 */
	async handleFormSubmit(evt: any) {
		evt.preventDefault()
		console.log("CreateSpace handleFormSubmit submitted: state", this.state)

		let spaceInfo: any
		this.setState({ loading: true, formError: "" })

		// Validate space Name
		if (!this.state.formSpaceName || this.state.formSpaceName === "") {
			return this.setState({
				loading: false,
				formError: "Space Name is required",
			})
		}

		// Validate description
		// if (!this.state.formSpaceDescription) {
		//   return this.setState({
		//     loading: false,
		//     formError: "Space Description is required",
		//   });
		// }

		try {
			spaceInfo = await createSpace(this.state.token, {
				name: this.state.formSpaceName,
				description: this.state.formSpaceDescription,
			})
		} catch (error) {
			console.log(error)
			if (error.message) {
				this.setState({
					formError: error.message,
					loading: false,
				})
			} else {
				this.setState({
					formError: "Sorry, something unknown went wrong.  Please try again.",
					loading: false,
				})
			}
			return
		}

		// saveSession(user.id, user.email, token.token);
		saveSession(spaceInfo)

		window.location.replace("/spaces")
	}

	render() {
		return (
			<div className={`${styles.container} animateFadeIn`}>
				<div className={styles.containerInner}>
					<div className={styles.containerHeader}>
						<Header textAlign="center" as="h1">
							Create Space
						</Header>
					</div>
					<div className={styles.containerContent}>
						<Form onSubmit={this.handleFormSubmit}>
							<Form.Field>
								<label>Space Name</label>
								<input
									placeholder="A sample space"
									value={this.state.formSpaceName}
									onChange={(e) => {
										this.handleFormInput("formSpaceName", e.target.value)
									}}
								/>
							</Form.Field>
							<Form.Field>
								<label>Space Description</label>
								<input
									placeholder="Something descriptive"
									value={this.state.formSpaceDescription}
									onChange={(e) => {
										this.handleFormInput("formSpaceDescription", e.target.value)
									}}
								/>
							</Form.Field>
							<ActionButton primary content={"Submit"} type="submit" />
						</Form>
					</div>
					<div>
						{this.state.formError && (
							<div className={styles.formError}>{this.state.formError}</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(CreateSpace)
