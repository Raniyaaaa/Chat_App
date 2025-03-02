const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};
