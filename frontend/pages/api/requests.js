import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'data', 'requests.json')
function read() { try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { return [] } }
function write(arr) { fs.writeFileSync(file, JSON.stringify(arr, null, 2)) }

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    const adminEmail = process.env.ADMIN_EMAIL
    const all = read()
    if (session && session.user && session.user.email === adminEmail) {
      return res.status(200).json(all)
    }
    // else return only user requests
    if (session && session.user) {
      return res.status(200).json(all.filter(r => r.userEmail === session.user.email))
    }
    return res.status(200).json([])
  }

  if (req.method === 'POST') {
    if (!session || !session.user) return res.status(401).json({ error: 'Not authenticated' })
    const { title, description } = req.body
    const arr = read()
    const id = (arr.length ? arr[arr.length-1].id : 0) + 1
    const item = { id, title, description, status: 'pending', created_at: new Date().toISOString(), userEmail: session.user.email }
    arr.push(item)
    write(arr)
    return res.status(201).json(item)
  }

  if (req.method === 'PATCH') {
    if (!session || !session.user) return res.status(401).json({ error: 'Not authenticated' })
    const { id, status } = req.body
    const adminEmail = process.env.ADMIN_EMAIL
    if (session.user.email !== adminEmail) return res.status(403).json({ error: 'Only admin may modify status' })
    const arr = read()
    const idx = arr.findIndex(i => i.id === id)
    if (idx === -1) return res.status(404).json({ error: 'not found' })
    arr[idx].status = status
    write(arr)
    return res.status(200).json(arr[idx])
  }

  res.status(405).json({ error: 'Method not allowed' })
}
