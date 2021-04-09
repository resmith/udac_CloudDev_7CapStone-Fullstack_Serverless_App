/**
 * Fields in a request to update a single SPACE item.
 */
export interface UpdateSpaceRequest {
	spaceId: string
	userId: string
	name: string
	description: string
}
