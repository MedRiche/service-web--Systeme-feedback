const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const Product = require("../models/Product");
const { isAdmin } = require("../middlewares/auth");

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
