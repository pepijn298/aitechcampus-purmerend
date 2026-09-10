import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export async function getSessionFromReq(req, res) {
  return await getServerSession(req, res, authOptions)
}
