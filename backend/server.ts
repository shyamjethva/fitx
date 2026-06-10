import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { runSeeder } from './scripts/seed.js';
import apiRoutes from './routes/api.js';

// --- CONFIGURATION BOOTSTRAP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// --- GLOBAL MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Unified Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- ROUTING REGISTRY ---
app.use('/api', apiRoutes);

// Basic root ping
app.get('/', (req, res) => {
  res.json({ status: 'RUNNING', service: 'FitX Dynamic REST Engine', timestamp: new Date().toISOString() });
});

// Helper to get local network IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const netInterface of interfaces[name] || []) {
      if (netInterface.family === 'IPv4' && !netInterface.internal) {
        return netInterface.address;
      }
    }
  }
  return 'localhost';
}

// --- INITIALIZATION SEQUENCE ---
const initServer = async () => {
  try {
    // 1. Secure Mongoose uplink
    await connectDB();

    // 2. Execute pre-flight validation seeding
    await runSeeder();

    // 3. Engage listeners on 0.0.0.0 network host
    const HOST = '0.0.0.0';
    app.listen(Number(PORT), HOST, () => {
      const localIp = getLocalIpAddress();
      console.log(`\n\t🚀 FitX Express Backend Server ready:`);
      console.log(`\t➜  Local:   http://localhost:${PORT}/`);
      console.log(`\t➜  Network: http://${localIp}:${PORT}/\n`);
    });
  } catch (err) {
    console.error('❌ Unified initialization pipeline aborted:', err);
    process.exit(1);
  }
};

initServer();
