import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaOptions } from './helpers.js';

export interface IMessage extends Document {
  senderId: string;
  senderRole: 'USER' | 'TRAINER';
  receiverId: string;
  receiverRole: 'USER' | 'TRAINER';
  text: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  senderRole: { type: String, enum: ['USER', 'TRAINER'], required: true },
  receiverId: { type: String, required: true },
  receiverRole: { type: String, enum: ['USER', 'TRAINER'], required: true },
  text: { type: String, required: true },
}, {
  ...baseSchemaOptions,
  timestamps: true // automatically gives createdAt and updatedAt
});

export default mongoose.model<IMessage>('Message', MessageSchema);
