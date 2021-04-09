import * as AWS from "aws-sdk"
import * as AWSXRay from "aws-xray-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { createLogger } from "../utils/logger"

import { SpaceItem } from "../models/SpaceItem"
import { SpaceUpdate } from "../models/SpaceUpdate"
import { SpaceKey } from "../models/SpaceKey"
// import { ImagesKey } from "../models/ImagesKey"
import { ImagesSearchKey } from "../models/ImagesSearchKey"

import { ImagesItem } from "../models/ImagesItem"

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger("dl/spacesAccess")

export class SpaceAccess {
	constructor(
		private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(
			{ apiVersion: "2012-08-10" }
		),
		// private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(
		// 	{ region: "us-east-1" }
		// ),
		private readonly spacesTable = process.env.SPACES_TABLE,
		private readonly imagesTable = process.env.IMAGES_TABLE,
		private readonly spacesUserIdIndex = process.env.SPACES_USER_ID_INDEX,
		private readonly imagesSpaceIdIndex = process.env.IMAGES_INDEX
	) {}

	async getAllSpaces(userId: string): Promise<SpaceItem[]> {
		logger.info("getAllSpaces", { spacesTable: this.spacesTable })

		const result = await this.docClient
			.query({
				TableName: this.spacesTable,
				IndexName: this.spacesUserIdIndex,
				KeyConditionExpression: "userId = :userId",
				ExpressionAttributeValues: {
					":userId": userId,
				},
			})
			.promise()

		const items = result.Items
		return items as SpaceItem[]
	}

	async getSpace(spaceItem: SpaceItem): Promise<SpaceItem> {
		logger.info("getSpace spaceItem: ", spaceItem)

		const param = {
			TableName: this.spacesTable,
			Key: {
				userId: spaceItem.userId,
				spaceId: spaceItem.spaceId,
			},
		}
		logger.info("getSpace param: ", param)

		const result = await this.docClient.get(param).promise()
		logger.info("getSpace result: ", result)

		return (result as unknown) as SpaceItem
	}

	async getSpaceImages(imagesKey: ImagesSearchKey): Promise<[ImagesItem]> {
		logger.info("dl/spacesAccess/getSpaceImages imagesKey: ", imagesKey)

		const params = {
			TableName: this.imagesTable,
			IndexName: this.imagesSpaceIdIndex,
			KeyConditionExpression: "spaceId = :spaceId",
			ExpressionAttributeValues: {
				":spaceId": imagesKey.spaceId,
			},
		}
		logger.info("dl/spacesAccess/getSpaceImages param: ", params)
		const result = await this.docClient.query(params).promise()
		logger.info("dl/spacesAccess/getSpaceImages result: ", result)

		return (result.Items as unknown) as [ImagesItem]
	}

	async createSpace(spaceItem: SpaceItem): Promise<SpaceItem> {
		logger.info("dl/spacesAccess/createSpace spaceItem: ", { spaceItem })
		await this.docClient
			.put({
				TableName: this.spacesTable,
				Item: spaceItem,
			})
			.promise()

		return spaceItem
	}

	async updateSpace(spaceItem: SpaceUpdate): Promise<SpaceUpdate> {
		logger.info("updateSpace spaceItem:", { spaceItem })

		const params = {
			TableName: this.spacesTable,
			Key: {
				userId: spaceItem.userId,
				spaceId: spaceItem.spaceId,
			},
			UpdateExpression: "set #name = :name, #description = :description",
			ExpressionAttributeValues: {
				":name": spaceItem.name,
				":description": spaceItem.description,
			},
			ExpressionAttributeNames: {
				"#name": "name",
				"#description": "description",
			},
			ReturnValues: "UPDATED_NEW",
		}

		logger.info("updateSpace update: ", { params })
		const result = await this.docClient.update(params).promise()

		return (result as unknown) as SpaceUpdate
	}

	async deleteSpace(spaceItem: SpaceKey): Promise<SpaceItem> {
		logger.info("dl/spacesAccess/deleteSpace", { spaceItem })
		let result

		const params = {
			TableName: this.spacesTable,
			Key: {
				userId: spaceItem.userId,
				spaceId: spaceItem.spaceId,
			},
			ReturnValues: "ALL_OLD",
		}
		logger.info("dl/spacesAccess/deleteSpace params", { params })

		try {
			result = await this.docClient.delete(params).promise()
		} catch (err) {
			console.log("dl/spacesAccess/deleteSpace err: ", err)
		}
		logger.info("dl/spacesAccess/deleteSpace result: ", result)

		return (result as unknown) as SpaceItem
	}

	async deleteImages(imagesKey: ImagesSearchKey): Promise<SpaceKey> {
		logger.info("dl/spacesAccess/deleteImages imagesKey: ", {
			imagesKey,
		})
		let result

		const response = await this.getSpaceImages({
			spaceId: imagesKey.spaceId,
		})
		logger.info("dl/spacesAccess/deleteImages response: ", {
			response,
		})
		const images = response
		logger.info("dl/spacesAccess/deleteImages images: ", {
			images,
		})

		for (const image of images) {
			const params = {
				TableName: this.imagesTable,
				Key: {
					spaceId: image.spaceId,
					imageId: image.imageId,
				},
				ReturnValues: "ALL_OLD",
			}
			logger.info("dl/spacesAccess/deleteImages params", { params })
			result = await this.docClient.delete(params).promise()
			logger.info("dl/spacesAccess/deleteImages result: ", result)
		}

		return (result as unknown) as SpaceKey
	}
}
