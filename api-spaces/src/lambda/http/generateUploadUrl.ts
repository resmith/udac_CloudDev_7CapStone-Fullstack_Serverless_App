import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda"
import "source-map-support/register"
import * as AWS from "aws-sdk"
import { v4 as uuidv4 } from "uuid"
import { createLogger } from "../../utils/logger"

const AWSXRay = require("aws-xray-sdk")
const XAWS = AWSXRay.captureAWS(AWS)

import { parseUserId } from "../../auth/utils"

const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
	signatureVersion: "v4",
	region: "us-west-2",
})

const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger("lambda/http/generateUploadUrl")

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	logger.info("handler event:", { event })

	const uploadUrl = await createImage(event)
	logger.info("handler uploadUrl: ", { uploadUrl })

	// SPACE: Return a presigned URL to upload a file for a SPACE item with the provided id
	return {
		statusCode: 201,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify({
			uploadUrl,
		}),
	}
}

async function createImage(event: any) {
	logger.info("createImage event:", { event })

	const timestamp = new Date().toISOString()
	logger.info(`createImage timestamp: ${timestamp} `)

	// Gather all necessary data
	const authorization = event.headers.Authorization
	logger.info("createImage", { authorization })

	const split = authorization.split(" ")
	const jwtToken = split[1]
	logger.info("createImage", { jwtToken })

	const userId = parseUserId(jwtToken)
	logger.info(`createImage userId: ${userId} `)

	const spaceId: string = event.pathParameters.spaceId
	logger.info("createImage spaceId:", { spaceId })

	const imageId = uuidv4()
	logger.info(`createImage imageId: ${imageId} `)

	// Gather all necessary data
	const uploadUrl = getUploadUrl(imageId)
	logger.info("createImage uploadUrl:", { uploadUrl })

	const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

	const params = {
		TableName: imagesTable,
		Item: {
			userId,
			spaceId,
			createdAt: new Date().toISOString(),
			imageId,
			timestamp,
			attachmentUrl,
		},
	}
	logger.info("createImage params:", { params })

	try {
		await docClient.put(params).promise()
	} catch (err) {
		logger.error(`createImage docClient.put error`, { err })
	}

	return uploadUrl
}

function getUploadUrl(imageId: string) {
	logger.info(`getUploadUrl imageId: ${imageId}`)

	const urlExpirationNumber: number = Number(urlExpiration)
	logger.info(`getUploadUrl urlExpirationNumber: ${urlExpirationNumber}`)

	return s3.getSignedUrl("putObject", {
		Bucket: bucketName,
		Key: imageId,
		Expires: urlExpirationNumber,
	})
}
