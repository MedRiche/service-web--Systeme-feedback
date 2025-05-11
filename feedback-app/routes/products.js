const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Feedback = require("../models/Feedback");
const upload = require("../middlewares/upload");
const { isAdmin } = require("../middlewares/auth");

// Afficher tous les produits
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const selectedCategorie = req.query.categorie || "";
  const sortOption = req.query.sort || ""; // prixAsc, prixDesc

  const query = selectedCategorie ? { categorie: selectedCategorie } : {};

  const sort = {};
  if (sortOption === "prixAsc") sort.prix = 1;
  if (sortOption === "prixDesc") sort.prix = -1;

  const totalProduits = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProduits / limit);

  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const categories = await Product.distinct("categorie");

  res.render("products/list", {
    products,
    currentPage: page,
    totalPages,
    selectedCategorie,
    categories,
    selectedSort: sortOption
  });
});


// Formulaire d'ajout
router.get("/new", (req, res) => {
  res.render("products/new");
});

// Ajouter un produit
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { nom, description, prix, categorie, stock } = req.body;
    
    const newProduct = new Product({
      nom,
      description,
      prix,
      categorie,
      stock,
      imageUrl: "/uploads/" + req.file.filename
    });

    await newProduct.save();
    res.redirect("/products");
  } catch (err) {
    res.status(400).render("products/new", { error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const feedbacks = await Feedback.find({ product: product._id }).populate("user");
  res.render("products/show", { product, feedbacks });
});


router.get("/new", isAdmin, (req, res) => {
  res.render("products/new");
});

router.post("/", isAdmin, upload.single("image"), async (req, res) => {
  // ajout produit
});


router.get("/edit/:id", isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Produit non trouvé");
  res.render("products/edit", { product });
});

router.post("/edit/:id", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { nom, description, prix, categorie, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Produit non trouvé");

    product.nom = nom;
    product.description = description;
    product.prix = prix;
    product.categorie = categorie;
    product.stock = stock;

    if (req.file) {
      product.imageUrl = "/uploads/" + req.file.filename;
    }

    await product.save();
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).send("Erreur : " + err.message);
  }
});

router.post("/delete/:id", isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).send("Erreur suppression : " + err.message);
  }
});


module.exports = router;