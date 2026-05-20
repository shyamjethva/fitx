import { Request, Response } from 'express';
import Trainer from '../models/Trainer.js';

export const getTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 });
    res.json(trainers);
  } catch (err: any) {
    res.status(500).json({ error: 'Roster data unavailable', message: err.message });
  }
};

export const createTrainer = async (req: Request, res: Response) => {
  try {
    const newTrainer = new Trainer(req.body);
    await newTrainer.save();
    res.status(201).json(newTrainer);
  } catch (err: any) {
    res.status(500).json({ error: 'Personnel insertion rejected', message: err.message });
  }
};

export const updateTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Trainer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Staff record absent' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Bio edit cycle aborted', message: err.message });
  }
};

export const deleteTrainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Trainer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Trainer profile not encountered' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Record termination failed', message: err.message });
  }
};
