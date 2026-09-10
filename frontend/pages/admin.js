import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function AdminPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = React.useState([])

  React.useEffect(() => { fetchRequests() }, [session])

  async function fetchRequests() {
    const r = await fetch('/api/requests')
    const data = await r.json()
    setRequests(data)
  }

  async function approveRequest(id) {
    const r = await fetch('/api/calendar/approve', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id }) })
    const data = await r.json()
    alert(data.message || 'Approved')
    fetchRequests()
  }

  async function updateStatus(id, status) {
    await fetch('/api/requests', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, status }) })
    fetchRequests()
  }

  if (!session) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Admin</h1>
        <p>Sign in to access admin features.</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Admin - Requests</h1>
        <div>
          <strong>{session.user.email}</strong>
          <button onClick={() => signOut()} style={{ marginLeft: 8 }}>Sign out</button>
        </div>
      </div>
      <p>View and approve/deny roster change requests.</p>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Description</th><th>User</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.title}</td>
              <td>{r.description}</td>
              <td>{r.userEmail}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'pending' && (
                  <>
                    <button onClick={() => approveRequest(r.id)}>Approve (create event)</button>
                    <button onClick={() => updateStatus(r.id, 'denied')}>Deny</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
