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
// Ajout d'un feedback
router.post("/feedback", async (req, res) => {
  const {
    userId,
    productId,
    note,
    commentaire,
    satisfaction,
    dateAchat,
    dureeUtilisation
  } = req.body;

  try {
    const feedback = await Feedback.create({
      user: userId,
      product: productId,
      note,
      commentaire,
      satisfaction,
      dateAchat: dateAchat || null,
      dureeUtilisation
    });

    // Redirection vers page de remerciement
    res.redirect(`/feedback/${feedback._id}/confirmation`);
  } catch (err) {
    res.status(500).send("Erreur lors de l'ajout du feedback : " + err.message);
  }
});

router.get("/feedback/:id/confirmation", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("user", "nom")
      .populate("product", "nom imageUrl");

    if (!feedback) return res.status(404).send("Feedback introuvable");

    res.render("feedback/confirmation", { feedback });
  } catch (err) {
    res.status(500).send("Erreur d'affichage : " + err.message);
  }
});







module.exports = router;