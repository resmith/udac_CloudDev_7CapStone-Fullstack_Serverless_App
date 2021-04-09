import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
// import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { createLogger } from '../../utils/logger'

// JWT token signature from Auth0 page -> Endpoints -> JSON Web Key Set
const logger = createLogger('auth0Authorizer')


export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('handler event.authorizationToken:', event.authorizationToken)
  try {

    // const jwtToken = await verifyToken(event.authorizationToken,jwksUrl )
    const signingKey = process.env.AUTH0_PUBLIC_KEY;
    logger.info('handler signingKey: ', signingKey)

    const jwtTokenPayload = await verifyToken(event.authorizationToken, signingKey)
    logger.info('handler b4 return jwtTokenPayload: ', jwtTokenPayload)

    return {
      principalId: jwtTokenPayload.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}


function getToken(authHeader: string): string {
  logger.info("getToken authHeader:", { authHeader });

  if (!authHeader) {
    logger.info("getToken No authentication header ", {authHeader})
    throw new Error('getToken No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')){ 
    logger.info("getToken invalid autheader in bearer ", {authHeader})
    throw new Error('getToken Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]
  logger.info("getToken returning token:", {token})

  return token
}


async function verifyToken(authHeader: string, signingKey: string): Promise<JwtPayload> {
  logger.info("verifyToken authHeader", { authHeader } );

  const token = getToken(authHeader)
  logger.info("verifyToken token:", { token });

  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info("verifyToken", { jwt } );

  if (jwt.header.alg !== 'RS256') {
    throw new Error('verifyToken header.alg not RS256')
  }

  const jwtHeaderKid = jwt.header.kid
  logger.info("verifyToken jwtHeaderKid:", {jwtHeaderKid})

  // const signingKey: string = getSigningKey(jwksUrl, jwtHeaderKid)
  logger.info("verifyToken signingKey:", {signingKey})  

  const jwtPayload: JwtPayload = verify(token, signingKey) as JwtPayload;
  logger.info("verifyToken returning jwtPayload:", {jwtPayload})    

  return jwtPayload    

}


