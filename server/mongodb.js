import mongoose from "mongoose";

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

const collection = mongoose.model("Collection1", LoginSchema);

export default collection;
