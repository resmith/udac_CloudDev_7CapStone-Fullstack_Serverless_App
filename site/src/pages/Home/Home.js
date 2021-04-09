import * as React from "react"
import { Header } from "semantic-ui-react"

import styles from "./Home.module.css"

export default class Home extends React.PureComponent {
	render() {
		console.log(`Home props: `, this.props)
		const { auth } = this.props
		console.log(`Home isAuthenticated: `, auth.isAuthenticated())

		return (
			<div className={`${styles.container} animateFadeIn`}>
				<div className={styles.containerInner}>
					{/* Hero Artwork */}
					<Header textAlign="center" as="h1" color="yellow">
						PicSpace
					</Header>

					{/* Hero Description */}
					<div className={`${styles.heroDescription}`}>
						An application for collecting pics. Built with the Serverless
						Framework, Lambda, AWS HTTP API, Express.js, React & AWS DynamoDB.
					</div>

					{/* Call To Action */}

					{!auth.isAuthenticated() ? (
						<div className={`${styles.containerCta}`}>
							<button
								className={`buttonPrimaryLarge`}
								onClick={() => this.props.auth.login()}
							>
								Log In
							</button>
						</div>
					) : null}
				</div>
			</div>
		)
	}
}
