const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization");
  console.log("token", token);
  if (!token) {
    const error = new Error("Not Authorzied");
    error.message = "Not Authorzied!!!";
    error.statusCode = 401;
    return next(error);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "nanananaHabibaIsBananaaaa");
    console.log("Decoded!", decodedToken);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
  if (!decodedToken) {
    const error = new Error();
    error.message = "Not Authorzied!!!";
    error.statusCode = 403;
    return next(error);
  }

  if (decodedToken.isBlocked == true) {
    const error = new Error();
    error.message =
      "U Have not right to access to this page , Please contact to admin!!!!!";
    error.statusCode = 403;
    return next(error);
  }
  req.userID = decodedToken.userID || decodedToken.adminID;
  next();
};
