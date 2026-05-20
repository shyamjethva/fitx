import { Request, Response } from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Trainer from '../models/Trainer.js';

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('assignedTrainer')
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get message history between two parties
export const getChatHistory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user1Id, user2Id } = req.query;
    if (!user1Id || !user2Id) {
      return res.status(400).json({ error: 'Both sender and receiver IDs are required.' });
    }

    // Find messages moving either direction
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ createdAt: 1 }); // oldest first for chat stream

    return res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Post a new chat message
export const postMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { senderId, senderRole, receiverId, receiverRole, text } = req.body;
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: 'Incomplete message payload.' });
    }

    const newMessage = new Message({
      senderId,
      senderRole,
      receiverId,
      receiverRole,
      text
    });

    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Trainer specific: get all users assigned to this trainer
export const getTrainerClients = async (req: Request, res: Response): Promise<any> => {
  try {
    const { trainerId } = req.params;
    if (!trainerId) {
      return res.status(400).json({ error: 'Trainer ID required.' });
    }

    const clients = await User.find({ assignedTrainer: trainerId });
    return res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Trainer specific: update diet/workout plans for a client user
export const updateClientPlans = async (req: Request, res: Response): Promise<any> => {
  try {
    const { clientId } = req.params;
    const { dietPlan, workoutPlan } = req.body;

    const updateData: any = {};
    if (dietPlan) updateData.dietPlan = dietPlan;
    if (workoutPlan) updateData.workoutPlan = workoutPlan;

    const updatedUser = await User.findByIdAndUpdate(
      clientId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Client user not found.' });
    }

    return res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update user's general profile
export const updateUserProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { 
      name, email, phone, age, weight, height, gender, 
      appliedProgram, avatar, activePlan, planDuration 
    } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (age !== undefined) updateData.age = Number(age);
    if (weight !== undefined) updateData.weight = Number(weight);
    if (height !== undefined) updateData.height = Number(height);
    if (gender !== undefined) updateData.gender = gender;
    if (appliedProgram !== undefined) updateData.appliedProgram = appliedProgram;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (activePlan !== undefined) updateData.activePlan = activePlan;
    if (planDuration !== undefined) updateData.planDuration = planDuration;

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).populate('assignedTrainer');

    if (!updated) return res.status(404).json({ error: 'User not found.' });
    return res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update trainer's credentials & bio
export const updateTrainerProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { trainerId } = req.params;
    const { name, email, spec, cert, bio, img } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (spec !== undefined) updateData.spec = spec;
    if (cert !== undefined) updateData.cert = cert;
    if (bio !== undefined) updateData.bio = bio;
    if (img !== undefined) updateData.img = img;

    const updated = await Trainer.findByIdAndUpdate(
      trainerId,
      { $set: updateData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Trainer not found.' });
    return res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
