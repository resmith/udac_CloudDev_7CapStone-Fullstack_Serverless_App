import * as uuid from "uuid"

import { SpaceItem } from "../models/SpaceItem"
import { ImagesSearchKey } from "../models/ImagesSearchKey"
import { ImagesItem } from "../models/ImagesItem"
import { SpaceAccess } from "../dataLayer/spacesAccess"
import { CreateSpaceRequest } from "../requests/CreateSpaceRequest"
import { DeleteSpaceRequest } from "../requests/DeleteSpaceRequest"
import { UpdateSpaceRequest } from "../requests/UpdateSpaceRequest"
import { parseUserId } from "../auth/utils"

import { createLogger } from "../utils/logger"

const logger = createLogger("businessLogic/spaces")

const spaceAccess = new SpaceAccess()

export async function getAllSpaces(userId): Promise<SpaceItem[]> {
	return spaceAccess.getAllSpaces(userId)
}

export async function getSpace(spaceItem): Promise<SpaceItem> {
	return spaceAccess.getSpace(spaceItem)
}

export async function getSpaceImages(
	imagesKey: ImagesSearchKey
): Promise<[ImagesItem]> {
	return spaceAccess.getSpaceImages(imagesKey)
}

export async function createSpace(
	createSpaceRequest: CreateSpaceRequest,
	jwtToken: string
): Promise<SpaceItem> {
	const itemId = uuid.v4()
	const userId = parseUserId(jwtToken)
	logger.info("businessLogic/createSpace createSpaceRequest", {
		createSpaceRequest,
	})

	return await spaceAccess.createSpace({
		userId: userId,
		spaceId: itemId,
		name: createSpaceRequest.name,
		createdAt: new Date().toISOString(),
		description: createSpaceRequest.description,
	})
}

export async function updateSpace(
	updateSpaceRequest: UpdateSpaceRequest,
	jwtToken: string
): Promise<UpdateSpaceRequest> {
	logger.info("updateSpace updateSpaceRequest: ", { updateSpaceRequest })

	const userId: string = parseUserId(jwtToken)
	logger.info("updateSpace userId:", { userId: userId })

	const updatedSpaceRequest = {
		...updateSpaceRequest,
		userId,
		updatedAt: new Date().toISOString(),
	}
	logger.info("updateSpace updatedSpaceRequest:", updatedSpaceRequest)

	return await spaceAccess.updateSpace(updatedSpaceRequest)
}

export async function deleteSpace(
	deleteSpaceRequest: DeleteSpaceRequest,
	jwtToken: string
): Promise<DeleteSpaceRequest> {
	logger.info("deleteSpace", deleteSpaceRequest)

	const spaceId = deleteSpaceRequest.spaceId
	const userId = parseUserId(jwtToken)
	logger.info("deleteSpace", userId)

	return await spaceAccess.deleteSpace({
		spaceId: spaceId,
		userId: userId,
	})
}

export async function deleteImages(
	deleteSpaceRequest: DeleteSpaceRequest,
	jwtToken: string
): Promise<DeleteSpaceRequest> {
	logger.info("deleteImages deleteSpaceRequest:", deleteSpaceRequest)

	const spaceId = deleteSpaceRequest.spaceId
	const userId = parseUserId(jwtToken)
	logger.info("deleteImages spaceId: ", spaceId)
	logger.info("deleteImages userId: ", userId)

	return await spaceAccess.deleteImages({
		spaceId: spaceId,
	})
}
