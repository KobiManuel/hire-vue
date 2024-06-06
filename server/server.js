import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import { User, Interview } from "./mongodb.js";
import authMiddleware from "./middleware/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const secretKey = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
};

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email is already in use" });
    }

    // Insert new user
    const user = new User({ email, password });
    await user.save();

    const token = generateToken(user);

    res.status(200).send({ token, message: "Sign up successful" });
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

    const user = await User.findOne({ email });

    // Handle case where user is not found
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords

    // Validate password
    if (isMatch) {
      const token = generateToken(user);
      // If everything is fine, send success response
      res.status(200).send({ token, message: "Login successful" });
    } else {
      return res.status(401).send({ message: "Incorrect password" });
    }
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

app.post(
  "/interview-questions/:organizationName",
  authMiddleware,
  async (req, res) => {
    try {
      const { organizationName, interviewQuestions } = req.body;

      const userId = req.userId;

      if (!organizationName || !interviewQuestions) {
        return res.status(400).send({
          message: "Organization name and interview questions are required",
        });
      }

      // Check if interview questions already exist for the organization
      const existingInterview = await Interview.findOne({
        organizationName,
        userId,
      });

      if (existingInterview) {
        return res.status(409).send({
          message: "Organization name already exists for this user",
        });
      } else {
        // Create a new entry for interview questions
        const newInterview = new Interview({
          organizationName,
          interviewQuestions,
          userId,
        });
        await newInterview.save();
        return res
          .status(200)
          .send({ message: "Interview questions saved successfully" });
      }
    } catch (error) {
      console.error("Error saving interview questions:", error);
      res.status(500).send({
        message: "An error occurred while saving interview questions",
      });
    }
  }
);

app.put(
  "/interview-questions/:organizationName",
  authMiddleware,
  async (req, res) => {
    try {
      const { organizationName } = req.params;
      const { interviewQuestions } = req.body;
      const userId = req.userId;

      if (!interviewQuestions) {
        return res.status(400).send({
          message: "Interview questions are required",
        });
      }

      // Check if the interview entry exists
      const existingInterview = await Interview.findOne({
        organizationName,
        userId,
      });

      if (!existingInterview) {
        return res.status(404).send({
          message: "Organization name not found for this user",
        });
      }

      // Update the existing interview questions
      existingInterview.interviewQuestions = interviewQuestions;
      await existingInterview.save();
      return res
        .status(200)
        .send({ message: "Interview questions updated successfully" });
    } catch (error) {
      console.error("Error updating interview questions:", error);
      res.status(500).send({
        message: "An error occurred while updating interview questions",
      });
    }
  }
);

app.get(
  "/interview-questions/:organizationName",
  authMiddleware,
  async (req, res) => {
    try {
      const { organizationName } = req.params;
      const userId = req.userId;

      const interview = await Interview.findOne({ organizationName, userId });

      if (!interview) {
        return res.status(404).send({
          message:
            "Interview questions not found for the specified organization",
        });
      }

      res.status(200).send({
        organizationName: interview.organizationName,
        interviewQuestions: interview.interviewQuestions,
      });
    } catch (error) {
      console.error("Error fetching interview questions:", error);
      res.status(500).send({
        message: "An error occurred while fetching interview questions",
      });
    }
  }
);

app.get("/validateLink/:organizationName", async (req, res) => {
  try {
    const { organizationName } = req.params;

    const interview = await Interview.findOne({ organizationName });

    if (!interview) {
      return res.status(404).send({
        message: "Interview questions not found for the specified organization",
      });
    }

    res.status(200).send({
      message: "request successful",
    });
  } catch (error) {
    console.error("Error validating link:", error);
    res.status(500).send({
      message: "An error occurred while validating link",
    });
  }
});

// const conversationHistory = [
//   {
//     role: "system",
//     content: `You are conducting an interview. You will ask a total of ${interviewQuestions.length} questions and nothing more, DO NOT REPEAT QUESTIONS. The questions are: ${interviewQuestions}. Once all questions on the list have been asked, you should respond with: "Thank you, this interview is now concluded." from that moment on`,
//   },
//   { role: "assistant", content: "follow the instructions" },
// ];

app.post("/", async (req, res) => {
  try {
    const { prompt, organizationName } = req.body;

    // Fetch interview questions from the database
    const interview = await Interview.findOne({ organizationName });

    if (!interview) {
      return res.status(404).send({
        message: "Interview questions not found for the specified organization",
      });
    }

    const interviewQuestions = interview.interviewQuestions;

    const conversationHistory = [
      {
        role: "system",
        content: `You are conducting an interview. You will ask a total of ${interviewQuestions.length} questions and nothing more, DO NOT REPEAT QUESTIONS. The questions are: ${interviewQuestions}. Once all questions on the list have been asked, you should respond with: "Thank you, this interview is now concluded." from that moment on`,
      },
      { role: "assistant", content: "follow the instructions" },
    ];

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
