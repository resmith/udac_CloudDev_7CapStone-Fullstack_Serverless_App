import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
import { createLogger } from  "../utils/logger"

const logger = createLogger('backend/src/auth/utils')

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  logger.info("parseUserId : ", { jwtToken })

  const decodedJwt = decode(jwtToken) as JwtPayload
  logger.info("parseUserId: ", { decodedJwt })

  return decodedJwt.sub
}
