// const User = require("../models/user");

// module.exports = (req, res, next) => {
//   console.log("habibaaaaaaaaaaaaa:", req.body);
//   const foundUser = User.find({ email: req.body.email });
//   console.log(foundUser);
//   if (foundUser.isBlocked == true) {
//     const error = new Error();
//     error.message =
//       "U Have not right to access to this page , Please contact to admin!!!!!";
//     error.statusCode = 403;
//     return next(error);
//   } else {
//     next();
//   }
// };
