import express from 'express';
import { getDietPlans, getDietPlanById, createDietPlan, updateDietPlan, deleteDietPlan } from '../controllers/dietPlanController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getDietPlans);
router.get('/:id', verifyToken, getDietPlanById);
router.post('/', verifyToken, isAdmin, createDietPlan); // Allowing admin/trainers
router.put('/:id', verifyToken, isAdmin, updateDietPlan);
router.delete('/:id', verifyToken, isAdmin, deleteDietPlan);

export default router;
