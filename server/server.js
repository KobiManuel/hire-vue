import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

let questions = [
  "Can you describe a challenging project you have worked on?",
  "How do you manage tight deadlines?",
  "What motivates you to work?",
];

// In-memory session storage
let sessions = {};

app.get("/", (req, res) => {
  res.status(200).send({
    message: "I am HireVue. The best ever A.I Interviewer",
  });
});

// Start an interview session
app.post("/interview/start", (req, res) => {
  const sessionId = Date.now().toString(); // Simple unique session ID
  sessions[sessionId] = { index: 0, responses: [] }; // Initialize session

  res.json({ message: "Interview started.", sessionId: sessionId });
});

// Handle responses and manage interview flow
app.post("/interview/response", async (req, res) => {
  const { sessionId, userResponse } = req.body;

  if (!sessions[sessionId]) {
    return res.status(404).json({ message: "Session not found." });
  }

  let session = sessions[sessionId];
  let currentQuestion = questions[session.index];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are conducting an interview." },
      { role: "user", content: userResponse },
    ],
    temperature: 0.5,
    max_tokens: 150,
  });

  // Check for continuation or follow-up logic here
  session.responses.push({
    question: currentQuestion,
    answer: response.choices[0].message.content,
  });

  if (session.index < questions.length - 1) {
    session.index += 1;
    currentQuestion = questions[session.index];
    res.json({
      question: currentQuestion,
      assistantResponse: response.choices[0].message.content,
    });
  } else {
    delete sessions[sessionId]; // Clean up session
    res.json({ message: "Interview completed.", responses: session.responses });
  }
});

app.listen(5000, () =>
  console.log("Server is running on http://localhost:5000")
);
