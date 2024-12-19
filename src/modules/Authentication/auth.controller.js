const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { selectAll, insert } = require("../../db/sql-fun");
const { promisify } = require("util");
const knex = require("knex");
const generateId = require("../../utils/generateId");
const generateTokens = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

const verifyUserPassword = (dbPassword, password, next) => {
  try {
    return dbPassword === password;
  } catch (err) {
    next(err);
  }
};
const verifyUserEmail = (dbEmail, email, next) => {
  try {
    return dbEmail === email;
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }


  const userExists = await selectAll("users", "*", {
    email,
  });

  if (userExists.length === 0 || userExists[0].is_verified == false) {
    return res.status(404).json({ message: "user not found" });
  }

 
  const correctPassword = await bcrypt.compare(
    password,
    userExists[0].password
  );
  console.log(password); //Yasmin123#
  console.log(userExists[0].password); //$2b$08$6K0mtdyFN.RB0uRJnNzhZuXONgtKXbiT.ku.zDA7rMylqqXDAJ/b.
  if (!correctPassword) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const correctEmail = await verifyUserEmail(userExists[0].email, email, next);

  //email is incorrect
  if (!correctPassword || !correctEmail) {
    return res.status(401).json({ message: "incorrect password or email" });
  }

  const payload = {
    email: userExists[0].email,
    id: userExists[0].id,
    role: userExists[0].role,
    name: userExists[0].name,
  };
  const token = generateTokens(payload);

  try {
    await insert("loginUsers", {
      id: generateId(),
      userId: userExists[0].id,
    });

    // Send response with token
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while recording the login" });
  }
};

const protect = async (req, res, next) => {
  //1) Check the existence of token in the headers
  let token;
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(404).json({ message: "login first" });
  }
  token = req.headers.authorization.split(" ")[1];

  //2) check the validation of token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return res.status(404).json({ message: "invalid token" });
  }
  //3) Check the user existence
  const existedUser = await selectAll(
    "users",
    ["id", "name", "email", "role"],
    {
      id: decoded.id,
    }
  );

  if (
    !existedUser ||
    existedUser.length == 0 ||
    existedUser[0].is_verified == false
  ) {
    return res.status(404).json({ message: "user not found" });
  }
  req.user = existedUser[0];
  next();
};

module.exports = { login, protect, verifyUserPassword, generateTokens };
