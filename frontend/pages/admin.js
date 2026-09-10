import React from 'react'

export default function AdminPage() {
  const [requests, setRequests] = React.useState([])

  React.useEffect(() => { fetchRequests() }, [])

  async function fetchRequests() {
    const r = await fetch('/api/requests')
    const data = await r.json()
    setRequests(data)
  }

  async function updateStatus(id, status) {
    await fetch('/api/requests', { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ id, status }) })
    fetchRequests()
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin - Requests</h1>
      <p>View and approve/deny roster change requests.</p>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Description</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.title}</td>
              <td>{r.description}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(r.id, 'approved')}>Approve</button>
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
