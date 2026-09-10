import React from 'react'
import ChatWidget from '../components/ChatWidget'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 24 }}>
      <header>
        <h1>AI Tech Campus Purmerend</h1>
        <p>Prototype site with a chat assistant and simple roster change requests.</p>
        <nav>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <main style={{ marginTop: 24 }}>
        <section>
          <h2>Chat with the campus assistant</h2>
          <ChatWidget />
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>Request a roster change</h2>
          <p>Ask the assistant to propose a roster change or use the form below to save a change request.</p>
          <form id="request-form" onSubmit={async (e) => {
            e.preventDefault();
            const title = e.target.title.value;
            const description = e.target.description.value;
            await fetch('/api/requests', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, description })
            });
            alert('Request submitted');
            e.target.reset();
          }}>
            <div>
              <label>Title<br />
                <input name="title" required style={{ width: 400 }} />
              </label>
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Description<br />
                <textarea name="description" rows={4} style={{ width: 600 }} />
              </label>
            </div>
            <div style={{ marginTop: 8 }}>
              <button type="submit">Submit Request</button>
            </div>
          </form>
        </section>
      </main>

      <footer style={{ marginTop: 48, borderTop: '1px solid #eee', paddingTop: 12 }}>
        <small>Prototype — do not use in production without security review.</small>
      </footer>
    </div>
  )
}
