import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IPromotionalOffer extends Document {
  title: string;
  subtitle: string;
  targetDate: Date;
  bgColor: string;
  textColor: string;
  isActive: boolean;
}

const PromotionalOfferSchema: Schema = new Schema({
  title: { type: String, required: true, default: 'Limited Time Offer' },
  subtitle: { type: String, required: true, default: 'Extra ₹1400 off + 3 months extension' },
  targetDate: { type: Date, required: true, default: () => new Date(Date.now() + 12 * 60 * 60 * 1000) },
  bgColor: { type: String, default: '#ff5a3d' },
  textColor: { type: String, default: '#000000' },
  isActive: { type: Boolean, default: true }
}, baseSchemaOptions);

export default mongoose.model<IPromotionalOffer>('PromotionalOffer', PromotionalOfferSchema);
