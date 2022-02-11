const { Router } = require("express");
const router = Router();

const { getFundsInformation, withdrawal } = require("../controllers/wallet");

router.get("/getFundsInfo", getFundsInformation);
router.post("/applyWithdraw", withdrawal);

module.exports = router;
