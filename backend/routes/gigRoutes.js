import express from 'express';
import { createGig ,getAllGig, getSingleGig} from '../controller/gig_controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',verifyToken,createGig);
router.get('/',verifyToken , getAllGig);
router.get("/:gigId", getSingleGig);


export default router;