function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  res.status(403).send("Accès refusé : réservé aux administrateurs.");
}

module.exports = { isAuthenticated, isAdmin };
