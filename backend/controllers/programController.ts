import { Request, Response } from 'express';
import Program from '../models/Program.js';

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err: any) {
    res.status(500).json({ error: 'Programs stack unavailable', message: err.message });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (err: any) {
    res.status(500).json({ error: 'Course creation aborted', message: err.message });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Program.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Program sequence not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Program modifications failed', message: err.message });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Program.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Sequence nonexistent' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Service purge failure', message: err.message });
  }
};
