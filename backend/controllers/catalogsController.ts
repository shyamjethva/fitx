import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Membership from '../models/Membership.js';
import Transformation from '../models/Transformation.js';

// --- MEMBERSHIP ---
export const getMemberships = async (req: Request, res: Response) => {
  try {
    const plans = await Membership.find();
    res.json(plans);
  } catch (err: any) {
    res.status(500).json({ error: 'Membership levels unqueryable', message: err.message });
  }
};

export const createMembership = async (req: Request, res: Response) => {
  try {
    const newMembership = new Membership(req.body);
    await newMembership.save();
    res.status(201).json(newMembership);
  } catch (err: any) {
    res.status(500).json({ error: 'Membership creation failed', message: err.message });
  }
};

export const updateMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { idStr: id };
    const updated = await Membership.findOneAndUpdate(query, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Membership level not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Membership modification failed', message: err.message });
  }
};

export const deleteMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { idStr: id };
    const deleted = await Membership.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ error: 'Membership level not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Membership deletion failed', message: err.message });
  }
};

// --- TRANSFORMATIONS ---
export const getTransformations = async (req: Request, res: Response) => {
  try {
    const data = await Transformation.find();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Transformation registry unreachable', message: err.message });
  }
};

export const createTransformation = async (req: Request, res: Response) => {
  try {
    const newTrans = new Transformation(req.body);
    await newTrans.save();
    res.status(201).json(newTrans);
  } catch (err: any) {
    res.status(500).json({ error: 'Transformation creation failed', message: err.message });
  }
};

export const updateTransformation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Transformation.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Transformation entry not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Transformation modification failed', message: err.message });
  }
};

export const deleteTransformation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Transformation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Transformation entry not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Transformation deletion failed', message: err.message });
  }
};
