const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_KEY
});

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ 
      message: "Root Cause Power API is running!", 
      status: "connected" 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a compassionate wellness coach specializing in trauma-informed care and lifestyle medicine. Provide supportive, professional responses focused on healing and wellbeing."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm here to support you.";
    
    return res.json({ 
      response: aiResponse,
      status: "success"
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get AI response',
      status: "error"
    });
  }
};
