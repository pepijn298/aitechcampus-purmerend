import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'

const tokensFile = path.join(process.cwd(), 'data', 'tokens.json')
function readTokens() { try { return JSON.parse(fs.readFileSync(tokensFile, 'utf8')) } catch (e) { return {tokens:{}} } }

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const email = session.user.email
  const tokens = readTokens().tokens || {}
  const userTokens = tokens[email]
  if (!userTokens) return res.status(400).json({ error: 'No Google tokens available for this user. Connect your Google account first.' })

  try {
    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
    oAuth2Client.setCredentials({ access_token: userTokens.access_token, refresh_token: userTokens.refresh_token })
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    const resp = await calendar.events.list({ calendarId: 'primary', timeMin: (new Date()).toISOString(), maxResults: 10, singleEvents: true, orderBy: 'startTime' })
    res.status(200).json({ events: resp.data.items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Calendar access failed' })
  }
}
