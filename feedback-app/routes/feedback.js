const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Feedback = require("../models/Feedback");

// Page d'accueil avec produits
router.get("/home", async (req, res) => {
  try {
    const produits = await Product.find();
    res.render("home", {
      produits,
      user: req.session.user || null // Passe l'utilisateur connecté ou null
    });
  } catch (err) {
    console.error(err);
    res.render("home", { produits: [], user: null });
  }
});

// Ajout d'un feedback
router.post("/feedback", async (req, res) => {
  const { userId, productId, note, commentaire } = req.body;

  if (!userId) {
    return res.status(401).send("Vous devez être connecté");
  }

  try {
    await Feedback.create({
      note,
      commentaire,
      user: userId,
      product: productId
    });
    res.redirect(`/products/${productId}`);
  } catch (err) {
    res.status(500).send("Erreur: " + err.message);
  }
});

module.exports = router;