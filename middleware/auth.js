const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  //check if request header has a jwt token
  const token = req.header("x-auth-token");
  // if there is no token  in header then return 401 status
  if (!token) {
    return res.status(401).json({ msg: "No Token, Authorization denied" });
  }

  try {
    //Verify and decode data from token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (error) {}
};
