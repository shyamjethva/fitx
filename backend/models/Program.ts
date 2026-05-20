import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IProgram extends Document {
  title: string;
  slug: string;
  tag: string;
  desc: string;
  iconName: string;
  img: string;
  color: string;
}

const ProgramSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  tag: { type: String, required: true },
  desc: { type: String, required: true },
  iconName: { type: String, required: true },
  img: { type: String, required: true },
  color: { type: String, required: true }
}, baseSchemaOptions);

// Autopopulate slug on save if not present
ProgramSchema.pre('save', function(next) {
  const program = this as any;
  if (!program.slug) {
    program.slug = program.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

export default mongoose.model<IProgram>('Program', ProgramSchema);
