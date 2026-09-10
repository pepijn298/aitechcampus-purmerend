import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'

const tokensFile = path.join(process.cwd(), 'data', 'tokens.json')
const requestsFile = path.join(process.cwd(), 'data', 'requests.json')
function readTokens() { try { return JSON.parse(fs.readFileSync(tokensFile, 'utf8')) } catch (e) { return {tokens:{}} } }
function readRequests() { try { return JSON.parse(fs.readFileSync(requestsFile, 'utf8')) } catch (e) { return [] } }
function writeRequests(arr) { fs.writeFileSync(requestsFile, JSON.stringify(arr, null, 2)) }

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Missing id' })

  const adminEmail = process.env.ADMIN_EMAIL
  if (session.user.email !== adminEmail) return res.status(403).json({ error: 'Only admin may approve requests' })

  const requests = readRequests()
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) return res.status(404).json({ error: 'request not found' })

  const reqItem = requests[idx]
  reqItem.status = 'approved'
  writeRequests(requests)

  // Try to create event in requester's calendar if tokens exist
  const tokens = readTokens().tokens || {}
  const userTokens = tokens[reqItem.userEmail]
  if (!userTokens) {
    return res.status(200).json({ message: 'Approved. Requester has no connected Google account; no calendar event created.' })
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
    oAuth2Client.setCredentials({ access_token: userTokens.access_token, refresh_token: userTokens.refresh_token })
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

    // Create a simple event from the request
    const event = {
      summary: reqItem.title,
      description: reqItem.description,
      start: { dateTime: new Date().toISOString(), timeZone: 'Europe/Amsterdam' },
      end: { dateTime: new Date(Date.now() + 60*60*1000).toISOString(), timeZone: 'Europe/Amsterdam' }
    }
    await calendar.events.insert({ calendarId: 'primary', requestBody: event })
    return res.status(200).json({ message: 'Approved and event created in requester calendar.' })
  } catch (e) {
    console.error('Failed to create calendar event', e)
    return res.status(200).json({ message: 'Approved but failed to create calendar event. See server logs.' })
  }
}
