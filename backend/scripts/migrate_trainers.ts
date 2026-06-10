import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Trainer from '../models/Trainer.js';

dotenv.config();

const migrate = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitx';
    await mongoose.connect(uri);
    console.log('🔋 DB connected for migration.');

    const trainers = await Trainer.find();
    const defaultPass = bcrypt.hashSync('trainer123', 10);

    console.log(`Checking ${trainers.length} trainers for legacy data fix...`);

    for (let i = 0; i < trainers.length; i++) {
      const t = trainers[i];
      let needsUpdate = false;

      if (!t.password) {
        t.password = defaultPass;
        needsUpdate = true;
      }

      if (!t.email) {
        t.email = `${t.name.toLowerCase().replace(/\s+/g, '')}@fitx.com`;
        needsUpdate = true;
      }

      if (!t.phone) {
        t.phone = `+91 90000 0001${i}`;
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Migrating trainer: ${t.name} -> Email: ${t.email}`);
        await t.save();
      }
    }

    console.log('✅ Migration finished! Legacy compatibility complete.');
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
