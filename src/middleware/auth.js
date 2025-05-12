const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role"],
    });
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// 🔐 Authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Access role does not exist 🙅🏻‍♀️" });
    }
    next();
  };
};

exports.checkToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This enables req.user.id in getMe
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
