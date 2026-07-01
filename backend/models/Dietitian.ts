import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IDietitian extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  experience: string;
  qualifications: string;
  fees: string;
  availability: string;
  status: string;
  avatar: string;
  role: string;
  gymId?: string;
}

const DietitianSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, default: '123456' },
  phone: { type: String, default: '' },
  specialization: { type: String, default: '' },
  experience: { type: String, default: '' },
  qualifications: { type: String, default: '' },
  fees: { type: String, default: '' },
  availability: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive', 'active', 'inactive'], default: 'Active' },
  avatar: { type: String, default: '' },
  role: { type: String, default: 'DIETITIAN' },
  gymId: { type: String, default: '' },
}, baseSchemaOptions);

export default mongoose.model<IDietitian>('Dietitian', DietitianSchema);
