const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer token"

  if (!token) return res.status(401).json({ message: "Accès refusé, token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // on stocke les infos du user dans req.user
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;
