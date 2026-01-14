import express from 'express';
import { createBid, getAllBids, hiring } from '../controller/bid_controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:gigId',verifyToken,createBid);
router.get('/:gigId',verifyToken,getAllBids);
router.patch('/:bidId/hire',verifyToken ,hiring);

export default router;