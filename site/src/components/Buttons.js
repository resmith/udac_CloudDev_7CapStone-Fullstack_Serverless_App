import React from "react"
import { Button } from "semantic-ui-react"

export const ActionButton = (props) => {
	return <Button primary>{props.content ? props.content : "Click"}</Button>
}
