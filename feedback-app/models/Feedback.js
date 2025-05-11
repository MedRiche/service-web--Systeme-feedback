const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  note: { type: Number, required: true },
  commentaire: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
