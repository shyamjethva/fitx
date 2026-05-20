import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
export async function readData<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err) {
    // Seed the default value if it doesn't exist
    await writeData(filename, defaultValue);
    return defaultValue;
  }
}

export async function writeData<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// SEED DATA DEFINITIONS
export const SEED_BLOGS = [
  {
    id: 1,
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
    id: 2,
    title: "Macronutrient Timing: Does It Really Matter?",
    excerpt: "Debunking the myths around the anabolic window and exploring optimal timing for carbs and protein.",
    category: "Nutrition",
    author: "Sarah Chen",
    date: "May 08, 2026",
    readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Mastering the Mindset: The Psychology of Consistency",
    excerpt: "How to build unbreakable habits and stay motivated when the initial excitement fades away.",
    category: "Mindset",
    author: "Marcus Thorne",
    date: "May 07, 2026",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Recovery Secrets: Sleep, Hydration, and Active Rest",
    excerpt: "Why your progress happens outside the gym and how to optimize your rest days for peak performance.",
    category: "Recovery",
    author: "Elena Vance",
    date: "May 06, 2026",
    readTime: "7 min read",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "High-Intensity Interval Training for Busy Professionals",
    excerpt: "Maximum results in minimum time. A 20-minute HIIT protocol you can do anywhere.",
    category: "Training",
    author: "James Wilson",
    date: "May 05, 2026",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "The Role of Micronutrients in Athletic Performance",
    excerpt: "Vitamins and minerals you might be missing that are critical for energy metabolism.",
    category: "Nutrition",
    author: "Dr. Alex Rivier",
    date: "May 04, 2026",
    readTime: "10 min read",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  }
];

export const SEED_TRAINERS = [
  {
    id: 1,
    name: 'MARCUS VANCE',
    role: 'Physique Expert',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    bio: 'Mandated by strength. Driven by precision.'
  },
  {
    id: 2,
    name: 'SARAH CHENG',
    role: 'HIIT Lead',
    img: 'https://images.unsplash.com/photo-1548691906-c215a091934c?auto=format&fit=crop&q=80&w=800',
    bio: 'Explosive power, unmatched endurance.'
  },
  {
    id: 3,
    name: 'RAUL MENDEZ',
    role: 'Strength Specialist',
    img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?auto=format&fit=crop&q=80&w=800',
    bio: 'Heavy lifting, pure focus, total results.'
  },
  {
    id: 4,
    name: 'ELENA ROSS',
    role: 'Mobility Expert',
    img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    bio: 'Mastering movement, unlocking potential.'
  }
];

export const SEED_TRANSFORMATIONS = [
  {
    id: 1,
    name: 'CHRIS J.',
    weeks: '12',
    quote: "FitX didn't just change my body; it changed my entire mindset.",
    before: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    name: 'MAY L.',
    weeks: '24',
    quote: 'From cardio-only to lifting twice my bodyweight. Elite trainers.',
    before: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    after: 'https://images.unsplash.com/photo-1548691906-c215a091934c?auto=format&fit=crop&q=80&w=800'
  }
];

export const SEED_PROGRAMS = [
  {
    id: 1,
    title: "Weight Loss",
    slug: "weight-loss",
    tag: "WEIGHT LOSS",
    desc: "Targeted high-intensity workouts designed to maximize calorie burn and metabolic rate.",
    iconName: "Gauge",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF7200]/40 to-transparent"
  },
  {
    id: 2,
    title: "Muscle Gain",
    slug: "muscle-gain",
    tag: "MUSCLE GAIN",
    desc: "Hypertrophy-focused training programs for building maximum lean muscle mass.",
    iconName: "Dumbbell",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF8B10]/40 to-transparent"
  },
  {
    id: 3,
    title: "Cardio",
    slug: "cardio",
    tag: "CARDIO",
    desc: "Improve your cardiovascular health and stamina with our elite cardio circuits.",
    iconName: "HeartPulse",
    img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF7200]/40 to-transparent"
  },
  {
    id: 4,
    title: "Yoga",
    slug: "yoga",
    tag: "YOGA",
    desc: "Balance your mind and body with flows designed for flexibility and mindfulness.",
    iconName: "Flower",
    img: "/Yoga.jpg",
    color: "from-[#FF9942]/40 to-transparent"
  },
  {
    id: 5,
    title: "Diet Plan",
    slug: "diet-plan",
    tag: "MUSCLE GAIN",
    desc: "Personalized nutrition strategies to complement your training and goals.",
    iconName: "Apple",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    color: "from-[#FF8B10]/40 to-transparent"
  },
  {
    id: 6,
    title: "Sports",
    slug: "sports",
    tag: "ATHLETIC",
    desc: "Drills and conditioning to enhance your performance in specific competitive sports.",
    iconName: "Target",
    img: "/athletic.png",
    color: "from-[#FF7200]/40 to-transparent"
  }
];

export const SEED_MEMBERSHIPS = [
  {
    id: 'starter',
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
    id: 'pro',
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
    id: 'elite',
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

export const SEED_GALLERY = [
  { id: 1, type: 'gym', title: "Elite Platform", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200" },
  { id: 20, type: 'gym', title: "Momentum Grid", img: "/gym2.jpeg" },
  { id: 21, type: 'gym', title: "Iron Corner", img: "/gym3.jpeg" },
  { id: 5, type: 'reels', title: "Pulse Rush", img: "/vid2.mp4", isVideo: true },
  { id: 6, type: 'reels', title: "Functional Drive", img: "/vid3.mp4", isVideo: true },
  { id: 7, type: 'reels', title: "Peak Perform", img: "/vid4.mp4", isVideo: true },
  { id: 8, type: '3d', title: "Chest Press XR", img: "/3d1.png" },
  { id: 9, type: '3d', title: "Leg Press Core", img: "/3d2.png" },
  { id: 10, type: '3d', title: "Cable Multi Station", img: "/3d3.png" },
  { id: 11, type: '3d', title: "Smith Machine Pro", img: "/3d4.png" },
  { id: 12, type: '3d', title: "Dumbbell Set X", img: "/3d5.png" },
  { id: 13, type: '3d', title: "Squat Rack Elite", img: "/3d6.png" },
  { id: 14, type: '3d', title: "Bench Press Pro", img: "/3d7.png" },
];
