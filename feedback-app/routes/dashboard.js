const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Feedback = require("../models/Feedback");
const { isAdmin } = require("../middlewares/auth");

router.get("/dashboard", isAdmin, async (req, res) => {
  const search = req.query.search || "";

  // Filtrer les produits par nom
  const productFilter = search
    ? { nom: { $regex: search, $options: "i" } }
    : {};

  // Filtrer les feedbacks selon le produit ou utilisateur (après peuplement)
  const [products, feedbacks, productCount, userCount, feedbackCount] = await Promise.all([
    Product.find(productFilter),
    Feedback.find().populate("user").populate("product"),
    Product.countDocuments(),
    require("../models/User").countDocuments(),
    Feedback.countDocuments()
  ]);

  // Filtrage manuel des feedbacks
  const filteredFeedbacks = feedbacks.filter(fb => {
    const productName = fb.product?.nom?.toLowerCase() || "";
    const userName = fb.user?.nom?.toLowerCase() || "";
    return productName.includes(search.toLowerCase()) || userName.includes(search.toLowerCase());
  });

  res.render("dashboard", {
    products,
    feedbacks: filteredFeedbacks,
    stats: {
      totalProduits: productCount,
      totalUtilisateurs: userCount,
      totalFeedbacks: feedbackCount
    },
    search
  });
});


// Voir tous les utilisateurs
router.get("/admin/users", isAdmin, async (req, res) => {
  const users = await User.find();
  res.render("admin/users", { users });
});

// Supprimer un utilisateur
router.post("/admin/users/delete/:id", isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Feedback.deleteMany({ user: req.params.id }); // supprimer ses feedbacks
  res.redirect("/admin/users");
});

// Supprimer un feedback
router.post("/admin/feedbacks/delete/:id", isAdmin, async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

module.exports = router;
