import "source-map-support/register"
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda"

import { DeleteSpaceRequest } from "../../requests/DeleteSpaceRequest"
import { deleteSpace, deleteImages } from "../../businessLogic/spaces"

import { createLogger } from "../../utils/logger"

const logger = createLogger("http/deleteSpace")

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	logger.info("handler: ", event)

	const deleteRequest: DeleteSpaceRequest = {
		spaceId: event.pathParameters.spaceId,
	}
	logger.info("handler", deleteRequest)

	const authorization = event.headers.Authorization
	const split = authorization.split(" ")
	const jwtToken = split[1]
	logger.info("handler", jwtToken)

	const deletedItem = await deleteSpace(deleteRequest, jwtToken)
	await deleteImages(deleteRequest, jwtToken)

	// SPACE: Remove a SPACE item by id
	return {
		statusCode: 201,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify({
			deletedItem,
		}),
	}
}
