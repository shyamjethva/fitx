import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Models
import Blog from '../models/Blog.js';
import Trainer from '../models/Trainer.js';
import Transformation from '../models/Transformation.js';
import Program from '../models/Program.js';
import Membership from '../models/Membership.js';
import Gallery from '../models/Gallery.js';
import PageHero from '../models/PageHero.js';

// Load environment configuration
dotenv.config();

// Define initial datasets matching original persistent matrix
const SEED_BLOGS = [
  {
    title: "The Ultimate Guide to Hypertrophy: Science-Backed Growth",
    excerpt: "Learn the specific rep ranges, volume, and recovery strategies needed to maximize muscle protein synthesis.",
    category: "Training",
    author: "Dr. Alex Rivier",
    date: "May 09, 2026",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    featured: true
  },
  {
    title: "Macronutrient Timing: Does It Really Matter?",
    excerpt: "Debunking the myths around the anabolic window and exploring optimal timing for carbs and protein.",
    category: "Nutrition",
    author: "Sarah Chen",
    date: "May 08, 2026",
    readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Mastering the Mindset: The Psychology of Consistency",
    excerpt: "How to build unbreakable habits and stay motivated when the initial excitement fades away.",
    category: "Mindset",
    author: "Marcus Thorne",
    date: "May 07, 2026",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Recovery Secrets: Sleep, Hydration, and Active Rest",
    excerpt: "Why your progress happens outside the gym and how to optimize your rest days for peak performance.",
    category: "Recovery",
    author: "Elena Vance",
    date: "May 06, 2026",
    readTime: "7 min read",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "High-Intensity Interval Training for Busy Professionals",
    excerpt: "Maximum results in minimum time. A 20-minute HIIT protocol you can do anywhere.",
    category: "Training",
    author: "James Wilson",
    date: "May 05, 2026",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800"
  }
];

const SEED_TRAINERS = [
  {
    name: 'MARCUS VANCE',
    role: 'Physique Expert',
    email: 'marcus@fitx.com',
    phone: '+91 90000 00001',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    bio: 'Mandated by strength. Driven by precision.'
  },
  {
    name: 'SARAH CHENG',
    role: 'HIIT Lead',
    email: 'sarah@fitx.com',
    phone: '+91 90000 00002',
    img: 'https://images.unsplash.com/photo-1548691906-c215a091934c?auto=format&fit=crop&q=80&w=800',
    bio: 'Explosive power, unmatched endurance.'
  },
  {
    name: 'RAUL MENDEZ',
    role: 'Strength Specialist',
    email: 'raul@fitx.com',
    phone: '+91 90000 00003',
    img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=800',
    bio: 'Heavy lifting, pure focus, total results.'
  },
  {
    name: 'ELENA ROSS',
    role: 'Mobility Expert',
    email: 'elena@fitx.com',
    phone: '+91 90000 00004',
    img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    bio: 'Mastering movement, unlocking potential.'
  }
];

const SEED_TRANSFORMATIONS = [
  {
    name: 'CHRIS J.',
    weeks: '12',
    quote: "FitX didn't just change my body; it changed my entire mindset.",
    before: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'MAY L.',
    weeks: '24',
    quote: 'From cardio-only to lifting twice my bodyweight. Elite trainers.',
    before: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1548691906-c215a091934c?auto=format&fit=crop&q=80&w=800'
  }
];

const SEED_PROGRAMS = [
  {
    title: "Weight Loss",
    slug: "weight-loss",
    tag: "WEIGHT LOSS",
    desc: "Targeted high-intensity workouts designed to maximize calorie burn and metabolic rate.",
    iconName: "Gauge",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF7200]/40 to-transparent"
  },
  {
    title: "Muscle Gain",
    slug: "muscle-gain",
    tag: "MUSCLE GAIN",
    desc: "Hypertrophy-focused training programs for building maximum lean muscle mass.",
    iconName: "Dumbbell",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF8B10]/40 to-transparent"
  },
  {
    title: "Cardio",
    slug: "cardio",
    tag: "CARDIO",
    desc: "Improve your cardiovascular health and stamina with our elite cardio circuits.",
    iconName: "HeartPulse",
    img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF7200]/40 to-transparent"
  },
  {
    title: "Yoga",
    slug: "yoga",
    tag: "YOGA",
    desc: "Balance your mind and body with flows designed for flexibility and mindfulness.",
    iconName: "Flower",
    img: "/Yoga.jpg",
    color: "from-[#FF9942]/40 to-transparent"
  },
  {
    title: "Diet Plan",
    slug: "diet-plan",
    tag: "MUSCLE GAIN",
    desc: "Personalized nutrition strategies to complement your training and goals.",
    iconName: "Apple",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF8B10]/40 to-transparent"
  },
  {
    title: "Sports",
    slug: "sports",
    tag: "ATHLETIC",
    desc: "Drills and conditioning to enhance your performance in specific competitive sports.",
    iconName: "Target",
    img: "/athletic.png",
    color: "from-[#FF7200]/40 to-transparent"
  }
];

const SEED_MEMBERSHIPS = [
  {
    idStr: 'starter',
    name: "Starter",
    price: "$49",
    period: "per 6 months",
    desc: "Essential access for those starting their fitness journey.",
    iconName: "Dumbbell",
    color: "from-[#FF8B10]/20 to-transparent",
    features: [
      "Access to Gym Floor",
      "Standard Locker Access",
      "2 Group Classes / Month",
      "Initial Fitness Assessment",
      "Mobile App Tracking"
    ],
    facilities: [
      "Cardio Loft",
      "Free Weights Area",
      "Showers & Saunas",
      "Parking"
    ]
  },
  {
    idStr: 'pro',
    name: "Pro",
    price: "$89",
    period: "per 6 months",
    desc: "Our most popular plan for dedicated athletes.",
    iconName: "Trophy",
    color: "from-[#FF7200]/20 to-transparent",
    popular: true,
    features: [
      "Unlimited Gym Access",
      "Unlimited Group Classes",
      "1 Personal Training / Month",
      "Nutrition Consultation",
      "Priority Booking",
      "Pulse Heart-Rate Monitor"
    ],
    facilities: [
      "All Starter Facilities",
      "Premium Strength Zone",
      "Recovery Lounge Access",
      "Smart Lockers",
      "Juice Bar Discounts"
    ]
  },
  {
    idStr: 'elite',
    name: "Elite",
    price: "$149",
    period: "per 6 months",
    desc: "The ultimate fitness experience with zero compromises.",
    iconName: "Crown",
    color: "from-[#FF7200]/20 to-transparent",
    features: [
      "24/7 VIP Access",
      "Unlimited 1-on-1 Coaching",
      "Custom Macro Planning",
      "Physiotherapy Sessions",
      "Guest Passes (2/Month)",
      "Exclusive Elite Events"
    ],
    facilities: [
      "All Pro Facilities",
      "Private Training Studio",
      "Cryotherapy Chamber",
      "VIP Lounge & Workspaces",
      "Complimentary Laundry"
    ]
  }
];

const SEED_GALLERY = [
  { type: 'gym', title: "Elite Platform", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200" },
  { type: 'gym', title: "Momentum Grid", img: "/gym2.jpeg" },
  { type: 'gym', title: "Iron Corner", img: "/gym3.jpeg" },
  { type: 'reels', title: "Pulse Rush", img: "/vid2.mp4", isVideo: true },
  { type: 'reels', title: "Functional Drive", img: "/vid3.mp4", isVideo: true },
  { type: 'reels', title: "Peak Perform", img: "/vid4.mp4", isVideo: true },
  { type: '3d', title: "Chest Press XR", img: "/3d1.png" },
  { type: '3d', title: "Leg Press Core", img: "/3d2.png" },
  { type: '3d', title: "Cable Multi Station", img: "/3d3.png" },
  { type: '3d', title: "Smith Machine Pro", img: "/3d4.png" },
  { type: '3d', title: "Dumbbell Set X", img: "/3d5.png" },
  { type: '3d', title: "Squat Rack Elite", img: "/3d6.png" },
  { type: '3d', title: "Bench Press Pro", img: "/3d7.png" },
];

const SEED_PAGE_HEROES = [
  {
    pageKey: 'main_home',
    title: 'FitX',
    subtitle: 'WE ARE',
    description: 'A fitness movement that is worth\nbreaking a sweat for',
    image: '/hero-bg.mp4',
    ctaText: 'EXPLORE fitxpass'
  },
  {
    pageKey: 'fitness',
    title: 'fitXpass',
    subtitle: 'YOUR KEY TO THE FITTEST YOU',
    description: 'Unlimited access to best group classes, elite gyms, and dynamic digital home workouts.',
    image: '/hero-bg.webp',
    ctaText: 'TRY FOR FREE'
  },
  {
    pageKey: 'elite',
    title: 'fitXpass ELITE',
    subtitle: 'Starting at ₹1233 / month*',
    description: 'Unlimited access to at-centre group classes\nAll ELITE & PRO gyms',
    image: '/elite-hero.png',
    ctaText: 'TRY FOR FREE'
  },
  {
    pageKey: 'pro',
    title: 'fitXpass PRO',
    subtitle: 'Starting at ₹933 / month*',
    description: 'Access to all PRO gyms\n2 sessions / month at ELITE gyms',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    ctaText: 'TRY FOR FREE'
  },
  {
    pageKey: 'home',
    title: 'fitX at Home',
    subtitle: 'Calorie Tracking & Video Coaching',
    description: 'Conquer HIIT, Yoga, & Strength splits anywhere\nComplete daily check-ins & macro charts',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
    ctaText: 'START TRIAL'
  },
  {
    pageKey: 'transform',
    title: 'fitX Transform',
    subtitle: 'Lose weight for good',
    description: 'Personal habit coach & strict macro diets\nDetailed weekly progress audits',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200',
    ctaText: 'EXPLORE TRANSFORMS'
  },
  {
    pageKey: 'bootcamp',
    title: 'fitX Bootcamp',
    subtitle: 'Fast-track your body transformation',
    description: 'Extremely intensive functional drill sets\nHigh-density team motivation dynamics',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    ctaText: 'ENROLL NOW'
  },
  {
    pageKey: 'memberships',
    title: 'fitXpass',
    subtitle: 'YOUR KEY TO THE FITTEST YOU',
    description: 'Unlimited access to best group classes, elite gyms, and dynamic digital home workouts.',
    image: '/hero-bg.webp',
    ctaText: 'TRY FOR FREE'
  },
  {
    pageKey: 'programs',
    title: 'Transform Your',
    subtitle: 'Reality',
    description: 'Choose a path engineered for results. Elite training programs designed by world-class athletes.',
    image: '/all_prg.jpeg',
    ctaText: 'EXPLORE PATHWAY'
  }
];

export const runSeeder = async (): Promise<void> => {
  try {
    console.log('⚡ Running Data Integrity Validation Seeder...');

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('🌱 Seeding Blogs...');
      await Blog.insertMany(SEED_BLOGS);
    }

    const trainerCount = await Trainer.countDocuments();
    if (trainerCount === 0) {
      console.log('🌱 Seeding Trainers...');
      const defaultPass = bcrypt.hashSync('trainer123', 10);
      const trainersWithPass = SEED_TRAINERS.map(t => ({
        ...t,
        password: defaultPass
      }));
      await Trainer.insertMany(trainersWithPass);
    }

    const transCount = await Transformation.countDocuments();
    if (transCount === 0) {
      console.log('🌱 Seeding Success Transformations...');
      await Transformation.insertMany(SEED_TRANSFORMATIONS);
    }

    const programCount = await Program.countDocuments();
    if (programCount === 0) {
      console.log('🌱 Seeding Programs...');
      await Program.insertMany(SEED_PROGRAMS);
    }

    const memberCount = await Membership.countDocuments();
    if (memberCount === 0) {
      console.log('🌱 Seeding Membership Levels...');
      await Membership.insertMany(SEED_MEMBERSHIPS);
    }

    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      console.log('🌱 Seeding Visual Gallery Masonry...');
      await Gallery.insertMany(SEED_GALLERY);
    }

    const heroCount = await PageHero.countDocuments();
    if (heroCount === 0) {
      console.log('🌱 Seeding Page Hero Custom Configurations...');
      await PageHero.insertMany(SEED_PAGE_HEROES);
    } else {
      const mainHomeHero = await PageHero.findOne({ pageKey: 'main_home' });
      if (!mainHomeHero) {
        console.log('🌱 Seeding missing main_home page hero configuration...');
        await PageHero.create({
          pageKey: 'main_home',
          title: 'FitX',
          subtitle: 'WE ARE',
          description: 'A fitness movement that is worth\nbreaking a sweat for',
          image: '/hero-bg.mp4',
          ctaText: 'EXPLORE fitxpass'
        });
      }

      const membershipsHero = await PageHero.findOne({ pageKey: 'memberships' });
      if (!membershipsHero) {
        console.log('🌱 Seeding missing memberships page hero configuration...');
        await PageHero.create({
          pageKey: 'memberships',
          title: 'fitXpass',
          subtitle: 'YOUR KEY TO THE FITTEST YOU',
          description: 'Unlimited access to best group classes, elite gyms, and dynamic digital home workouts.',
          image: '/hero-bg.webp',
          ctaText: 'TRY FOR FREE'
        });
      }

      const programsHero = await PageHero.findOne({ pageKey: 'programs' });
      if (!programsHero) {
        console.log('🌱 Seeding missing programs page hero configuration...');
        await PageHero.create({
          pageKey: 'programs',
          title: 'Transform Your',
          subtitle: 'Reality',
          description: 'Choose a path engineered for results. Elite training programs designed by world-class athletes.',
          image: '/all_prg.jpeg',
          ctaText: 'EXPLORE PATHWAY'
        });
      }
    }

    console.log('✅ Database Seeding State Confirmed!');
  } catch (err) {
    console.error('❌ Database Pre-Flight Seeding Interrupted:', err);
  }
};

// Standalone runtime execution wrapper
if (process.argv[1] === fileURLToPath(import.meta.url) || process.argv[1]?.endsWith('seed.ts')) {
  const executeStandalone = async () => {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitx';
      await mongoose.connect(uri);
      console.log('🔋 Database linked for standalone seeder operations.');
      await runSeeder();
      await mongoose.connection.close();
      console.log('🪫 Uplink terminated cleanly.');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  };
  executeStandalone();
}
