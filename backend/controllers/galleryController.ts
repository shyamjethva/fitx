import { Request, Response } from 'express';
import Gallery from '../models/Gallery.js';

export const getGalleryItems = async (req: Request, res: Response) => {
  try {
    const items = await Gallery.find();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: 'Visual registry unqueryable', message: err.message });
  }
};

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const newItem = new Gallery(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(500).json({ error: 'Visual upload rejected', message: err.message });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Gallery.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Frame asset nonexistent' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Framing revocation aborted', message: err.message });
  }
};
