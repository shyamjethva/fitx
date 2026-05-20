import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface ITrainer extends Document {
  name: string;
  role: string;
  img: string;
  bio: string;
  phone?: string;
  email: string;
  password?: string; // Set optional in interface for return payload sanitation
  spec?: string;
  cert?: string;
}

const TrainerSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  img: { type: String, required: true },
  bio: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true, index: true, trim: true },
  password: { type: String, required: true },
  spec: { type: String },
  cert: { type: String }
}, baseSchemaOptions);

export default mongoose.model<ITrainer>('Trainer', TrainerSchema);
