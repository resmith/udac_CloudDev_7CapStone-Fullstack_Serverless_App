import "source-map-support/register"
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda"
import { createLogger } from "../../utils/logger"

import { getUserId } from "../utils"
import { getSpaceImages } from "../../businessLogic/spaces"

const logger = createLogger("lambda/http/getSpace")

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// SPACE: Get all SPACE items for a current user
	logger.info("handler event:", { event })

	const userId: string = getUserId(event)
	logger.info("handler userId:", { userId })

	const spaceId: string = event.pathParameters.spaceId

	const spaceItem = { spaceId }

	const images = await getSpaceImages(spaceItem)
	logger.info("handler getSpaceImages images:", { images })

	return {
		statusCode: 201,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify({
			images,
		}),
	}
}
