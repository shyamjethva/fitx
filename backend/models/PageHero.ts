import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IPageHero extends Document {
  pageKey: string;
  title: string;
  subtitle: string;
  description: string; // split by newlines for bullet points
  image: string;
  video?: string;
  ctaText: string;
  contentBlocks?: any; // Generic JSON data for full page content
}

const PageHeroSchema: Schema = new Schema({
  pageKey: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String },
  ctaText: { type: String, required: true },
  contentBlocks: { type: Schema.Types.Mixed, default: {} }
}, { ...baseSchemaOptions, collection: 'websiteheroes' });

export default mongoose.model<IPageHero>('PageHero', PageHeroSchema);
