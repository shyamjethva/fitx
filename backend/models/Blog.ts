import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  img: string;
  featured?: boolean;
  content?: string;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  excerpt: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, default: 'FitX Administration' },
  date: { type: String },
  readTime: { type: String, default: '5 min read' },
  img: { type: String, required: true },
  featured: { type: Boolean, default: false },
  content: { type: String }
}, { ...baseSchemaOptions, collection: 'websiteblogs' });

export default mongoose.model<IBlog>('Blog', BlogSchema);
