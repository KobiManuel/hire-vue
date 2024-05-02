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

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "I am HireVue. The best ever A.I Interviewer",
  });
});

// Track the interview stage (initial greeting or question)
let interviewStage = "greeting";

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    let assistantContent;

    // Define assistant content based on interview stage
    if (interviewStage === "greeting") {
      assistantContent = "Hello! Are you ready to start your interview?";
      interviewStage = "question1"; // Update stage after greeting
    } else if (interviewStage === "question1") {
      assistantContent =
        "Can you tell me a bit about yourself and your background?";
      interviewStage = "answer1"; // Update stage after question 1
    } else if (interviewStage === "answer1") {
      // Capture user answer here (not implemented in this example)
      assistantContent =
        "Thank you for your answer. Now, why are you interested in this position?";
      interviewStage = "question2"; // Update stage after answer 1
    } else if (interviewStage === "question2") {
      assistantContent = "Why are you interested in this position?";
      interviewStage = "answer2"; // Update stage after question 2
    } else if (interviewStage === "answer2") {
      // Capture user answer here (not implemented in this example)
      assistantContent =
        "Great! Finally, describe a time you faced a challenge and how you overcame it.";
      interviewStage = "question3"; // Update stage after answer 2
    } else if (interviewStage === "question3") {
      assistantContent =
        "Describe a time you faced a challenge and how you overcame it.";
      interviewStage = "answer3"; // Update stage after question 3
    } else if (interviewStage === "answer3") {
      // Capture user answer here (not implemented in this example)
      assistantContent =
        "Thank you for your time. The interview is now concluded.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are conducting an interview, you will ask just 4 questions and the questions are : Hello! Are you ready to start your interview?"
  "Can you tell me a bit about yourself and your background?"
  "Why are you interested in this position?"
  "Describe a time you faced a challenge and how you overcame it.`,
        },
        { role: "assistant", content: assistantContent },
        { role: "user", content: prompt }, // User response (greeting or answer)
      ],
      temperature: 0,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("server is running on port http://localhost:5000")
);
