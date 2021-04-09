import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateSpaceRequest } from '../../requests/UpdateSpaceRequest'
import { updateSpace } from '../../businessLogic/spaces'

import {createLogger} from '../../utils/logger'
const logger = createLogger('lambda/http/spacesAccess')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const eventBody: UpdateSpaceRequest = JSON.parse(event.body)
  const spaceId: object = { spaceId: event.pathParameters.spaceId}
  const updatedSpace: UpdateSpaceRequest = { ...eventBody, ...spaceId}
  logger.info('handler updatedSpace',  { updatedSpace } )

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await updateSpace(updatedSpace, jwtToken)
  logger.info('handler newItem: ',   { newItem } )  

  // SPACE: Update a SPACE item with the provided id using values in the "updatedSpace" object
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
