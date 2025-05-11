const mongoose = require("mongoose");
const path = require("path");

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  categorie: { type: String },
  imageUrl: { type: String, required: true }, // Chemin de l'image
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);