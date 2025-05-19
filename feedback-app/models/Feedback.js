const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    required: true
  },
  satisfaction: {
    type: String,
    enum: ["oui", "non"],
    required: true
  },
  dateAchat: {
    type: Date
  },
  dureeUtilisation: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
