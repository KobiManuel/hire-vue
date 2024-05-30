import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import collection from "./mongodb.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/signup", async (req, res) => {
  res.status(200).send({ message: "Sign up successful" });
});

app.get("/login", async (req, res) => {
  res.render("login ");
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    // Validate password strength (minimum 6 characters, at least one letter and one number)
    if (
      password.length < 6 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      return res.status(400).send({
        message:
          "Password must be at least 6 characters long and include at least one letter and one number",
      });
    }

    // Check for duplicate email
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email is already in use" });
    }

    // Insert new user
    const data = { email, password };
    await collection.insertMany([data]);

    res.status(200).send({ message: "Sign up successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({ message: "An error occurred while signing up" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure the email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await collection.findOne({ email });

    // Handle case where user is not found
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    // If everything is fine, send success response
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Login error:", error);

    // Send a generic error message
    res
      .status(500)
      .send({ message: "An error occurred while trying to log in" });
  }
});

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "I am HireVue. The best ever A.I Interviewer",
  });
});

let interviewQuestions = [];

app.post("/interview-questions", async (req, res) => {
  try {
    interviewQuestions = req.body.questions;
    console.log("this is", req.body.questions);
    res.status(200).send({ message: "Questions updated successfully" });
    console.log("questions", interviewQuestions);
  } catch (error) {
    console.error("Failed to update questions:", error);
    res.status(500).send({ error });
  }
});

const conversationHistory = [
  {
    role: "system",
    content: `You are conducting an interview. You will ask a total of ${interviewQuestions.length} questions and nothing more, DO NOT REPEAT QUESTIONS. The questions are: ${interviewQuestions}. Once all questions on the list have been asked, you should respond with: "Thank you, this interview is now concluded." from that moment on`,
  },
  { role: "assistant", content: "follow the instructions" },
];

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    conversationHistory.push({ role: "user", content: prompt });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationHistory, // Pass the entire history
      temperature: 0,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // Append assistant message to conversation history
    conversationHistory.push({
      role: "assistant",
      content: response.choices[0].message.content,
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
