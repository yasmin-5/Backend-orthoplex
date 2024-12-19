const express = require("express");
const router = express.Router();

const {
  addUsers,
  getAllUsers,
  deleteUsers,
  getUserById,
  updateUser,
  getTopUsersByLoginFrequency,
  InActiveUsers,
} = require("./users.controller");
const { protect } = require("../Authentication/auth.controller");
const validate = require("../../utils/validationMiddleWare");
const { updateUserSchema, userSchema } = require("./users.validation");
router.post("/addUsers", addUsers,validate(userSchema));
router.use(protect);

router.get("/getAllUsers", getAllUsers);
router.get("/getFrequency", getTopUsersByLoginFrequency);
router.delete("/deleteUser/:id", deleteUsers);
router.get("/getUserById/:id", getUserById);
router.patch("/updateUser/:id", updateUser,validate(updateUserSchema));
router.get("/inActiveUser", InActiveUsers);

module.exports = router;
