import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  plan?: string;
  message: string;
  timestamp: string;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  type: { type: String, default: 'GENERAL' },
  plan: { type: String },
  message: { type: String, required: true },
  timestamp: { type: String }
}, baseSchemaOptions);

ContactSchema.pre('save', function(next) {
  const contact = this as any;
  if (!contact.timestamp) {
    contact.timestamp = new Date().toLocaleString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  }
  next();
});

export default mongoose.model<IContact>('Contact', ContactSchema);
