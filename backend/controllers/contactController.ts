import { Request, Response } from 'express';
import Contact from '../models/Contact.js';

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err: any) {
    res.status(500).json({ error: 'Leads pipeline stalled', message: err.message });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ success: true, data: newContact });
  } catch (err: any) {
    res.status(500).json({ error: 'Submission drop failed', message: err.message });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Lead tracking code absent' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Leads removal interrupted', message: err.message });
  }
};
