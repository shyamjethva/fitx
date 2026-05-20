import { Request, Response } from 'express';
import GymClient from '../models/GymClient.js';

export const getGymClients = async (req: Request, res: Response): Promise<any> => {
  try {
    const clients = await GymClient.find().sort({ createdAt: -1 });
    return res.json(clients);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch clients', message: err.message });
  }
};

export const createGymClient = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, slug, logoUrl, primaryColor, secondaryColor, features, status } = req.body;
    const existing = await GymClient.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: `Client with slug ${slug} already exists` });
    }
    const newClient = new GymClient({
      name,
      slug,
      logoUrl,
      primaryColor,
      secondaryColor,
      features,
      status
    });
    await newClient.save();
    return res.status(201).json(newClient);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create client', message: err.message });
  }
};

export const updateGymClient = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, slug, logoUrl, primaryColor, secondaryColor, features, status } = req.body;

    const updated = await GymClient.findByIdAndUpdate(
      id,
      { name, slug, logoUrl, primaryColor, secondaryColor, features, status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update client', message: err.message });
  }
};

export const deleteGymClient = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deleted = await GymClient.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Client not found' });
    }
    return res.json({ message: 'Client deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete client', message: err.message });
  }
};
