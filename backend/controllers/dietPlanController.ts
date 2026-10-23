import { Request, Response } from 'express';
import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';

export const getDietPlans = async (req: Request, res: Response) => {
  try {
    const plans = await DietPlan.find().populate('client', 'name email avatar').populate('dietitian', 'name');
    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching diet plans', error: error.message });
  }
};

export const getDietPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await DietPlan.findById(req.params.id).populate('client', 'name email').populate('dietitian', 'name');
    if (!plan) return res.status(404).json({ message: 'Diet plan not found' });
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching diet plan', error: error.message });
  }
};

export const createDietPlan = async (req: Request, res: Response) => {
  try {
    const newPlan = new DietPlan(req.body);
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating diet plan', error: error.message });
  }
};

export const updateDietPlan = async (req: Request, res: Response) => {
  try {
    const updatedPlan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) return res.status(404).json({ message: 'Diet plan not found' });
    res.json(updatedPlan);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating diet plan', error: error.message });
  }
};

export const deleteDietPlan = async (req: Request, res: Response) => {
  try {
    const deletedPlan = await DietPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: 'Diet plan not found' });
    res.json({ message: 'Diet plan deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting diet plan', error: error.message });
  }
};
