import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IGallery extends Document {
  type: string;
  title: string;
  img: string;
  isVideo?: boolean;
}

const GallerySchema: Schema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  img: { type: String, required: true },
  isVideo: { type: Boolean, default: false }
}, { ...baseSchemaOptions, collection: 'websitegalleries' });

export default mongoose.model<IGallery>('Gallery', GallerySchema);
