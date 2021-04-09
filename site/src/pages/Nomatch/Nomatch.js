import * as React from "react"
import { Header } from "semantic-ui-react"

import styles from "./Nomatch.module.css"

export default class NoMatch extends React.PureComponent {
	render() {
		console.log(`NoMatch props: `, this.props)

		return (
			<div className={`${styles.container} animateFadeIn`}>
				<div className={styles.containerInner}>
					{/* Hero Artwork */}
					<Header textAlign="center" as="h1" color="yellow">
						No match on the page your looking for ;(
					</Header>

					{/* Hero Description */}
					<div className={`${styles.heroDescription}`}>
						PicSpace <br />
						An application for collecting pics. Built with the Serverless
						Framework, Lambda, AWS HTTP API, Express.js, React & AWS DynamoDB.
					</div>

					{/* Call To Action */}

					{!false ? (
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
