import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { login, register, adminVerifyCode, adminSendOtp, adminVerifyOtp } from '../controllers/authController.js';
import { getChatHistory, getUsers, postMessage, getTrainerClients, updateClientPlans, updateUserProfile, updateTrainerProfile } from '../controllers/dashboardController.js';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../controllers/trainerController.js';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../controllers/programController.js';
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { getMemberships, getTransformations, createMembership, updateMembership, deleteMembership, createTransformation, updateTransformation, deleteTransformation } from '../controllers/catalogsController.js';
import { getContacts, createContact, deleteContact } from '../controllers/contactController.js';
import { getPageHeroes, updatePageHero } from '../controllers/pageHeroController.js';
import { getOffer, updateOffer } from '../controllers/offerController.js';
import { generateAIPlan } from '../controllers/aiController.js';
import { getGymClients, createGymClient, updateGymClient, deleteGymClient } from '../controllers/gymClientController.js';

const router = Router();

// --- AUTHENTICATION ---
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/admin/verify-code', adminVerifyCode);
router.post('/auth/admin/send-otp', adminSendOtp);
router.post('/auth/admin/verify-otp', adminVerifyOtp);

// --- MESSAGING & PORTALS ---
router.get('/dashboard/messages', getChatHistory);
router.post('/dashboard/messages', postMessage);

// --- TRAINER PORTAL ---
router.get('/trainer/:trainerId/members', getTrainerClients);
router.put('/trainer/client/:clientId', updateClientPlans);
router.put('/trainer/:trainerId/profile', updateTrainerProfile);

// --- USER PORTAL ---
router.get('/users', getUsers);
router.put('/user/:userId/profile', updateUserProfile);

// --- BLOGS ---
router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// --- TRAINERS ---
router.get('/trainers', getTrainers);
router.post('/trainers', createTrainer);
router.put('/trainers/:id', updateTrainer);
router.delete('/trainers/:id', deleteTrainer);

// --- PROGRAMS ---
router.get('/programs', getPrograms);
router.post('/programs', createProgram);
router.put('/programs/:id', updateProgram);
router.delete('/programs/:id', deleteProgram);

// --- GALLERY ---
router.get('/gallery', getGalleryItems);
router.post('/gallery', createGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// --- CONTACT LEADS ---
router.get('/contacts', getContacts);
router.post('/contacts', createContact);
router.delete('/contacts/:id', deleteContact);

// --- MEMBERSHIPS ---
router.get('/memberships', getMemberships);
router.post('/memberships', createMembership);
router.put('/memberships/:id', updateMembership);
router.delete('/memberships/:id', deleteMembership);

// --- TRANSFORMATIONS ---
router.get('/transformations', getTransformations);
router.post('/transformations', createTransformation);
router.put('/transformations/:id', updateTransformation);
router.delete('/transformations/:id', deleteTransformation);

// --- DYNAMIC PAGE HEROES CMS ---
router.get('/page-heroes', getPageHeroes);
router.put('/page-heroes/:pageKey', updatePageHero);

// --- PROMOTIONAL OFFERS BANNER ---
router.get('/promotional-offer', getOffer);
router.put('/promotional-offer', updateOffer);

// --- DYNAMIC AI PLAN GENERATION ---
router.post('/ai/generate', generateAIPlan);

// --- GYM CLIENTS (WHITE-LABEL) ---
router.get('/clients', getGymClients);
router.post('/clients', createGymClient);
router.put('/clients/:id', updateGymClient);
router.delete('/clients/:id', deleteGymClient);

// --- SECURE FILE UPLOAD TELEMETRY ---
router.post('/upload', (req, res) => {
  try {
    const { filename, base64 } = req.body;
    if (!filename || !base64) {
      return res.status(400).json({ error: 'Filename and base64 data are required' });
    }

    const cleanBase64 = base64.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `http://localhost:5000/uploads/${uniqueFilename}`;
    res.json({ url: fileUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
});

export default router;
