import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IDietMeal {
  mealName: string; // e.g., "Breakfast", "Lunch"
  time: string;
  items: Array<{
    foodItemName: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
}

export interface IDietPlan extends Document {
  title: string;
  client: mongoose.Types.ObjectId;
  dietitian: mongoose.Types.ObjectId;
  type: string; // "Weight Loss", "Muscle Gain", "Keto", etc.
  startDate: Date;
  endDate: Date;
  meals: IDietMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  notes: string;
  waterIntakeGoal: string; // e.g., "3 Liters"
  status: string; // "Active", "Completed", "Draft"
}

const MealItemSchema = new Schema({
  foodItemName: { type: String, required: true },
  quantity: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true }
}, { _id: false });

const DietMealSchema = new Schema({
  mealName: { type: String, required: true },
  time: { type: String, required: true },
  items: [MealItemSchema]
}, { _id: false });

const DietPlanSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dietitian: { type: Schema.Types.ObjectId, ref: 'Trainer', required: true }, // Using Trainer model for staff including dietitians for simplicity, or we can use generic User
  type: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  meals: [DietMealSchema],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  waterIntakeGoal: { type: String, default: '3L' },
  status: { type: String, enum: ['Active', 'Completed', 'Draft'], default: 'Active' }
}, baseSchemaOptions);

export default mongoose.model<IDietPlan>('DietPlan', DietPlanSchema);
