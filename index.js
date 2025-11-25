import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in .env file')
    process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const messages = [
    {
        role: 'system',
        content: 'You are a trading expert/guru and you will give the advice as per the requested query and fetching the records and data from recent events and history. Not more than 100 words.'
    },
    {
        role: 'user',
        content: 'Should i buy or sell reliance and apple shares?'
    }
]

// Convert messages to Gemini format
const prompt = messages
    .map(msg => `${msg.role === 'system' ? 'System: ' : 'User: '}${msg.content}`)
    .join('\n\n')

const result = await model.generateContent(prompt)
// console.log(result)
const response = result.response
console.log(response.text())