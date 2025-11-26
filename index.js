// gemini-motivational-bot.js
// Fully replaces your OpenAI fine-tuned GPT-3.5-turbo with Gemini 1.5 Flash/Pro
// 100% free, instant, no training needed

import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

// Load your API key (from .env or import.meta.env.VITE_GEMINI_API_KEY in Vite)
const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY

if (!apiKey) {
    console.error('Error: GEMINI_API_KEY is not set.')
    console.error('Please create a .env file in the project root with: GEMINI_API_KEY=your_api_key_here')
    console.error('Or set it as an environment variable: export GEMINI_API_KEY=your_api_key_here')
    process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

async function getMotivationalResponse(userMessage) {
  // This is the "fine-tuned" behavior — we inject all your training examples!
  const trainingExamples = `
### MOTIVATIONAL BOT TRAINING EXAMPLES (You must respond exactly like this) ###

User: I'm feeling so down today.
Bot: You can do it, champ! You got this! I just know you are going to feel 100% better as soon as you get out and get going.

User: I'm sure I'm going to fail.
Bot: Fail? No way! You're going to smash this! Just relax into the thoughts and let them subside. Then get back to work and focus.

User: Why do I feel so unmotivated?
Bot: Hey we all do sometimes. But guess what? It's easier to keep doing something than to start doing something. So just take the first baby step and you'll be fine.

User: I feel like giving up.
Bot: Giving up means you'll never know how close you were to success. Take a break, recharge, but don't give up. You're capable of achieving so much more than you think.

User: I'm scared of failing.
Bot: Fear of failure is a sign you're about to do something incredibly brave. Failure isn't the opposite of success; it's part of it. Go for it, and remember, I'm here cheering you on!

User: I don't feel good enough.
Bot: You are more than good enough. Every experience you've had has prepared you for this moment. Believe in yourself as much as I believe in you. You're going to do great things.

### END OF EXAMPLES — ALWAYS respond with this same energy, tone, and encouragement! ###
`.trim()

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // Updated to use valid model name
    // All your favorite OpenAI-style controls:
    temperature: 1.1,           // Creative & energetic (just like your fine-tuned bot)
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 200,
    
    // Structured JSON output (like OpenAI response_format)
    // Uncomment if you want clean JSON:
    // responseMimeType: "application/json",
    // generationConfig: {
    //   responseSchema: {
    //   type: "object",
    //   properties: {
    //     advice: { type: "string" },
    //     emoji: { type: "string" }
    //   },
    //   required: ["advice"]
    // }
    // },

    // Stop sequences (Gemini supports them!
    stopSequences: ["User:", "###", "Bot:"]
  })

  const prompt = `
${trainingExamples}

You are a super motivational bot. Always be positive, encouraging, energetic, and supportive.
Use exclamation marks, friendly language, and make people feel amazing!

Now respond to this user:

User: ${userMessage}
Bot:`.trim()

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean up if it accidentally continues
    return text
      .split('\n')[0]
      .trim()
      .replace(/Bot:\s*/i, '')
      .trim()

  } catch (error) {
    console.error("Gemini Error:", error)
    return "You've got this! Keep going strong!"
  }
}

// ————————————————————————
// TEST IT (just like your OpenAI version)
// ————————————————————————
const tests = [
  "I don't know what to do with my life",
  "I'm feeling so down today",
  "I keep procrastinating everything",
  "I'm scared I'll never be successful"
]

for (const msg of tests) {
  console.log(`User: ${msg}`)
  console.log(`Bot: ${await getMotivationalResponse(msg)}`)
  console.log('—'.repeat(50))
}



// import { GoogleGenerativeAI } from '@google/generative-ai'
// import 'dotenv/config'

// if (!process.env.GEMINI_API_KEY) {
//     console.error('Error: GEMINI_API_KEY is not set in .env file')
//     process.exit(1)
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
// // const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', temperature: 1.1, topP: 0.95, topK: 40, maxOutputTokens: 100, candidateCount: 1, responseMimeType: 'text/plain', stopSequences: ['3.'], stopWords: ['3.'], responseSchema: { type: 'object', properties: { advice: { type: 'string' } } }, stop: ['3.'] })
// const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', temperature: 1.1})

// // const messages = [
// //     {
// //         role: 'system',
// //         content: 'You are a trading expert/guru and you will give the advice as per the requested query and fetching the records and data from recent events and history. Not more than 100 words.'
// //     },
// //     {
// //         role: 'user',
// //         content: 'Should i buy or sell reliance and apple shares?'
// //     }
// // ]

// // Convert messages to Gemini format

// // const messages = [
// //     {
// //         role: 'system',
// //         content: `You are a robotic doorman for an expensive hotel. When a customer greets you, respond to them politely. Use examples provided between ### to set the style and tone of your response.`
// //     },
// //     {
// //         role: 'user',
// //         content: `Good day!
// //         ###
// //         Good evening kind Sir. I do hope you are having the most tremendous day and looking forward to an evening of indulgence in our most delightful of restaurants.
// //         ###     
        
// //         ###
// //         Good morning Madam. I do hope you have the most fabulous stay with us here at our hotel. Do let me know how I can be of assistance.
// //         ###   
        
// //         ###
// //         Good day ladies and gentleman. And isn't it a glorious day? I do hope you have a splendid day enjoying our hospitality.
// //         ### `
// //     }
// // ]

// const messages = [
//     {
//         role: 'system',
//         content: 'You are a helpful assistant that knows a lot about books.'
//     },
//     {
//         role: 'user',
//         content: 'Recommend me some books about learning to code.'
//     }
// ]


// const prompt = messages
//     .map(msg => `${msg.role === 'system' ? 'System: ' : 'User: '}${msg.content}`)
//     .join('\n\n')

// const result = await model.generateContent(prompt)
// // console.log(result)
// const response = result.response
// console.log(response.text())





// import { dates } from '/utils/dates'
// import OpenAI from "openai"

// const tickersArr = []

// const generateReportBtn = document.querySelector('.generate-report-btn')

// generateReportBtn.addEventListener('click', fetchStockData)

// document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
//     e.preventDefault()
//     const tickerInput = document.getElementById('ticker-input')
//     if (tickerInput.value.length > 2) {
//         generateReportBtn.disabled = false
//         const newTickerStr = tickerInput.value
//         tickersArr.push(newTickerStr.toUpperCase())
//         tickerInput.value = ''
//         renderTickers()
//     } else {
//         const label = document.getElementsByTagName('label')[0]
//         label.style.color = 'red'
//         label.textContent = 'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.'
//     } 
// })

// function renderTickers() {
//     const tickersDiv = document.querySelector('.ticker-choice-display')
//     tickersDiv.innerHTML = ''
//     tickersArr.forEach((ticker) => {
//         const newTickerSpan = document.createElement('span')
//         newTickerSpan.textContent = ticker
//         newTickerSpan.classList.add('ticker')
//         tickersDiv.appendChild(newTickerSpan)
//     })
// }

// const loadingArea = document.querySelector('.loading-panel')
// const apiMessage = document.getElementById('api-message')

// async function fetchStockData() {
//     document.querySelector('.action-panel').style.display = 'none'
//     loadingArea.style.display = 'flex'
//     try {
//         const stockData = await Promise.all(tickersArr.map(async (ticker) => {
//             const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`
//             const response = await fetch(url)
//             const data = await response.text()
//             const status = await response.status
//             if (status === 200) {
//                 apiMessage.innerText = 'Creating report...'
//                 return data
//             } else {
//                 loadingArea.innerText = 'There was an error fetching stock data.'
//             }
//         }))
//         fetchReport(stockData.join(''))
//     } catch (err) {
//         loadingArea.innerText = 'There was an error fetching stock data.'
//         console.error('error: ', err)
//     }
// }

// async function fetchReport(data) {
//     const messages = [
//         {
//             role: 'system',
//             content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.'
//         },
//         {
//             role: 'user',
//             content: `${data}
//             ###
//             OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
//             ###
//             Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
//             ###
//             `
//         }
//     ]

//     try {
//         const openai = new OpenAI({
//             dangerouslyAllowBrowser: true
//         })
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: messages,
//             temperature: 1.1,
//             presence_penalty: 0,
//             frequency_penalty: 0
//         })
//         renderReport(response.choices[0].message.content)

//     } catch (err) {
//         console.log('Error:', err)
//         loadingArea.innerText = 'Unable to access AI. Please refresh and try again'
//     }
// }

// function renderReport(output) {
//     loadingArea.style.display = 'none'
//     const outputArea = document.querySelector('.output-panel')
//     const report = document.createElement('p')
//     outputArea.appendChild(report)
//     report.textContent = output
//     outputArea.style.display = 'flex'
// }
