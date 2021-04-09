import Axios from "axios"

import { apiEndpoint } from "../config"
import { Space } from "../types/Space"
import { CreateSpaceRequest } from "../types/CreateSpaceRequest"
import { UpdateSpaceRequest } from "../types/UpdateSpaceRequest"

export async function getSpaces(idToken: string): Promise<Space[]> {
	console.log("spaces-api getSpaces Fetching spaces apiEndpoint: ", apiEndpoint)
	console.log("spaces-api getSpaces Fetching spaces idToken: ", idToken)

	const response = await Axios.get(`${apiEndpoint}/spaces`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`,
		},
	})
	console.log("spaces-api getSpaces response.data:", response.data)
	return response.data.spaces
}

export async function getSpace(
	spaceId: string,
	idToken: string
): Promise<Space[]> {
	console.log("spaces-api getSpace Fetching spaces spaceId: ", spaceId)
	console.log("spaces-api getSpace Fetching spaces idToken: ", idToken)

	const url: string = `${apiEndpoint}/spaces/${spaceId}`
	console.log("spaces-api getSpace Fetching spaces api url: ", url)

	const response = await Axios.get(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`,
		},
	})
	console.log("spaces-api getSpace response.data:", response.data)
	return response.data.spaces
}

export async function getImages(
	idToken: string,
	spaceId: string
): Promise<Space[]> {
	console.log("spaces-api getImages Fetching spaces spaceId: ", spaceId)
	console.log("spaces-api getImages Fetching spaces idToken: ", idToken)

	const url: string = `${apiEndpoint}/spaces/${spaceId}/attachments`
	console.log("spaces-api getImages Fetching spaces api url: ", url)

	const response = await Axios.get(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`,
		},
	})
	console.log("spaces-api getImages response:", response)
	console.log("spaces-api getImages response.data:", response.data)
	return response.data
}

export async function createSpace(
	idToken: string,
	newSpace: CreateSpaceRequest
): Promise<Space> {
	let response: any
	console.log("createSpace apiEndpoint:", apiEndpoint)
	console.log("createSpace newSpace:", newSpace)
	console.log("createSpace idToken:", idToken)
	try {
		response = await Axios.post(
			`${apiEndpoint}/spaces`,
			JSON.stringify(newSpace),
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${idToken}`,
				},
			}
		)
	} catch (err) {
		console.log("createSpace err:", err)
	} finally {
		console.log("createSpace response:", response)
	}

	return response.data.newItem
}

export async function editSpace(
	idToken: string,
	newSpace: CreateSpaceRequest
): Promise<Space> {
	let response: any
	console.log("createSpace apiEndpoint:", apiEndpoint)
	console.log("createSpace newSpace:", newSpace)
	console.log("createSpace idToken:", idToken)
	try {
		response = await Axios.patch(
			`${apiEndpoint}/spaces`,
			JSON.stringify(newSpace),
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${idToken}`,
				},
			}
		)
	} catch (err) {
		console.log("createSpace err:", err)
	} finally {
		console.log("createSpace response:", response)
	}

	return response.data.newItem
}

export async function patchSpace(
	idToken: string,
	spaceId: string,
	updatedSpace: UpdateSpaceRequest
): Promise<void> {
	console.log("api/spaces-api patchSpace spaceId: ", spaceId)
	console.log("api/spaces-api patchSpace updatedSpace: ", updatedSpace)

	await Axios.patch(
		`${apiEndpoint}/spaces/${spaceId}`,
		JSON.stringify(updatedSpace),
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
		}
	)
}

export async function deleteSpace(
	idToken: string,
	spaceId: string
): Promise<void> {
	console.log("api/spaces-api deleteSpace spaceId: ", spaceId)
	console.log("api/spaces-api deleteSpace idToken: ", idToken)
	let response
	try {
		response = await Axios.delete(`${apiEndpoint}/spaces/${spaceId}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
		})
		console.log("spaces-api deleteSpace response: ", response)
	} catch (err) {
		console.log("spaces-api deleteSpace err: ", err)
	}
	return
}

export async function getUploadUrl(
	idToken: string,
	spaceId: string
): Promise<string> {
	console.log("api/spaces-api/getUploadUrl idToken: ", idToken)
	console.log("api/spaces-api/getUploadUrl spaceId: ", spaceId)
	const response = await Axios.post(
		`${apiEndpoint}/spaces/${spaceId}/attachment`,
		"",
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
		}
	)
	console.log(
		"api/spaces-api/getUploadUrl response.data.uploadUrl: ",
		response.data.uploadUrl
	)
	console.log("api/spaces-api/getUploadUrl response: ", response)
	return response.data.uploadUrl
}

export async function uploadFile(
	uploadUrl: string,
	file: Buffer
): Promise<void> {
	console.log("api/spaces-api/getUploadUrl uploadUrl: ", uploadUrl)
	console.log("api/spaces-api/getUploadUrl file: ", file)
	await Axios.put(uploadUrl, file)
}
