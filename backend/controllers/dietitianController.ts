import { Request, Response } from 'express';
import Dietitian from '../models/Dietitian.js';

export const getDietitians = async (req: Request, res: Response) => {
  try {
    const dietitians = await Dietitian.find().select('-__v');
    res.json(dietitians);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching dietitians', error: error.message });
  }
};

export const getDietitianById = async (req: Request, res: Response) => {
  try {
    const dietitian = await Dietitian.findById(req.params.id);
    if (!dietitian) return res.status(404).json({ message: 'Dietitian not found' });
    res.json(dietitian);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching dietitian', error: error.message });
  }
};

export const createDietitian = async (req: Request, res: Response) => {
  try {
    const newDietitian = new Dietitian({ ...req.body, role: 'DIETITIAN' });
    const saved = await newDietitian.save();
    res.status(201).json(saved);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: 'Error creating dietitian', error: error.message });
  }
};

export const updateDietitian = async (req: Request, res: Response) => {
  try {
    const updated = await Dietitian.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Dietitian not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating dietitian', error: error.message });
  }
};

export const deleteDietitian = async (req: Request, res: Response) => {
  try {
    const deleted = await Dietitian.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Dietitian not found' });
    res.json({ message: 'Dietitian deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting dietitian', error: error.message });
  }
};

// Login for Dietitian Portal
export const dietitianLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const dietitian = await Dietitian.findOne({ email: email.trim().toLowerCase() });
    if (!dietitian) return res.status(404).json({ message: 'Dietitian not found' });
    if (dietitian.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res.json({
      _id: dietitian._id,
      name: dietitian.name,
      email: dietitian.email,
      role: 'DIETITIAN',
      specialization: dietitian.specialization,
      avatar: dietitian.avatar,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};
