import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IMembership extends Document {
  idStr: string; // maps to older starter/pro/elite static references 
  name: string;
  price: string;
  period: string;
  desc: string;
  iconName: string;
  color: string;
  popular?: boolean;
  features: string[];
  facilities: string[];
}

const MembershipSchema: Schema = new Schema({
  idStr: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, required: true },
  desc: { type: String, required: true },
  iconName: { type: String, required: true },
  color: { type: String, required: true },
  popular: { type: Boolean, default: false },
  features: [{ type: String }],
  facilities: [{ type: String }]
}, {
  ...baseSchemaOptions,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.idStr; // Re-map old static starter/pro/elite string keys as API response ID
      delete ret.idStr;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.model<IMembership>('Membership', MembershipSchema);
