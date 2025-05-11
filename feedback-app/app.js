const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback");
const productsRouter = require("./routes/products");
const dashboardRoutes = require("./routes/dashboard");
const { isAdmin } = require("./middlewares/auth");
const adminRoutes = require("./routes/dashboard");

// Initialisation de l'application
const app = express();

// Configuration des middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuration des vues
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuration des sessions
app.use(session({
  secret: process.env.JWT_SECRET || "votre_secret_fallback",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // 14 jours
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 14 // 14 jours
  }
}));

// Middleware pour rendre l'utilisateur accessible dans les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  delete req.session.success;
  delete req.session.error;
  next();
});



// Routes principales
app.use("/", feedbackRoutes);
app.use("/", authRoutes);
app.use("/products", productsRouter);
app.use("/", dashboardRoutes);
app.use("/", adminRoutes);




// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connecté à la base de données MongoDB");
    // Démarrer le serveur seulement après la connexion DB
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch(err => {
    console.error("Erreur de connexion à MongoDB:", err.message);
    process.exit(1);
  });