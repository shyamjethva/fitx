import { Request, Response } from 'express';
import PromotionalOffer from '../models/PromotionalOffer.js';

export const getOffer = async (req: Request, res: Response): Promise<any> => {
  try {
    let offer = await PromotionalOffer.findOne();
    if (!offer) {
      offer = await PromotionalOffer.create({
        title: 'Limited Time Offer',
        subtitle: 'Extra ₹1400 off + 3 months extension',
        targetDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
        bgColor: '#ff5a3d',
        textColor: '#000000',
        isActive: true
      });
    }
    return res.json(offer);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve offer setting', message: err.message });
  }
};

export const updateOffer = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, subtitle, targetDate, bgColor, textColor, isActive } = req.body;
    let offer = await PromotionalOffer.findOne();
    if (!offer) {
      offer = new PromotionalOffer();
    }
    
    offer.title = title;
    offer.subtitle = subtitle;
    offer.targetDate = new Date(targetDate);
    if (bgColor) offer.bgColor = bgColor;
    if (textColor) offer.textColor = textColor;
    if (typeof isActive === 'boolean') offer.isActive = isActive;

    await offer.save();
    return res.json(offer);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update offer setting', message: err.message });
  }
};
