import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'data', 'requests.json')

function read() {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { return [] }
}

function write(arr) { fs.writeFileSync(file, JSON.stringify(arr, null, 2)) }

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(read())
  }

  if (req.method === 'POST') {
    const { title, description } = req.body
    const arr = read()
    const id = (arr.length ? arr[arr.length-1].id : 0) + 1
    const item = { id, title, description, status: 'pending', created_at: new Date().toISOString() }
    arr.push(item)
    write(arr)
    return res.status(201).json(item)
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body
    const arr = read()
    const idx = arr.findIndex(i => i.id === id)
    if (idx === -1) return res.status(404).json({ error: 'not found' })
    arr[idx].status = status
    write(arr)
    return res.status(200).json(arr[idx])
  }

  res.status(405).json({ error: 'Method not allowed' })
}
