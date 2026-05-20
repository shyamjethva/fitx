import { Request, Response } from 'express';
import PageHero from '../models/PageHero.js';

export const getPageHeroes = async (req: Request, res: Response): Promise<any> => {
  try {
    const heroes = await PageHero.find();
    return res.json(heroes);
  } catch (err: any) {
    return res.status(500).json({ error: 'Page heroes custom registry unqueryable', message: err.message });
  }
};

export const updatePageHero = async (req: Request, res: Response): Promise<any> => {
  try {
    const { pageKey } = req.params;
    const { title, subtitle, description, image, video, ctaText, contentBlocks } = req.body;

    const updated = await PageHero.findOneAndUpdate(
      { pageKey },
      { 
        $set: { 
          title, 
          subtitle, 
          description, 
          image, 
          video,
          ctaText,
          contentBlocks
        } 
      },
      { new: true, upsert: true } // Upsert turns it into a perfect secure configuration engine
    );

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Page hero updating vector failed', message: err.message });
  }
};
