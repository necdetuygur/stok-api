const jwt = require("jsonwebtoken");
const SECRET_KEY = "Nv3rySeCR@";

function authorize(roles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const decodedToken = jwt.verify(token, SECRET_KEY);

      if (roles.length && !roles.includes(decodedToken.role)) {
        return res.status(403).send("Forbidden");
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  };
}

module.exports = { jwt, SECRET_KEY, authorize };
