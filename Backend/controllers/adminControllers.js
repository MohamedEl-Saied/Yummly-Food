const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// exports.createAdmin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     // const { username, email, confirmedPassword } = req.body;
//     // const password = req.body.password;

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const admin = new Admin({
//       email: email,
//       password: hashedPassword,
//     });

//     const newAdmin = await admin.save();
//     return res.status(201).json({
//       Data: newAdmin,
//       Message: "Admin Created Successfully",
//       Error: null,
//       Success: true,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }

//     return next(err);
//   }
// };

exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    const error = new Error();
    error.statusCode = 401;
    error.message = "Email OR Passwrod Is Not Correct.";
    return next(error);
  }
  const isEqual = await bcrypt.compare(password, admin.password);
  if (!isEqual) {
    const error = new Error();
    error.statusCode = 401;
    error.message = "Email OR Passwrod Is Not Correct.";
    return next(error);
  }
  try {
    const token = jwt.sign(
      {
        email: admin.email,
        adminID: admin._id,
      },
      "nanananaHabibaIsBananaaaa"
      // { expiresIn: "2h" }
    );
    let adminID = admin._id;
    res.status(200).json({
      Data: { token, adminID },
      Message: `Welcome ${admin.email} , You Logged In Succcefully`,
      Error: null,
      Success: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};
