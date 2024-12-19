const generateId = require("../../utils/generateId");
const knex = require("../../db/knex");
const bcrypt = require("bcrypt");
const {
  selectAll,
  insert,
  deleteUser,
  update,
  verifedUsers,
} = require("../../db/sql-fun");
const { calculateTimeDiff } = require("../../utils/timeDiffCalculator");
const addUsers = async (req, res) => {
  const id = generateId();
  let { name, email, password, role, is_verified } = req.body;
  const existingUser = await knex("users").where({ email }).first();

  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }
  const hashedPassword = await hashPassword(password);
  const user = {
    id,
    name,
    email,
    password: hashedPassword,
    role,
    is_verified,
  };

  try {
    await insert("users", user);
    res.status(201).json({ message: "user created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { name, email } = req.query;

    let query = knex("users").select("*");
    if (name) {
      query = query.where("name", "like", `%${name}%`);
    }

    if (email) {
      query = query.where("email", "like", `%${email}%`);
    }

    const users = await query;
    const totalRegisteredUsers = await knex("users").count("id as total");

    const isVerifiedUsers = await verifedUsers("users", "*", {});

    res.status(200).json({
      users,
      totalRegisteredUsers: totalRegisteredUsers[0].total,
      totalVerifiedUsers: isVerifiedUsers[0]?.totalVerifiedUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUsers = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser("users", { id });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await selectAll("users", "*", {
      id,
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const hashPassword = async (plainPassword) => {
  const saltRounds = 8;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const {} = req.body;
  const user = {
    name: req.body.name,
    email: req.body.email,
  };
  try {
    await update("users", user, { id });
    res.status(200).json({ message: "user updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const getTopUsersByLoginFrequency = async (req, res) => {
  try {
    const topUsers = await knex("loginUsers")
      .select("users.id", "users.name", "users.email")
      .count("loginUsers.id as login_count")
      .join("users", "users.id", "loginUsers.userId")
      .groupBy("users.id")
      .orderBy("login_count", "desc")
      .limit(3);

    res.status(200).json({
      topUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const InActiveUsers = async (req, res) => {
  const inActive = [];

  try {
    const users = await selectAll("loginUsers", "*", {});
    console.log(users);

    users.forEach((inactive) => {
      const lastLoginTime = inactive.login_time;
      const timeDiff = calculateTimeDiff(lastLoginTime);
      const alreadyExists = inActive.some(
        (user) => user.id === inactive.userId
      );
      if (!alreadyExists) {
        if (timeDiff.includes("hours" || "days")) {
          inActive.push({
            id: inactive.id,
            userId: inactive.userId,
            login_time: calculateTimeDiff(inactive.login_time),
          });
        } else if (timeDiff === "months") {
          inActive.push({
            id: inactive.id,
            userId: inactive.userId,
            login_time: calculateTimeDiff(inactive.login_time),
          });
        }
      }
    });

    if (inActive.length > 0) {
      return res.status(200).json({ inActive });
    }
    return res.status(200).json({ message: "No inactive users found." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  addUsers,
  getAllUsers,
  deleteUsers,
  getUserById,
  updateUser,
  getTopUsersByLoginFrequency,
  InActiveUsers,
};
