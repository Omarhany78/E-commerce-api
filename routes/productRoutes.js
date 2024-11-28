const express = require("express");
const router = express.Router();
const { authorizePermissions } = require("../middleware/authentication");

const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  deleteAllProducts,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", authorizePermissions("admin"), createProduct);
router.post("/uploadImage", authorizePermissions("admin"), uploadImage);
router.patch("/:id", authorizePermissions("admin"), updateProduct);
router.delete("/:id", authorizePermissions("admin"), deleteProduct);
router.delete("/", deleteAllProducts);

module.exports = router;
