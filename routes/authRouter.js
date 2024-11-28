const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  register,
  deleteAllUsers,
} = require("../controllers/authController");

router.get("/logout", logout);
router.post("/login", login);
router.post("/register", register);
router.delete("/delete", deleteAllUsers);

module.exports = router;
