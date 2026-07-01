import { Request, Response } from 'express';
import FoodItem from '../models/FoodItem.js';

export const getFoodItems = async (req: Request, res: Response) => {
  try {
    const foods = await FoodItem.find();
    res.json(foods);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching food items', error: error.message });
  }
};

export const createFoodItem = async (req: Request, res: Response) => {
  try {
    const newFood = new FoodItem(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating food item', error: error.message });
  }
};

export const deleteFoodItem = async (req: Request, res: Response) => {
  try {
    const deletedFood = await FoodItem.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting food item', error: error.message });
  }
};
