import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IFoodItem extends Document {
  name: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  isVegetarian: boolean;
  isVegan: boolean;
}

const FoodItemSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  servingSize: { type: String, required: true, trim: true }, // e.g., '100g', '1 cup'
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, default: 0 },
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
}, baseSchemaOptions);

export default mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);
