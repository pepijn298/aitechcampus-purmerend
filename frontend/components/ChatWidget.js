import React, { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'

export default function ChatWidget() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'Je bent een campus-assistent.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  async function send() {
    if (!input) return
    const newMsgs = [...messages, { role: 'user', content: input }]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)

    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMsgs })
    })
    const data = await resp.json()
    let assistantMsg = { role: 'assistant', content: 'No response' }
    try {
      assistantMsg = data.choices?.[0]?.message || assistantMsg
    } catch (e) {}
    setMessages(prev => [...prev, assistantMsg])
    setLoading(false)
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, width: 600 }}>
      <div style={{ height: 220, overflow: 'auto', background: '#fafafa', padding: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}><strong>{m.role}:</strong> {m.content}</div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ width: '80%' }} />
        <button onClick={send} disabled={loading} style={{ marginLeft: 8 }}>{loading ? '...' : 'Send'}</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {session ? (
          <div>Signed in as {session.user.email}</div>
        ) : (
          <div>
            <button onClick={() => signIn()}>Sign in</button>
            <small style={{ display: 'block', marginTop: 8 }}>Sign in with Google to allow calendar integration.</small>
          </div>
        )}
      </div>
    </div>
  )
}
