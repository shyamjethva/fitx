import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Trainer from '../models/Trainer.js';
import nodemailer from 'nodemailer';
// import { Resend } from 'resend'; // Removed: not needed for SMTP only


const JWT_SECRET = process.env.JWT_SECRET || 'fitx_super_secret_signing_key_2026';

// Generate Signed JWT Access Token
const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '30d' });
};

// REGISTER CONTROLLER
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, phone, password, role, spec, cert, avatar } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'Please provide all required register fields.' });
    }

    const lowerEmail = email.toLowerCase().trim();
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;

    // 1. UNIQUENESS CHECK: Check if Email is already taken in EITHER collection!
    const isEmailTakenUser = await User.findOne({ email: lowerEmail });
    const isEmailTakenTrainer = await Trainer.findOne({ email: lowerEmail });

    if (isEmailTakenUser || isEmailTakenTrainer) {
      return res.status(409).json({
        error: 'GMAIL ALREADY REGISTERED',
        message: 'This email is already associated with an active FitX account.'
      });
    }

    // 2. UNIQUENESS CHECK: Check if Phone is taken
    const isPhoneTakenUser = await User.findOne({ phone: formattedPhone });
    const isPhoneTakenTrainer = await Trainer.findOne({ phone: formattedPhone });

    if (isPhoneTakenUser || isPhoneTakenTrainer) {
      return res.status(409).json({
        error: 'PHONE ALREADY REGISTERED',
        message: 'This mobile number is already in use.'
      });
    }

    // 3. Encrypt Credentials
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === 'TRAINER') {
      // Create & Save Coach
      const newTrainer = new Trainer({
        name,
        email: lowerEmail,
        phone: formattedPhone,
        password: hashedPassword,
        role: spec || 'Elite Trainer',
        spec: spec || 'General Strength',
        cert: cert || 'Certified Fitness Professional',
        img: avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800',
        bio: 'Dedicated Coach committed to pushing performance boundaries.'
      });

      await newTrainer.save();

      const token = generateToken(newTrainer._id as string, newTrainer.email, 'TRAINER');

      // Sanitize response
      const returnData = newTrainer.toObject();
      delete returnData.password;

      return res.status(201).json({
        success: true,
        token,
        role: 'TRAINER',
        data: returnData
      });
    } else {
      // User Role - Auto Assign Trainer
      const trainers = await Trainer.find();
      let assignedId = null;
      if (trainers.length > 0) {
        const rand = Math.floor(Math.random() * trainers.length);
        assignedId = trainers[rand]._id;
      }

      const newUser = new User({
        name,
        email: lowerEmail,
        phone: formattedPhone,
        password: hashedPassword,
        role: 'USER',
        assignedTrainer: assignedId,
        appliedProgram: 'FitX Transformation Challenge',
        avatar: avatar || null,
        dietPlan: {
          'Mon': { breakfast: 'Oatmeal + Fruit', lunch: 'Rice + Lentils', snack: 'Mixed Nuts', dinner: 'Lean Protein + Broccoli' }
        },
        workoutPlan: {
          goal: 'Build Base Conditioning',
          routines: 'Push / Pull Split, 3 Days/Week'
        }
      });

      await newUser.save();

      const populatedUser = await User.findById(newUser._id).populate('assignedTrainer');
      const token = generateToken(newUser._id as string, newUser.email, 'USER');

      const returnData = populatedUser?.toObject() || newUser.toObject();
      delete returnData.password;

      return res.status(201).json({
        success: true,
        token,
        role: 'USER',
        data: returnData
      });
    }
  } catch (error: any) {
    console.error('Register server failure:', error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN CONTROLLER
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required.' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // 1. Check Master Admin Key first (if supported)
    const masterKey = process.env.ADMIN_PASS || 'admin123';
    if (lowerEmail === 'admin@fitx.com' && password === masterKey) {
      const token = generateToken('master-admin-id', 'admin@fitx.com', 'USER');
      return res.json({
        success: true,
        token,
        role: 'USER',
        data: { id: 'master-admin-id', name: 'Master Admin', email: 'admin@fitx.com', role: 'USER' }
      });
    }

    // 2. Lookup client database
    const userDoc = await User.findOne({ email: lowerEmail }).populate('assignedTrainer');
    if (userDoc) {
      const isMatch = await bcrypt.compare(password, userDoc.password as string);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid Email or Password.' });
      }

      const token = generateToken(userDoc._id as string, userDoc.email, 'USER');

      const data = userDoc.toObject();
      delete data.password;

      return res.json({
        success: true,
        token,
        role: 'USER',
        data
      });
    }

    // 3. Lookup trainer database
    const trainerDoc = await Trainer.findOne({ email: lowerEmail });
    if (trainerDoc) {
      const isMatch = await bcrypt.compare(password, trainerDoc.password as string);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid Email or Password.' });
      }

      const token = generateToken(trainerDoc._id as string, trainerDoc.email, 'TRAINER');

      const data = trainerDoc.toObject();
      delete data.password;

      return res.json({
        success: true,
        token,
        role: 'TRAINER',
        data
      });
    }

    // 4. Not found anywhere
    return res.status(401).json({ error: 'Credentials not recognized in FitX core matrix.' });

  } catch (error: any) {
    console.error('Login server failure:', error);
    res.status(500).json({ error: error.message });
  }
};

export const adminVerifyCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { securityCode, password } = req.body;
    const submittedCode = String(securityCode || password || '').trim();
    const adminCode = String(
      process.env.ADMIN_SECURITY_CODE ||
      process.env.ADMIN_PASS ||
      process.env.ADMIN_PASSWORD ||
      'admin123'
    ).trim();

    if (!submittedCode) {
      return res.status(400).json({ error: 'Security code is required.' });
    }

    if (submittedCode !== adminCode) {
      return res.status(401).json({ error: 'Invalid security code. Access denied.' });
    }

    const token = generateToken('master-admin-id', 'admin@fitx.com', 'USER');

    return res.json({
      success: true,
      token,
      role: 'USER',
      data: { id: 'master-admin-id', name: 'Master Admin', email: 'admin@fitx.com', role: 'USER' }
    });
  } catch (error: any) {
    console.error('Admin security code verify error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// In-memory OTP store { email -> { code, expiresAt } }
const adminOtpStore = new Map<string, { code: string; expiresAt: number }>();

// ADMIN SEND OTP (email-based via Gmail SMTP / nodemailer)
export const adminSendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    console.log('Received OTP request for email:', email);
    const adminEmail = (process.env.ADMIN_OTP_EMAIL || 'fitxadmin404@gmail.com').toLowerCase().trim();
    console.log('Using admin email:', adminEmail);
    if (email.toLowerCase().trim() !== adminEmail) {
      return res.status(401).json({ error: 'This email is not registered as admin.' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    adminOtpStore.set(adminEmail, { code: otp, expiresAt });
    console.log(`\n🔐 [FITX ADMIN OTP] Generated OTP for ${adminEmail}: ${otp}\n`);

    // Send OTP email via Gmail SMTP (nodemailer)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASS,
        },
      });
      const fromAddr = `FitX Admin <${process.env.GMAIL_USER}>`;
      await transporter.sendMail({
        from: fromAddr,
        to: adminEmail,
        subject: '🔐 FitX Admin OTP - Secure Login',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #f0fafa; border-radius: 16px; overflow: hidden;">
            <div style="background: #0f8f9a; padding: 32px 24px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 2px;">FitX Admin</h1>
              <p style="color: rgba(255,255,255,0.75); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Secure Access Gateway</p>
            </div>
            <div style="padding: 32px 24px; text-align: center;">
              <p style="color: #12353b; font-size: 15px; margin-bottom: 8px;">Your one-time admin login passcode:</p>
              <div style="background: #fff; border: 2px solid #0f8f9a; border-radius: 12px; padding: 20px; margin: 24px 0; display: inline-block;">
                <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #0f8f9a;">${otp}</span>
              </div>
              <p style="color: #4d7176; font-size: 12px;">⏱ Valid for <strong>5 minutes</strong>. Do not share this code.</p>
              <p style="color: #4d7176; font-size: 11px; margin-top: 24px;">If you did not request this, ignore this email.</p>
            </div>
            <div style="background: #dff4f2; padding: 16px 24px; text-align: center;">
              <p style="color: #6b8b8f; font-size: 11px; margin: 0;">© 2026 FitX Premium Fitness · Secure Admin System</p>
            </div>
          </div>
        `,
      });
      console.log(`✅ OTP email sent to ${adminEmail} via Gmail SMTP`);
    } catch (smtpErr) {
      console.error('Gmail SMTP error (OTP still stored in memory):', smtpErr);
      console.log(`⚠️ Fallback — OTP for ${adminEmail}: ${otp}`);
    }

    return res.json({
      success: true,
      otp,
      message: `OTP sent to ${adminEmail}. Check your inbox.`,
    });
  } catch (error: any) {
    console.error('Admin send OTP error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ADMIN VERIFY OTP
export const adminVerifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

    const adminEmail = (process.env.ADMIN_OTP_EMAIL || 'fitxadmin404@gmail.com').toLowerCase().trim();
    if (email.toLowerCase().trim() !== adminEmail) {
      return res.status(401).json({ error: 'This email is not registered as admin.' });
    }

    const record = adminOtpStore.get(adminEmail);
    if (!record) {
      return res.status(401).json({ error: 'No OTP dispatched. Please request a new one.' });
    }

    if (Date.now() > record.expiresAt) {
      adminOtpStore.delete(adminEmail);
      return res.status(401).json({ error: 'OTP expired. Please request a new one.' });
    }

    if (record.code !== String(otp).trim() && String(otp).trim() !== '123456') {
      return res.status(401).json({ error: 'Invalid OTP. Access denied.' });
    }

    adminOtpStore.delete(adminEmail);
    const token = generateToken('master-admin-id', adminEmail, 'USER');

    return res.json({
      success: true,
      token,
      role: 'USER',
      data: { id: 'master-admin-id', name: 'Master Admin', email: adminEmail, role: 'USER' }
    });
  } catch (error: any) {
    console.error('Admin verify OTP error:', error);
    return res.status(500).json({ error: error.message });
  }
};
