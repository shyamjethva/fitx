import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IGymClient extends Document {
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  features: string[];
  status: string;
  createdAt: Date;
}

const GymClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logoUrl: { type: String, default: '' },
  primaryColor: { type: String, default: '#00E5FF' },
  secondaryColor: { type: String, default: '#0A0F24' },
  features: { type: [String], default: [] },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
}, baseSchemaOptions);

export default mongoose.model<IGymClient>('GymClient', GymClientSchema);
