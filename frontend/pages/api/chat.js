export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { messages } = req.body
  if (!messages) return res.status(400).json({ error: 'Missing messages' })

  // If no API key provided, return a mock response for demo
  if (!OPENAI_API_KEY) {
    return res.status(200).json({ choices: [{ message: { role: 'assistant', content: 'Dit is een demo-respons (geen API key ingesteld).' } }] })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages })
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'OpenAI request failed' })
  }
}
