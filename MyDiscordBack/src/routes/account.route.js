// routes/user.route.js

const express = require("express");

const accountController = require("../controller/account.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// GET /users
router.get("/", accountController.getAccounts);

// GET /users/:id
router.get("/:id", accountController.getAccountById);

// POST /users
router.post("/", accountController.createAccount);

// PUT /users/:id
router.put("/:id", accountController.updateAccount);

// DELETE /users/:id
router.delete("/:id", accountController.deleteAccount);

module.exports = router;