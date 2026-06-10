import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface ITransformation extends Document {
  name: string;
  weeks: string;
  quote: string;
  before: string;
  after: string;
}

const TransformationSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  weeks: { type: String, required: true },
  quote: { type: String, required: true },
  before: { type: String, required: true },
  after: { type: String, required: true }
}, { ...baseSchemaOptions, collection: 'websitetransformations' });

export default mongoose.model<ITransformation>('Transformation', TransformationSchema);
