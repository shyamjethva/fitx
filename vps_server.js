import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Register multi-tenancy plugin BEFORE any routes/models are imported
import './tenantPlugin.js';

// Import Routes
import memberRoutes from './routes/memberRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import websiteRoutes from './routes/websiteRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import planRoutes from './routes/planRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import dietWorkoutRoutes from './routes/dietWorkoutRoutes.js';
import supportTicketRoutes from './routes/supportTicketRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import aiChatRoutes from './routes/aiChatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import healthLogRoutes from './routes/healthLogRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';

import { initCronJobs } from './cronJobs.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Admin routes (Moved below tenantMiddleware for priority)
// app.use('/api/admin', adminRoutes);

import jwt from 'jsonwebtoken';
import { tenantStorage } from './tenantContext.js';

const tenantMiddleware = (req, res, next) => {
  const bypassRoutes = [
    '/api/admin/login', 
    '/api/admin/trainer-login',
    '/api/admin/member-login',
    '/api/admin/dietitian-login',
    '/api/admin/register', 
    '/api/admin/verify-otp', 
    '/api/admin/send-otp', 
    '/api/admin/saas-plans',
    '/api/admin/client-services',
    '/api/admin/update-plan',
    '/api/public',
    '/api/upload',
    '/api/chat',
    '/api/scan-meal',
    '/api/smart-grocery',
    '/api/generate-plan',
    '/api/razorpay',
    '/api/super-admin/gyms/app-config'
  ];

  if (bypassRoutes.some(r => req.path.startsWith(r))) {
    return next();
  }

  let gymId = req.headers['x-gym-id'];
  
  // Try extracting from JWT if present
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      req.user = decoded;
      if (decoded.gymId) gymId = decoded.gymId;
    } catch (e) {
      // JWT verification failed, but we might still have x-gym-id for backward compatibility
    }
  }

  if (!gymId) {
    return res.status(400).json({ error: 'Authentication required (Missing JWT or x-gym-id)' });
  }

  tenantStorage.run(gymId, () => {
    next();
  });
};

app.use(tenantMiddleware);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 Successfully connected to gym-admin-db MongoDB cluster!");
    initCronJobs();
  })
  .catch(err => console.error("🚨 MongoDB Connection Error:", err));

// --- REGISTER ROUTERS ---
import expenseCategoryRoutes from './routes/expenseCategoryRoutes.js';

app.use('/api/admin', adminRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/contacts', enquiryRoutes);
app.use('/api/diet-workouts', dietWorkoutRoutes);
app.use('/api/support-tickets', supportTicketRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chat', aiChatRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/health-logs', healthLogRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/razorpay', razorpayRoutes);

import superAdminRoutes from './routes/super_admin/index.js';
app.use('/api/super-admin', superAdminRoutes);



import publicRoutes from './routes/publicRoutes.js';

app.use('/api/public', publicRoutes);

app.post('/api/upload', async (req, res) => {
  try {
    const { filename, base64 } = req.body || {};
    if (!filename || !base64) {
      return res.status(400).json({ error: 'filename and base64 are required' });
    }

    const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFilename = `${Date.now()}-${safeName}`;
    const base64Data = String(base64).replace(/^data:.*;base64,/, '');
    const filePath = path.join(uploadsDir, uniqueFilename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const protocol = req.protocol;
    const host = req.get('host');
    res.status(201).json({ url: `${protocol}://${host}/uploads/${uniqueFilename}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed defaults removed (Obsolete with multi-tenancy)


// --- START SERVERS ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Gym Admin Backend listening on http://0.0.0.0:${PORT}`);
});




