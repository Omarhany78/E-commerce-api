const express = require("express");
const router = express.Router();
const { authorizePermissions } = require("../middleware/authentication");

const {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
  deleteAllOrders,
} = require("../controllers/orderController");

router.get("/", authorizePermissions("admin"), getAllOrders);
router.get("/showAllMyOrders", getCurrentUserOrders);
router.get("/:id", getSingleOrder);
router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.delete("/", deleteAllOrders);

module.exports = router;
