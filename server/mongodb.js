import mongoose from "mongoose";
import bcrypt from "bcryptjs";

mongoose
  .connect("mongodb+srv://KobiManuel:doorknob91@cluster0.iabidqb.mongodb.net/")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const InterviewSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    unique: true,
  },
  interviewQuestions: {
    type: [String],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

LoginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", LoginSchema);
const Interview = mongoose.model("Interview", InterviewSchema);

export { User, Interview };
