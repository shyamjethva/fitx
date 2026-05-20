import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Marked optional for compatibility on client projections, but enforced in schema
  phone: string;
  role: string;
  assignedTrainer?: mongoose.Types.ObjectId;
  appliedProgram?: string;
  activePlan?: string;
  planDuration?: string;
  dietPlan?: any;
  workoutPlan?: any;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true, index: true },
  role: { type: String, default: 'USER' },
  assignedTrainer: { type: Schema.Types.ObjectId, ref: 'Trainer' },
  appliedProgram: { type: String },
  activePlan: { type: String, default: 'FITX ELITE' },
  planDuration: { type: String, default: '1 Month' },
  dietPlan: { type: Schema.Types.Mixed },
  workoutPlan: { type: Schema.Types.Mixed },
  avatar: { type: String },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  gender: { type: String }
}, baseSchemaOptions);

export default mongoose.model<IUser>('User', UserSchema);
