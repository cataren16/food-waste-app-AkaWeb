const express = require('express');
const router = express.Router();
const controller = require('../controllers/marketplaceController');

router.get('/feed', controller.getFriendFeed);
router.post('/claim', controller.claimProduct);
router.get('/incoming-claims', controller.getIncomingClaims);
router.get('/my-claims', controller.getMyClaims);
router.post('/handle-claim', controller.handleClaim);
router.get("/transactions-history", controller.getTransactionHistory);

module.exports = router;