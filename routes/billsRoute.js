const express = require("express");
const {
    addBillsController,getBillsController
} = require("../controllers/billsController");

const router = express.Router();

// Routes
// Method - get
router.get("/get-bills", getBillsController);

// Method - post
router.post("/add-bills", addBillsController);



module.exports = router;

