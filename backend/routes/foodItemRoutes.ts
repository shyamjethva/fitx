import express from 'express';
import { getFoodItems, createFoodItem, deleteFoodItem } from '../controllers/foodItemController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getFoodItems);
router.post('/', verifyToken, isAdmin, createFoodItem);
router.delete('/:id', verifyToken, isAdmin, deleteFoodItem);

export default router;
