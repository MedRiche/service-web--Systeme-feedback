const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Page d'inscription
router.get("/register", (req, res) => {
  res.render("register");
});

// Inscription POST
router.post("/register", async (req, res) => {
  const { nom, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({ nom, email, password: hashedPassword ,  role: "user"  });
    res.redirect("/login");
  } catch (err) {
    res.send("Erreur : " + err.message);
  }
});

// Page de connexion
router.get("/login", (req, res) => {
  res.render("login");
});

// Connexion POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.send("Utilisateur non trouvé");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Mot de passe incorrect");

  // Rediriger vers la page d'accueil
 req.session.user = user;

if (user.role === "admin") {
  res.redirect("/dashboard");
} else {
  res.redirect("/products");
} // À faire ensuite
});

module.exports = router;
