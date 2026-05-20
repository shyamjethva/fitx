import { Request, Response } from 'express';
import Blog from '../models/Blog.js';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve blogs catalog', message: err.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (data.featured) {
      // Un-feature older articles if current one demands prominence
      await Blog.updateMany({ featured: true }, { featured: false });
    }
    
    const newBlog = new Blog({
      ...data,
      date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to broadcast blog post', message: err.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.featured) {
      await Blog.updateMany({ _id: { $ne: id } }, { featured: false });
    }

    const updated = await Blog.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return res.status(404).json({ error: 'Article vector not found' });
    
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update article contents', message: err.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Article not found in repository' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Purging process failed', message: err.message });
  }
};
