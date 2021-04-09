import "source-map-support/register"
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda"
import { createLogger } from "../../utils/logger"

import { getUserId } from "../utils"
import { getAllSpaces } from "../../businessLogic/spaces"

const logger = createLogger("getSpaces")

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// SPACE: Get all SPACE items for a current user
	logger.info("lambda/http/getSpaces event: ", { event })

	const userId: string = getUserId(event)
	logger.info("lambda/http/getSpaces userId: ", { userId })

	const spaces = await getAllSpaces(userId)
	logger.info("lambda/http/getSpaces spaces: ", { spaces })

	return {
		statusCode: 201,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify({
			spaces,
		}),
	}
}
