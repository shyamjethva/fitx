// Core API Service Client for FitX Website

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  img: string;
  featured?: boolean;
  content?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  img: string;
  bio: string;
}

export interface Transformation {
  id: string;
  name: string;
  weeks: string;
  quote: string;
  before: string;
  after: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  tag: string;
  desc: string;
  iconName: string;
  img: string;
  color: string;
}

export interface Membership {
  id: string;
  idStr?: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  iconName: string;
  color: string;
  popular?: boolean;
  features: string[];
  facilities: string[];
}

export interface GalleryItem {
  id: string;
  type: string;
  title: string;
  img: string;
  isVideo?: boolean;
}

export interface ContactLead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  type?: string;
  plan?: string;
  message: string;
  timestamp?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  assignedTrainer?: Trainer;
  appliedProgram?: string;
  activePlan?: string;
  planDuration?: string;
  dietPlan?: any;
  workoutPlan?: any;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
}

export interface PageHeroData {
  id?: string;
  pageKey: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  ctaText: string;
  contentBlocks?: Record<string, any>;
}

export interface PromotionalOfferData {
  id?: string;
  title: string;
  subtitle: string;
  targetDate: string;
  bgColor?: string;
  textColor?: string;
  isActive: boolean;
}

export interface GymClient {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  features: string[];
  status: string;
  qrCodeUrl?: string;
}

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:5000/api';
const CMS_PREFIX = (import.meta as any).env?.VITE_CMS_PREFIX || '';

const asArray = <T>(value: T[] | undefined | null): T[] => Array.isArray(value) ? value : [];
const idOf = (item: any) => item?.id || item?._id || '';

const normalizeBlog = (item: any): Blog => ({
  ...item,
  id: idOf(item),
  img: item?.img || item?.image || '',
  author: item?.author || 'FitX Administration',
  featured: Boolean(item?.featured),
});

const normalizeGalleryItem = (item: any): GalleryItem => {
  const rawType = String(item?.type || item?.category || 'gym').toLowerCase();
  const type = rawType === 'photo' || rawType === 'image' ? 'gym' : rawType === 'video' ? 'reels' : rawType;
  return {
    ...item,
    id: idOf(item),
    type,
    title: item?.title || '',
    img: item?.img || item?.image || '',
    isVideo: item?.isVideo ?? String(type).toLowerCase() === 'video',
  };
};

const normalizeTransformation = (item: any): Transformation => ({
  ...item,
  id: idOf(item),
});

const normalizePageHero = (item: any): PageHeroData => ({
  ...item,
  id: idOf(item),
});

const normalizeOffer = (item: any): PromotionalOfferData => ({
  ...item,
  id: idOf(item),
  isActive: Boolean(item?.isActive),
});

const normalizeMembership = (item: any): Membership => {
  const name = item?.name || 'Membership';
  const description = item?.description || item?.desc || '';
  const features = Array.isArray(item?.features)
    ? item.features
    : String(description || '')
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean);

  return {
    ...item,
    id: idOf(item),
    name,
    price: item?.price != null ? `???${Number(item.price).toLocaleString('en-IN')}` : item?.price || '',
    period: item?.duration || item?.period || '',
    desc: item?.desc || description || `${name} membership plan`,
    iconName: item?.iconName || 'Trophy',
    color: item?.color || 'from-[#00E5FF]/20 to-transparent',
    popular: item?.popular ?? String(name).toLowerCase().includes('pro'),
    features: features.length > 0 ? features : ['Gym access', 'Member support'],
    facilities: Array.isArray(item?.facilities) ? item.facilities : features.slice(0, 5),
  };
};

// Generic API handler with resilience fallback
async function safeFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const token = localStorage.getItem('fitx-token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!res.ok) {
      // Attempt to parse error text/json for meaningful application displays
      let errMsg = `HTTP response error: ${res.status}`;
      try {
        const errPayload = await res.json();
        if (errPayload.error) errMsg = errPayload.error;
      } catch {}
      throw new Error(errMsg);
    }
    
    return await res.json() as T;
  } catch (err) {
    console.warn(`⚠️ API error querying ${endpoint}:`, err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  // Unified Realistic Authentication Engine
  login: (email: string, password: string) => safeFetch<{ success: boolean; token: string; role: string; data: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  registerProfile: (data: any) => safeFetch<{ success: boolean; token: string; role: string; data: any }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Google OAuth Login
  googleLogin: (credential: string) => safeFetch<{ success: boolean; token: string; role: string; data: any }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential })
  }),


  // Live Dashboard Messages Portal
  getChatHistory: (user1Id: string, user2Id: string) => safeFetch<any[]>(`/dashboard/messages?user1Id=${user1Id}&user2Id=${user2Id}`),
  
  sendChatMessage: (msgData: { senderId: string; senderRole: string; receiverId: string; receiverRole: string; text: string }) => safeFetch<any>('/dashboard/messages', {
    method: 'POST',
    body: JSON.stringify(msgData)
  }),

  // Trainer Console Tools
  getTrainerClients: (trainerId: string) => safeFetch<any[]>(`/trainer/${trainerId}/members`),
  
  updateClientPlans: (clientId: string, data: { dietPlan?: any; workoutPlan?: any }) => safeFetch<any>(`/trainer/client/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  getUsers: () => safeFetch<AdminUser[]>('/users'),

  updateUserProfile: (userId: string, data: { name?: string; email?: string; phone?: string; age?: number; weight?: number; height?: number; gender?: string; appliedProgram?: string; avatar?: string; activePlan?: string; planDuration?: string }) => safeFetch<any>(`/user/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  updateTrainerProfile: (trainerId: string, data: { name?: string; email?: string; spec?: string; cert?: string; bio?: string; img?: string }) => safeFetch<any>(`/trainer/${trainerId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Blogs API
  getBlogs: async (fallback?: Blog[]) => asArray(await safeFetch<any[]>(`${CMS_PREFIX}/blogs`, {}, fallback)).map(normalizeBlog),
  createBlog: async (data: Partial<Blog>) => normalizeBlog(await safeFetch<any>(`${CMS_PREFIX}/blogs`, { method: 'POST', body: JSON.stringify(data) })),
  updateBlog: async (id: string, data: Partial<Blog>) => normalizeBlog(await safeFetch<any>(`${CMS_PREFIX}/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) })),
  deleteBlog: (id: string) => safeFetch<{ success: boolean }>(`${CMS_PREFIX}/blogs/${id}`, { method: 'DELETE' }),

  // Trainers API
  getTrainers: (fallback?: Trainer[]) => safeFetch<Trainer[]>('/trainers', {}, fallback),
  createTrainer: (data: Partial<Trainer>) => safeFetch<Trainer>('/trainers', { method: 'POST', body: JSON.stringify(data) }),
  updateTrainer: (id: string, data: Partial<Trainer>) => safeFetch<Trainer>(`/trainers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrainer: (id: string) => safeFetch<{ success: boolean }>(`/trainers/${id}`, { method: 'DELETE' }),

  // Transformations API
  getTransformations: async (fallback?: Transformation[]) => asArray(await safeFetch<any[]>(`${CMS_PREFIX}/transformations`, {}, fallback)).map(normalizeTransformation),
  createTransformation: async (data: Partial<Transformation>) => normalizeTransformation(await safeFetch<any>(`${CMS_PREFIX}/transformations`, { method: 'POST', body: JSON.stringify(data) })),
  updateTransformation: async (id: string, data: Partial<Transformation>) => normalizeTransformation(await safeFetch<any>(`${CMS_PREFIX}/transformations/${id}`, { method: 'PUT', body: JSON.stringify(data) })),
  deleteTransformation: (id: string) => safeFetch<{ success: boolean }>(`${CMS_PREFIX}/transformations/${id}`, { method: 'DELETE' }),

  getPrograms: async (fallback?: Program[]) => {
    const data = await safeFetch<Program[]>('/programs', {}, fallback);
    return data && data.length > 0 ? data : (fallback || []);
  },
  createProgram: (data: Partial<Program>) => safeFetch<Program>('/programs', { method: 'POST', body: JSON.stringify(data) }),
  updateProgram: (id: string, data: Partial<Program>) => safeFetch<Program>(`/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProgram: (id: string) => safeFetch<{ success: boolean }>(`/programs/${id}`, { method: 'DELETE' }),

  // Memberships API
  getMemberships: async (fallback?: Membership[]) => asArray(await safeFetch<any[]>('/plans', {}, fallback)).map(normalizeMembership),
  createMembership: async (data: Partial<Membership>) => normalizeMembership(await safeFetch<any>('/plans', { method: 'POST', body: JSON.stringify(data) })),
  updateMembership: async (id: string, data: Partial<Membership>) => normalizeMembership(await safeFetch<any>(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) })),
  deleteMembership: (id: string) => safeFetch<{ success: boolean }>(`/plans/${id}`, { method: 'DELETE' }),

  // Gallery API
  getGallery: async (fallback?: GalleryItem[]) => asArray(await safeFetch<any[]>(`${CMS_PREFIX}/gallery`, {}, fallback)).map(normalizeGalleryItem),
  createGalleryItem: async (data: Partial<GalleryItem>) => normalizeGalleryItem(await safeFetch<any>(`${CMS_PREFIX}/gallery`, { method: 'POST', body: JSON.stringify(data) })),
  deleteGalleryItem: (id: string) => safeFetch<{ success: boolean }>(`${CMS_PREFIX}/gallery/${id}`, { method: 'DELETE' }),

  // Contacts API
  getContacts: () => safeFetch<ContactLead[]>('/contacts'),
  createContact: (data: ContactLead) => safeFetch<{ success: boolean; data: ContactLead }>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  deleteContact: (id: string) => safeFetch<{ success: boolean }>(`/contacts/${id}`, { method: 'DELETE' }),

  // Dynamic Page Heroes API
  getPageHeroes: async () => asArray(await safeFetch<any[]>(`${CMS_PREFIX}/page-heroes`)).map(normalizePageHero),
  updatePageHero: async (pageKey: string, data: Partial<PageHeroData>) => normalizePageHero(await safeFetch<any>(`${CMS_PREFIX}/page-heroes/${pageKey}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })),

  // Dynamic Promotional Offers Banner
  getPromotionalOffer: async () => normalizeOffer(await safeFetch<any>(`${CMS_PREFIX}/promotional-offer`)),
  updatePromotionalOffer: async (data: Partial<PromotionalOfferData>) => normalizeOffer(await safeFetch<any>(`${CMS_PREFIX}/promotional-offer`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })),

  // Dynamic AI Plan Generation
  generateAIPlan: (data: { memberName: string; goal: string; activityLevel: string; workoutSplit: string; dietType: string; apiKey?: string }) => safeFetch<{ diet: string; workout: string }>('/ai/generate', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Admin Security Code Authentication
  adminVerifyCode: (securityCode: string) => safeFetch<{ success: boolean; token: string; role: string; data: any }>('/auth/admin/verify-code', {
    method: 'POST',
    body: JSON.stringify({ securityCode })
  }),

  // Admin Email OTP Authentication (real email via Resend — configure ADMIN_OTP_EMAIL in .env)
  adminSendOtp: (email: string) => safeFetch<{ success: boolean; message: string }>('/auth/admin/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  adminVerifyOtp: (email: string, otp: string) => safeFetch<{ success: boolean; token: string; role: string; data: any }>('/auth/admin/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  }),

  // Gym Client API (White-label)
  getClients: () => safeFetch<GymClient[]>('/clients'),
  createClient: (data: Partial<GymClient>) => safeFetch<GymClient>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: Partial<GymClient>) => safeFetch<GymClient>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id: string) => safeFetch<{ success: boolean }>(`/clients/${id}`, { method: 'DELETE' }),

  uploadAsset: (file: { filename: string; base64: string }) => safeFetch<{ url: string }>('/upload', {
    method: 'POST',
    body: JSON.stringify(file)
  }),
};
