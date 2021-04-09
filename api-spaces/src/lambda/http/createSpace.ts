import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateSpaceRequest } from '../../requests/CreateSpaceRequest'
import { createSpace } from '../../businessLogic/spaces'

import { createLogger } from '../../utils/logger'

const logger = createLogger('http/createSpace')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   logger.info('handler event', event)  
  const newSpace: CreateSpaceRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  logger.info('handler', newSpace)  

  const split = authorization.split(' ')
  const jwtToken = split[1]
  logger.info('handler', jwtToken)  


  const newItem = await createSpace(newSpace, jwtToken)


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
