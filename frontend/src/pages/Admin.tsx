import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  CalendarX2,
  Dumbbell,
  Edit3,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Megaphone,
  Package,
  RefreshCw,
  Save,
  Search,
  UserCircle2,
  Users,
  ShieldAlert,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  UserPlus,
  Users2,
  Newspaper,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';
import {
  api,
  AdminUser,
  ContactLead,
  GalleryItem,
  Membership,
  PageHeroData,
  PromotionalOfferData,
  Trainer,
  Blog,
  GymClient,
} from '../lib/api';
import { ClientsPanel } from './ClientsPanel';

type AdminTab =
  | 'overview'
  | 'profile'
  | 'users'
  | 'heroes'
  | 'offers'
  | 'packages'
  | 'gallery'
  | 'retention'
  | 'inquiries'
  | 'trainers'
  | 'ai'
  | 'analytics'
  | 'blogs'
  | 'clients';

type AiPlanForm = {
  memberName: string;
  goal: string;
  activityLevel: string;
  workoutSplit: string;
  dietType: string;
};

type AdminMetrics = {
  activeLeads: number;
  users: number;
  heroPages: number;
  packages: number;
  trainers: number;
  inquiriesThisWeek: number;
  retentionRate: number;
  absentees: number;
  packageRevenue: number;
  expenses: number;
  profit: number;
};

const navItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: UserCircle2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'heroes', label: 'Hero Content', icon: ImageIcon },
  { id: 'offers', label: 'Offer Section', icon: Megaphone },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'gallery', label: 'Gallery', icon: Boxes },
  { id: 'blogs', label: 'Blogs Management', icon: Newspaper },
  { id: 'retention', label: 'Retention', icon: CalendarX2 },
  { id: 'inquiries', label: 'Inquiries', icon: Mail },
  { id: 'trainers', label: 'Trainers', icon: Users2 },
  { id: 'ai', label: 'AI Plans', icon: Bot },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'clients', label: 'Client Mgmt', icon: Briefcase },
];

const defaultOffer: PromotionalOfferData = {
  title: '',
  subtitle: '',
  targetDate: '',
  bgColor: '#00E5FF',
  textColor: '#0A0F24',
  isActive: false,
};

const defaultAiForm: AiPlanForm = {
  memberName: '',
  goal: 'Fat loss and lean strength',
  activityLevel: 'Moderate',
  workoutSplit: '5 days/week',
  dietType: 'High protein vegetarian',
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@fitx.com');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState('');
  const [query, setQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [heroes, setHeroes] = useState<PageHeroData[]>([]);
  const [offer, setOffer] = useState<PromotionalOfferData>(defaultOffer);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);

  const [gymClients, setGymClients] = useState<GymClient[]>([]);
  const [editingClient, setEditingClient] = useState<Partial<GymClient> | null>(null);

  const [editingTrainer, setEditingTrainer] = useState<Partial<Trainer> | null>(null);
  const [aiForm, setAiForm] = useState<AiPlanForm>(defaultAiForm);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [aiResult, setAiResult] = useState<{ diet: string; workout: string } | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem('fitx_admin_profile');
    return saved ? JSON.parse(saved) as { name: string; email: string; avatar: string } : {
      name: 'Admin',
      email: 'admin@fitx.com',
      avatar: '',
    };
  });

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) || null,
    [selectedUserId, users]
  );

  useEffect(() => {
    if (sessionStorage.getItem('fitx_admin_token') === 'AUTHORIZED_SESSION') {
      setIsAuthenticated(true);
      loadAllData();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [contactsData, usersData, trainersData, heroesData, offerData, membershipsData, galleryData, blogsData, clientsData] = await Promise.all([
        api.getContacts().catch(() => []),
        api.getUsers().catch(() => []),
        api.getTrainers().catch(() => []),
        api.getPageHeroes().catch(() => []),
        api.getPromotionalOffer().catch(() => defaultOffer),
        api.getMemberships().catch(() => []),
        api.getGallery().catch(() => []),
        api.getBlogs().catch(() => []),
        api.getClients().catch(() => []),
      ]);

      if (!heroesData.find((h: any) => h.pageKey === 'global_settings')) {
        heroesData.push({
          pageKey: 'global_settings',
          title: 'Global Settings',
          subtitle: '',
          description: '',
          image: '', // Use for Global QR Code
          video: '', // Use for Global Logo
          ctaText: '',
          contentBlocks: {}
        });
      }

      setContacts(contactsData);
      setUsers(usersData);
      setTrainers(trainersData);
      setHeroes(heroesData);
      setOffer(offerData || defaultOffer);
      setMemberships(membershipsData);
      setGalleryItems(galleryData);
      setBlogs(blogsData);
      setGymClients(clientsData);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    // 1. Calculate realistic base packages price (converted to INR e.g. x83)
    const baseRevenue = memberships.reduce((sum, plan) => sum + parsePrice(plan.price), 0) * 83;
    // 2. Scale by active user count to get true dynamic operational revenue
    const packageRevenue = baseRevenue * Math.max(1, users.length);
    const inquiriesThisWeek = contacts.filter((contact) => isRecent(contact.timestamp, 7)).length;
    const retentionRate = Math.min(96, 72 + trainers.length * 3 + Math.min(memberships.length, 6));
    const absentees = Math.max(0, contacts.length - inquiriesThisWeek);
    const expenses = Math.round(packageRevenue * 0.38 + trainers.length * 12000);
    const profit = Math.max(0, packageRevenue - expenses);

    return {
      activeLeads: contacts.length,
      users: users.length,
      heroPages: heroes.length,
      packages: memberships.length,
      trainers: trainers.length,
      inquiriesThisWeek,
      retentionRate,
      absentees,
      packageRevenue,
      expenses,
      profit,
    };
  }, [contacts, heroes, memberships, trainers, users]);

  const filteredContacts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) =>
      [contact.name, contact.email, contact.phone, contact.type, contact.plan, contact.message]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [contacts, query]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.adminVerifyCode(password);
      if (res.success) {
        sessionStorage.setItem('fitx_admin_token', 'AUTHORIZED_SESSION');
        setIsAuthenticated(true);
        loadAllData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SERVER OFFLINE OR ACCESS CODE REJECTED.');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpSending(true);
    try {
      const res = await api.adminSendOtp(adminEmail);
      if (res.success) {
        setOtpSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Check your email or server.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.adminVerifyOtp(adminEmail, otp);
      if (res.success) {
        sessionStorage.setItem('fitx_admin_token', 'AUTHORIZED_SESSION');
        setIsAuthenticated(true);
        loadAllData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Access denied.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('fitx_admin_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  const updateHeroLocal = (pageKey: string, patch: Partial<PageHeroData>) => {
    setHeroes((items) => items.map((hero) => hero.pageKey === pageKey ? { ...hero, ...patch } : hero));
  };

  const saveHero = async (hero: PageHeroData) => {
    setSavingKey(`hero-${hero.pageKey}`);
    try {
      const updated = await api.updatePageHero(hero.pageKey, hero);
      updateHeroLocal(hero.pageKey, updated);
    } finally {
      setSavingKey('');
    }
  };

  const uploadFile = async (file: File) => {
    const base64 = await fileToBase64(file);
    const uploaded = await api.uploadAsset({ filename: file.name, base64 });
    return uploaded.url;
  };

  const uploadHeroAsset = async (hero: PageHeroData, field: 'image' | 'video', file?: File) => {
    if (!file) return;
    setSavingKey(`upload-${hero.pageKey}-${field}`);
    try {
      const url = await uploadFile(file);
      updateHeroLocal(hero.pageKey, { [field]: url });
    } finally {
      setSavingKey('');
    }
  };

  const uploadAdminAvatar = async (file?: File) => {
    if (!file) return;
    setSavingKey('profile-avatar');
    try {
      const url = await uploadFile(file);
      setAdminProfile((profile) => ({ ...profile, avatar: url }));
    } finally {
      setSavingKey('');
    }
  };

  const saveAdminProfile = () => {
    localStorage.setItem('fitx_admin_profile', JSON.stringify(adminProfile));
  };

  const openAiForUser = (user: AdminUser) => {
    setSelectedUserId(user.id);
    setAiForm((form) => ({
      ...form,
      memberName: user.name || form.memberName,
      goal: user.activePlan ? `${user.activePlan} fitness progress` : form.goal,
      activityLevel: user.appliedProgram || form.activityLevel,
    }));
    setAiResult(null);
    setActiveTab('ai');
  };

  const saveOffer = async () => {
    setSavingKey('offer');
    try {
      const updated = await api.updatePromotionalOffer(offer);
      setOffer(updated);
    } finally {
      setSavingKey('');
    }
  };

  const updateMembershipLocal = (id: string, patch: Partial<Membership>) => {
    setMemberships((items) => items.map((plan) => plan.id === id ? { ...plan, ...patch } : plan));
  };

  const saveMembership = async (plan: Membership) => {
    setSavingKey(`membership-${plan.id}`);
    try {
      const updated = await api.updateMembership(plan.id, plan);
      updateMembershipLocal(plan.id, updated);
    } finally {
      setSavingKey('');
    }
  };

  const deleteContact = async (id?: string) => {
    if (!id || !window.confirm('Delete this inquiry?')) return;
    await api.deleteContact(id);
    setContacts((items) => items.filter((item) => item.id !== id));
  };

  const saveTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainer) return;
    setSavingKey('trainer');
    try {
      if (editingTrainer.id) {
        const updated = await api.updateTrainer(editingTrainer.id, editingTrainer);
        setTrainers((items) => items.map((trainer) => trainer.id === updated.id ? updated : trainer));
      } else {
        const created = await api.createTrainer(editingTrainer);
        setTrainers((items) => [...items, created]);
      }
      setEditingTrainer(null);
    } finally {
      setSavingKey('');
    }
  };

  const deleteTrainer = async (id: string) => {
    if (!window.confirm('Delete this trainer?')) return;
    await api.deleteTrainer(id);
    setTrainers((items) => items.filter((trainer) => trainer.id !== id));
  };

  const generateAiPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setAiResult(null);
    try {
      const result = await api.generateAIPlan(aiForm);
      setAiResult(result);
      if (selectedUserId) {
        const updated = await api.updateClientPlans(selectedUserId, {
          dietPlan: result.diet,
          workoutPlan: result.workout,
        });
        setUsers((items) => items.map((user) => user.id === selectedUserId ? { ...user, ...updated, dietPlan: result.diet, workoutPlan: result.workout } : user));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unable to generate AI plan right now.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --- GALLERY CRUD ---
  const addGalleryItem = async (item: Partial<GalleryItem>) => {
    setSavingKey('gallery-add');
    try {
      const created = await api.createGalleryItem(item);
      setGalleryItems((prev) => [created, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add gallery item.');
    } finally {
      setSavingKey('');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await api.deleteGalleryItem(id);
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete gallery item.');
    }
  };

  const uploadGalleryImage = async (file?: File) => {
    if (!file) return;
    setSavingKey('gallery-upload');
    try {
      const base64 = await fileToBase64(file);
      const { url } = await api.uploadAsset({ filename: `gallery-${Date.now()}.${file.name.split('.').pop()}`, base64 });
      return url;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed.');
      return '';
    } finally {
      setSavingKey('');
    }
  };

  // --- BLOGS CRUD ---
  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    setSavingKey('blog');
    try {
      if (editingBlog.id) {
        const updated = await api.updateBlog(editingBlog.id, editingBlog);
        setBlogs((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await api.createBlog(editingBlog);
        setBlogs((items) => [created, ...items]);
      }
      setEditingBlog(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save blog post.');
    } finally {
      setSavingKey('');
    }
  };

  const deleteBlog = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.deleteBlog(id);
      setBlogs((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete blog.');
    }
  };

  const uploadBlogImage = async (file?: File) => {
    if (!file) return;
    setSavingKey('blog-upload');
    try {
      const base64 = await fileToBase64(file);
      const { url } = await api.uploadAsset({ filename: `blog-${Date.now()}.${file.name.split('.').pop()}`, base64 });
      if (editingBlog) {
        setEditingBlog((prev) => prev ? { ...prev, img: url } : { img: url });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setSavingKey('');
    }
  };

  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setSavingKey('client');
    try {
      if (editingClient.id) {
        const updated = await api.updateClient(editingClient.id, editingClient);
        setGymClients((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await api.createClient(editingClient);
        setGymClients((items) => [created, ...items]);
      }
      setEditingClient(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save client.');
    } finally {
      setSavingKey('');
    }
  };

  const deleteClient = async (id: string) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await api.deleteClient(id);
      setGymClients((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete client.');
    }
  };

  const uploadClientAsset = async (type: 'logo' | 'qr', file?: File) => {
    if (!file) return;
    const saveKey = type === 'logo' ? 'client-upload' : 'client-qr-upload';
    setSavingKey(saveKey);
    try {
      const base64 = await fileToBase64(file);
      const { url } = await api.uploadAsset({ filename: `client-${type}-${Date.now()}.${file.name.split('.').pop()}`, base64 });
      if (editingClient) {
        setEditingClient((prev) => {
          if (!prev) return prev;
          if (type === 'logo') return { ...prev, logoUrl: url };
          return { ...prev, qrCodeUrl: url };
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setSavingKey('');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[linear-gradient(135deg,#d5eeee_0%,#e7f4ee_48%,#d8d5fb_100%)] p-6 flex items-center justify-center">
        <section className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/65 p-8 shadow-[0_28px_80px_rgba(25,92,101,0.16)] backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f8f9a] text-white shadow-lg">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#12353b]">FitX Admin</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#4d7176]">Secure dashboard access</p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#4d7176]">Admin Email</span>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#b9d6d8] bg-white/70 px-5 py-4 text-center text-base font-bold text-[#12353b] outline-none focus:border-[#0f8f9a]"
                  placeholder="admin@fitx.com"
                />
              </label>
              {error && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={otpSending}
                className="w-full rounded-2xl bg-[#0f8f9a] py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-[#0b7882] disabled:opacity-60"
              >
                {otpSending ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="rounded-2xl border border-[#b9d6d8] bg-[#dff4f2]/60 px-4 py-3 text-center text-xs font-bold text-[#0f8f9a]">
                OTP sent to <span className="font-black">{adminEmail}</span>
                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); }} className="ml-3 underline text-[#4d7176] hover:text-[#0f8f9a]">Change</button>
              </div>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#4d7176]">Enter OTP</span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-2xl border border-[#b9d6d8] bg-white/70 px-5 py-4 text-center text-2xl font-black tracking-[0.4em] text-[#12353b] outline-none focus:border-[#0f8f9a]"
                  placeholder="••••••"
                />
              </label>
              {error && (
                <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#0f8f9a] py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-[#0b7882]"
              >
                Verify & Enter Dashboard
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp({ preventDefault: () => { } } as React.FormEvent)}
                disabled={otpSending}
                className="w-full rounded-2xl border border-[#b9d6d8] bg-transparent py-3 text-xs font-bold uppercase tracking-widest text-[#4d7176] transition hover:bg-white/50 disabled:opacity-50"
              >
                {otpSending ? 'Resending...' : 'Resend OTP'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4d7176] transition hover:text-[#0f8f9a]"
            >
              ← Back to Website
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[linear-gradient(135deg,#c7e6e5_0%,#edf5ec_48%,#d8d5fb_100%)] p-2 md:p-4 text-[#12353b] lg:p-8 relative">
      <div className="mx-auto grid max-w-7xl gap-4 lg:gap-6 rounded-[28px] border border-white/70 bg-white/35 p-3 shadow-[0_35px_100px_rgba(32,80,89,0.18)] backdrop-blur-2xl h-full grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-1 lg:grid-cols-[230px_minmax(0,1fr)] relative">

        {/* Mobile Header (Visible only on small screens) */}
        <div className="flex lg:hidden items-center justify-between px-2">
          <div>
            <h1 className="text-base font-black tracking-tight">FitX</h1>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-[#5e7e83]">Admin suite</p>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="icon-button bg-white/60">
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Sidebar Overlay (Backdrop) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden rounded-[28px]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative z-40 lg:z-0 top-[60px] lg:top-0 inset-x-4 lg:inset-x-0 h-[calc(100vh-80px)] lg:h-full flex-col rounded-[22px] border border-white/60 bg-white/95 lg:bg-white/45 p-3.5 lg:max-h-[calc(100vh-3.5rem)] shadow-2xl lg:shadow-none backdrop-blur-3xl`}>
          <div className="mb-3.5 px-1.5 shrink-0 hidden lg:block">
            <h1 className="text-base font-black tracking-tight">FitX</h1>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-[#5e7e83]">Admin suite</p>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide pr-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-black tracking-wide transition ${active
                    ? 'bg-[#0f8f9a] text-white shadow-[0_8px_20px_rgba(15,143,154,0.22)]'
                    : 'text-[#4d7176] hover:bg-white/60 hover:text-[#12353b]'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="min-w-0 h-full overflow-y-auto scrollbar-hide rounded-[24px] border border-white/60 bg-white/45 p-4 md:p-6 pb-24 lg:pb-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold text-[#568087]">Welcome back, {adminProfile.name || 'Admin'}</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">{titleFor(activeTab)}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadAllData} className="icon-button" title="Refresh">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={handleLogout} className="icon-button" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <OverviewPanel 
              metrics={metrics} 
              contacts={contacts} 
              memberships={memberships} 
              setActiveTab={setActiveTab} 
              globalSettings={heroes.find(h => h.pageKey === 'global_settings')}
              onChangeHero={updateHeroLocal}
              onSaveHero={saveHero}
              onUploadHeroAsset={uploadHeroAsset}
              savingKey={savingKey}
            />
          )}
          {activeTab === 'profile' && (
            <ProfilePanel
              profile={adminProfile}
              setProfile={setAdminProfile}
              onAvatarUpload={uploadAdminAvatar}
              onSave={saveAdminProfile}
              uploading={savingKey === 'profile-avatar'}
            />
          )}
          {activeTab === 'users' && (
            <UsersPanel users={users} onGeneratePlan={openAiForUser} />
          )}
          {activeTab === 'heroes' && (
            <HeroPanel heroes={heroes} onChange={updateHeroLocal} onSave={saveHero} onUpload={uploadHeroAsset} savingKey={savingKey} />
          )}
          {activeTab === 'offers' && (
            <OfferPanel offer={offer} setOffer={setOffer} onSave={saveOffer} saving={savingKey === 'offer'} />
          )}
          {activeTab === 'packages' && (
            <PackagesPanel memberships={memberships} onChange={updateMembershipLocal} onSave={saveMembership} savingKey={savingKey} />
          )}
          {activeTab === 'retention' && (
            <RetentionPanel contacts={contacts} metrics={metrics} />
          )}
          {activeTab === 'inquiries' && (
            <InquiriesPanel contacts={filteredContacts} query={query} setQuery={setQuery} onDelete={deleteContact} />
          )}
          {activeTab === 'trainers' && (
            <TrainersPanel trainers={trainers} onEdit={setEditingTrainer} onDelete={deleteTrainer} />
          )}
          {activeTab === 'ai' && (
            <AiPanel
              form={aiForm}
              setForm={setAiForm}
              onGenerate={generateAiPlan}
              loading={isGeneratingAi}
              result={aiResult}
              users={users}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              selectedUser={selectedUser}
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryPanel
              items={galleryItems}
              onAdd={addGalleryItem}
              onDelete={deleteGalleryItem}
              onUploadImage={uploadGalleryImage}
              savingKey={savingKey}
            />
          )}
          {activeTab === 'blogs' && (
            <BlogsPanel
              blogs={blogs}
              editingBlog={editingBlog}
              setEditingBlog={setEditingBlog}
              onSave={saveBlog}
              onDelete={deleteBlog}
              onUploadImage={uploadBlogImage}
              savingKey={savingKey}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsPanel metrics={metrics} memberships={memberships} trainers={trainers} />
          )}
          {activeTab === 'clients' && (
            <ClientsPanel
              clients={gymClients}
              editingClient={editingClient}
              setEditingClient={setEditingClient}
              onSave={saveClient}
              onDelete={deleteClient}
              onUploadImage={uploadClientAsset}
              savingKey={savingKey}
            />
          )}
        </section>
      </div>

      {editingTrainer && (
        <TrainerModal
          trainer={editingTrainer}
          setTrainer={setEditingTrainer}
          onSubmit={saveTrainer}
          saving={savingKey === 'trainer'}
        />
      )}
    </main>
  );
}

function GalleryPanel({
  items,
  onAdd,
  onDelete,
  onUploadImage,
  savingKey,
}: {
  items: GalleryItem[];
  onAdd: (item: Partial<GalleryItem>) => void;
  onDelete: (id: string) => void;
  onUploadImage: (file?: File) => Promise<string | undefined>;
  savingKey: string;
}) {
  const [form, setForm] = React.useState({ title: '', img: '', type: 'photo' });
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await onUploadImage(file);
    if (url) {
      setForm((f) => ({ ...f, img: url }));
      setPreview(url);
    }
    setUploading(false);
  };

  const handleUrlChange = (url: string) => {
    setForm((f) => ({ ...f, img: url }));
    setPreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.img) return;
    onAdd({ title: form.title || 'Untitled', img: form.img, type: form.type });
    setForm({ title: '', img: '', type: 'photo' });
    setPreview('');
  };

  return (
    <div className="space-y-6">
      {/* Add New Item Form */}
      <div className="panel-card">
        <h3 className="mb-4 font-black">Add Gallery Item</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="admin-light-input"
              placeholder="e.g. Gym Floor, Cardio Zone..."
            />
          </Field>
          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="admin-light-input"
            >
              <option value="photo">Photo</option>
              <option value="transformation">Transformation</option>
              <option value="equipment">Equipment</option>
              <option value="event">Event</option>
            </select>
          </Field>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!form.img || savingKey === 'gallery-add'}
              className="primary-button justify-center whitespace-nowrap"
            >
              <Upload className="h-4 w-4" />
              {savingKey === 'gallery-add' ? 'Adding...' : 'Add to Gallery'}
            </button>
          </div>
          <div className="md:col-span-3">
            <Field label="Image URL (paste link) or upload file">
              <div className="flex gap-3">
                <input
                  value={form.img}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="admin-light-input flex-1"
                  placeholder="https://images.unsplash.com/..."
                />
                <label className="secondary-button cursor-pointer whitespace-nowrap">
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-3 h-24 w-36 rounded-2xl object-cover border border-[#b9d6d8]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </Field>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="panel-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">Gallery ({items.length} items)</h3>
        </div>
        {items.length === 0 ? (
          <EmptyText label="No gallery items yet. Add your first photo above." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-[#dff4f2]/40">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80';
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-black">{item.title}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="rounded-full bg-[#dff4f2] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#0f8f9a]">
                      {item.type}
                    </span>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-xl p-1.5 text-[#a33f79] transition hover:bg-[#f4e2ee]"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewPanel({
  metrics,
  contacts,
  memberships,
  setActiveTab,
  globalSettings,
  onChangeHero,
  onSaveHero,
  onUploadHeroAsset,
  savingKey,
}: {
  metrics: AdminMetrics;
  contacts: ContactLead[];
  memberships: Membership[];
  setActiveTab: (tab: AdminTab) => void;
  globalSettings?: PageHeroData;
  onChangeHero?: (pageKey: string, patch: Partial<PageHeroData>) => void;
  onSaveHero?: (hero: PageHeroData) => void;
  onUploadHeroAsset?: (hero: PageHeroData, field: 'image' | 'video', file?: File) => void;
  savingKey?: string;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <DashboardCard label="Users" value={metrics.users} icon={Users} accent="teal" />
          <DashboardCard label="Hero Pages" value={metrics.heroPages} icon={ImageIcon} accent="teal" />
          <DashboardCard label="Packages" value={metrics.packages} icon={Package} accent="purple" />
          <DashboardCard label="Inquiries" value={metrics.activeLeads} icon={Mail} accent="pink" />
          <DashboardCard label="Profit" value={formatMoney(metrics.profit)} icon={TrendingUp} accent="amber" />
        </div>

        {globalSettings && onChangeHero && onSaveHero && onUploadHeroAsset && (
          <div className="panel-card bg-white/70">
            <h3 className="mb-4 font-black">Main Website Settings</h3>
            <div className="grid gap-4">
              <Field label="Website Logo">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input value={globalSettings.video || ''} onChange={(e) => onChangeHero('global_settings', { video: e.target.value })} className="admin-light-input" placeholder="Logo URL" />
                  <label className="secondary-button cursor-pointer justify-center">
                    <Upload className="h-4 w-4" />
                    {savingKey === `upload-global_settings-video` ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onUploadHeroAsset(globalSettings, 'video', e.target.files?.[0])} />
                  </label>
                </div>
                {globalSettings.video && <img src={globalSettings.video} alt="Logo" className="mt-3 h-16 w-auto object-contain bg-white rounded-lg p-2 border border-[#b9d6d8]" />}
              </Field>
              <Field label="Website QR Code">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input value={globalSettings.image || ''} onChange={(e) => onChangeHero('global_settings', { image: e.target.value })} className="admin-light-input" placeholder="QR Code URL" />
                  <label className="secondary-button cursor-pointer justify-center">
                    <Upload className="h-4 w-4" />
                    {savingKey === `upload-global_settings-image` ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onUploadHeroAsset(globalSettings, 'image', e.target.files?.[0])} />
                  </label>
                </div>
                {globalSettings.image && <img src={globalSettings.image} alt="QR Code" className="mt-3 h-24 w-24 object-cover rounded-xl bg-white border border-[#b9d6d8]" />}
              </Field>
              <div className="grid gap-3 pt-4 border-t border-white/20">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#12353b]">Social Media URLs</h4>
                <Field label="YouTube URL">
                  <input value={globalSettings.contentBlocks?.youtube_url || ''} onChange={(e) => onChangeHero('global_settings', { contentBlocks: { ...globalSettings.contentBlocks, youtube_url: e.target.value } })} className="admin-light-input" placeholder="https://youtube.com/..." />
                </Field>
                <Field label="Facebook URL">
                  <input value={globalSettings.contentBlocks?.facebook_url || ''} onChange={(e) => onChangeHero('global_settings', { contentBlocks: { ...globalSettings.contentBlocks, facebook_url: e.target.value } })} className="admin-light-input" placeholder="https://facebook.com/..." />
                </Field>
                <Field label="Twitter / X URL">
                  <input value={globalSettings.contentBlocks?.twitter_url || ''} onChange={(e) => onChangeHero('global_settings', { contentBlocks: { ...globalSettings.contentBlocks, twitter_url: e.target.value } })} className="admin-light-input" placeholder="https://x.com/..." />
                </Field>
                <Field label="Instagram URL">
                  <input value={globalSettings.contentBlocks?.instagram_url || ''} onChange={(e) => onChangeHero('global_settings', { contentBlocks: { ...globalSettings.contentBlocks, instagram_url: e.target.value } })} className="admin-light-input" placeholder="https://instagram.com/..." />
                </Field>
                <Field label="LinkedIn URL">
                  <input value={globalSettings.contentBlocks?.linkedin_url || ''} onChange={(e) => onChangeHero('global_settings', { contentBlocks: { ...globalSettings.contentBlocks, linkedin_url: e.target.value } })} className="admin-light-input" placeholder="https://linkedin.com/..." />
                </Field>
              </div>
              <SaveButton onClick={() => onSaveHero(globalSettings)} saving={savingKey === 'hero-global_settings'} />
            </div>
          </div>
        )}

        <div className="panel-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-black">Latest inquiries</h3>
              <p className="text-xs font-semibold text-[#6b8b8f]">Recent customer requests</p>
            </div>
            <button onClick={() => setActiveTab('inquiries')} className="text-xs font-bold text-[#0f8f9a]">View all</button>
          </div>
          <div className="space-y-2">
            {contacts.slice(0, 6).map((contact) => (
              <div key={contact.id || contact.email} className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3">
                <div>
                  <p className="text-sm font-black">{contact.name}</p>
                  <p className="text-xs text-[#6b8b8f]">{contact.email}</p>
                </div>
                <span className="rounded-full bg-[#dff4f2] px-3 py-1 text-[10px] font-bold text-[#0f8f9a]">{contact.type || 'Lead'}</span>
              </div>
            ))}
            {!contacts.length && <EmptyText label="No inquiries yet." />}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="panel-card bg-[#0f8f9a] text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Do not forget</p>
          <h3 className="mt-3 text-2xl font-black">Review retention and absentee followups</h3>
          <button onClick={() => setActiveTab('retention')} className="mt-6 rounded-full bg-white px-4 py-2 text-xs font-black text-[#0f8f9a]">
            Open retention center
          </button>
        </div>
        <div className="panel-card">
          <h3 className="mb-4 font-black">Package snapshot</h3>
          <div className="space-y-3">
            {memberships.slice(0, 4).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <span className="text-sm font-bold">{plan.name}</span>
                <span className="text-sm font-black text-[#0f8f9a]">{plan.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({
  profile,
  setProfile,
  onAvatarUpload,
  onSave,
  uploading,
}: {
  profile: { name: string; email: string; avatar: string };
  setProfile: React.Dispatch<React.SetStateAction<{ name: string; email: string; avatar: string }>>;
  onAvatarUpload: (file?: File) => void;
  onSave: () => void;
  uploading: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
      <div className="panel-card">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-[#dff4f2] text-[#0f8f9a] relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const imgEl = e.target as HTMLImageElement;
                  imgEl.style.display = 'none';
                  const parent = imgEl.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className={`avatar-fallback absolute inset-0 flex items-center justify-center ${profile.avatar ? 'hidden' : 'flex'}`}>
              <UserCircle2 className="h-14 w-14" />
            </div>
          </div>
          <h3 className="mt-4 text-xl font-black">{profile.name || 'Admin'}</h3>
          <p className="text-sm font-semibold text-[#6b8b8f]">{profile.email || 'admin@fitx.com'}</p>
          <label className="secondary-button mt-5 cursor-pointer">
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload photo'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatarUpload(e.target.files?.[0])} />
          </label>
        </div>
      </div>
      <div className="panel-card space-y-4">
        <Field label="Admin name">
          <input value={profile.name} onChange={(e) => setProfile((item) => ({ ...item, name: e.target.value }))} className="admin-light-input" />
        </Field>
        <Field label="Email">
          <input type="email" value={profile.email} onChange={(e) => setProfile((item) => ({ ...item, email: e.target.value }))} className="admin-light-input" />
        </Field>
        <Field label="Avatar URL (paste image link)">
          <input value={profile.avatar} onChange={(e) => setProfile((item) => ({ ...item, avatar: e.target.value }))} className="admin-light-input" placeholder="https://..." />
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="preview"
              className="mt-2 h-16 w-16 rounded-2xl object-cover border border-[#b9d6d8]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </Field>
        <SaveButton onClick={onSave} saving={false} />
      </div>
    </div>
  );
}

function UsersPanel({ users, onGeneratePlan }: { users: AdminUser[]; onGeneratePlan: (user: AdminUser) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard label="Total Users" value={users.length} icon={Users} accent="teal" />
        <DashboardCard label="With Plans" value={users.filter((user) => user.dietPlan || user.workoutPlan).length} icon={Bot} accent="purple" />
        <DashboardCard label="Trainer Assigned" value={users.filter((user) => user.assignedTrainer).length} icon={Dumbbell} accent="amber" />
      </div>
      <div className="panel-card">
        <h3 className="mb-4 font-black">Registered users</h3>
        <div className="grid gap-3">
          {users.map((user) => (
            <div key={user.id} className="grid gap-3 rounded-2xl bg-white/60 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-black">{user.name || 'Unnamed user'}</h4>
                  <span className="rounded-full bg-[#dff4f2] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0f8f9a]">
                    {user.role || 'member'}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#6b8b8f]">{user.email}</p>
                <p className="mt-1 text-xs font-bold text-[#6b8b8f]">
                  {user.phone || 'No phone'} | {user.activePlan || user.appliedProgram || 'No active plan'} | Trainer: {user.assignedTrainer?.name || 'Not assigned'}
                </p>
              </div>
              <button onClick={() => onGeneratePlan(user)} className="primary-button justify-center">
                <Sparkles className="h-4 w-4" />
                Generate plan
              </button>
            </div>
          ))}
          {!users.length && <EmptyText label="No users found yet." />}
        </div>
      </div>
    </div>
  );
}

function HeroPanel({
  heroes,
  onChange,
  onSave,
  onUpload,
  savingKey,
}: {
  heroes: PageHeroData[];
  onChange: (pageKey: string, patch: Partial<PageHeroData>) => void;
  onSave: (hero: PageHeroData) => void;
  onUpload: (hero: PageHeroData, field: 'image' | 'video', file?: File) => void;
  savingKey: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {heroes.filter(h => h.pageKey !== 'global_settings').map((hero) => (
        <div key={hero.pageKey} className="panel-card">
          <div className="mb-4 flex gap-4">
            {hero.image && hero.pageKey !== 'global_settings' && (
              <img src={hero.image} alt={hero.title} className="h-24 w-32 rounded-2xl object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0f8f9a]">{hero.pageKey}</p>
              <input value={hero.title} onChange={(e) => onChange(hero.pageKey, { title: e.target.value })} className="admin-light-input mt-2 text-lg font-black" />
            </div>
          </div>
          <div className="grid gap-3">
            <Field label="Subtitle">
              <input value={hero.subtitle} onChange={(e) => onChange(hero.pageKey, { subtitle: e.target.value })} className="admin-light-input" />
            </Field>
            <Field label="Description">
              <textarea value={hero.description} onChange={(e) => onChange(hero.pageKey, { description: e.target.value })} rows={3} className="admin-light-input" />
            </Field>
            
            <Field label="Hero Background Image">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input value={hero.image || ''} onChange={(e) => onChange(hero.pageKey, { image: e.target.value })} className="admin-light-input" placeholder="Optional image URL" />
                <label className="secondary-button cursor-pointer justify-center">
                  <Upload className="h-4 w-4" />
                  {savingKey === `upload-${hero.pageKey}-image` ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(hero, 'image', e.target.files?.[0])} />
                </label>
              </div>
            </Field>

            {hero.pageKey === 'home' && (
              <Field label="Home hero video URL">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input value={hero.video || ''} onChange={(e) => onChange(hero.pageKey, { video: e.target.value })} className="admin-light-input" placeholder="Optional video URL" />
                  <label className="secondary-button cursor-pointer justify-center">
                    <Upload className="h-4 w-4" />
                    {savingKey === `upload-${hero.pageKey}-video` ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => onUpload(hero, 'video', e.target.files?.[0])} />
                  </label>
                </div>
                {hero.video && <video src={hero.video} className="mt-3 h-32 w-full rounded-2xl object-cover" muted loop playsInline controls />}
              </Field>
            )}
            
            {hero.pageKey === 'contact_us' && (
              <div className="bg-black/5 p-4 rounded-2xl grid gap-3 mt-2">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#12353b]">Contact Info Boxes</h4>
                <Field label="Call Us Number">
                  <input value={hero.contentBlocks?.box1_value || ''} onChange={(e) => onChange(hero.pageKey, { contentBlocks: { ...hero.contentBlocks, box1_value: e.target.value } })} className="admin-light-input" placeholder="+1 (800) IRON-PULSE" />
                </Field>
                <Field label="Email Address">
                  <input value={hero.contentBlocks?.box2_value || ''} onChange={(e) => onChange(hero.pageKey, { contentBlocks: { ...hero.contentBlocks, box2_value: e.target.value } })} className="admin-light-input" placeholder="support@ironpulse.fitness" />
                </Field>
                <Field label="HQ Address">
                  <input value={hero.contentBlocks?.box3_value || ''} onChange={(e) => onChange(hero.pageKey, { contentBlocks: { ...hero.contentBlocks, box3_value: e.target.value } })} className="admin-light-input" placeholder="Iron District, NY 10001" />
                </Field>
                <Field label="WhatsApp Group">
                  <input value={hero.contentBlocks?.box4_value || ''} onChange={(e) => onChange(hero.pageKey, { contentBlocks: { ...hero.contentBlocks, box4_value: e.target.value } })} className="admin-light-input" placeholder="Join Community" />
                </Field>
              </div>
            )}

            <Field label="CTA text">
              <input value={hero.ctaText} onChange={(e) => onChange(hero.pageKey, { ctaText: e.target.value })} className="admin-light-input" />
            </Field>

          </div>
          <SaveButton onClick={() => onSave(hero)} saving={savingKey === `hero-${hero.pageKey}`} />
        </div>
      ))}
      {!heroes.length && <EmptyText label="No hero sections found." />}
    </div>
  );
}

function OfferPanel({
  offer,
  setOffer,
  onSave,
  saving,
}: {
  offer: PromotionalOfferData;
  setOffer: React.Dispatch<React.SetStateAction<PromotionalOfferData>>;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <div className="panel-card space-y-4">
        <Field label="Offer title">
          <input value={offer.title} onChange={(e) => setOffer((item) => ({ ...item, title: e.target.value }))} className="admin-light-input" />
        </Field>
        <Field label="Subtitle">
          <input value={offer.subtitle} onChange={(e) => setOffer((item) => ({ ...item, subtitle: e.target.value }))} className="admin-light-input" />
        </Field>
        <Field label="Target date">
          <input type="datetime-local" value={toDateTimeLocal(offer.targetDate)} onChange={(e) => setOffer((item) => ({ ...item, targetDate: e.target.value }))} className="admin-light-input" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Background">
            <input type="color" value={offer.bgColor || '#00E5FF'} onChange={(e) => setOffer((item) => ({ ...item, bgColor: e.target.value }))} className="h-12 w-full rounded-xl border-0 bg-white/70" />
          </Field>
          <Field label="Text">
            <input type="color" value={offer.textColor || '#0A0F24'} onChange={(e) => setOffer((item) => ({ ...item, textColor: e.target.value }))} className="h-12 w-full rounded-xl border-0 bg-white/70" />
          </Field>
          <label className="flex items-end gap-3 rounded-2xl bg-white/55 p-3 text-sm font-bold">
            <input type="checkbox" checked={offer.isActive} onChange={(e) => setOffer((item) => ({ ...item, isActive: e.target.checked }))} />
            Active
          </label>
        </div>
        <SaveButton onClick={onSave} saving={saving} />
      </div>
      <div className="panel-card flex min-h-64 items-center justify-center" style={{ backgroundColor: offer.bgColor || '#00E5FF', color: offer.textColor || '#0A0F24' }}>
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest opacity-70">Live preview</p>
          <h3 className="mt-3 text-3xl font-black">{offer.title || 'Offer title'}</h3>
          <p className="mt-2 text-sm font-bold opacity-80">{offer.subtitle || 'Offer subtitle'}</p>
        </div>
      </div>
    </div>
  );
}

function PackagesPanel({
  memberships,
  onChange,
  onSave,
  savingKey,
}: {
  memberships: Membership[];
  onChange: (id: string, patch: Partial<Membership>) => void;
  onSave: (plan: Membership) => void;
  savingKey: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {memberships.map((plan) => (
        <div key={plan.id} className="panel-card">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <input value={plan.name} onChange={(e) => onChange(plan.id, { name: e.target.value })} className="admin-light-input text-xl font-black" />
              <p className="mt-2 text-xs font-bold text-[#6b8b8f]">{plan.period}</p>
            </div>
            <Boxes className="h-7 w-7 text-[#0f8f9a]" />
          </div>
          <div className="grid gap-3">
            <Field label="Price">
              <input value={plan.price} onChange={(e) => onChange(plan.id, { price: e.target.value })} className="admin-light-input" />
            </Field>
            <Field label="Description">
              <textarea value={plan.desc} onChange={(e) => onChange(plan.id, { desc: e.target.value })} rows={3} className="admin-light-input" />
            </Field>
            <Field label="Features">
              <textarea value={(plan.features || []).join('\n')} onChange={(e) => onChange(plan.id, { features: e.target.value.split('\n').filter(Boolean) })} rows={4} className="admin-light-input" />
            </Field>
          </div>
          <SaveButton onClick={() => onSave(plan)} saving={savingKey === `membership-${plan.id}`} />
        </div>
      ))}
    </div>
  );
}

function RetentionPanel({ contacts, metrics }: { contacts: ContactLead[]; metrics: AdminMetrics }) {
  const absenteeList = contacts.filter((contact) => !isRecent(contact.timestamp, 7)).slice(0, 8);
  const recentList = contacts.filter((contact) => isRecent(contact.timestamp, 7)).slice(0, 6);

  // Custom entries from localStorage
  const [customEntries, setCustomEntries] = React.useState<{ type: string; label: string; amount: number; date: string; category: string }[]>(() => {
    try {
      const saved = localStorage.getItem('fitx_retention_entries');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [txForm, setTxForm] = React.useState({ type: 'debit', label: '', amount: '', category: 'Expense' });

  const saveEntries = (entries: typeof customEntries) => {
    setCustomEntries(entries);
    localStorage.setItem('fitx_retention_entries', JSON.stringify(entries));
  };

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.label || !txForm.amount) return;
    const entry = {
      type: txForm.type,
      label: txForm.label,
      amount: Math.abs(Number(txForm.amount)),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      category: txForm.category,
    };
    saveEntries([entry, ...customEntries]);
    setTxForm({ type: 'debit', label: '', amount: '', category: 'Expense' });
  };

  const removeEntry = (idx: number) => {
    saveEntries(customEntries.filter((_, i) => i !== idx));
  };

  // Build ledger from metrics + custom entries
  const baseLedger = [
    { type: 'credit', label: 'Membership Revenue', amount: metrics.packageRevenue, date: 'This Month', category: 'Income', isBase: true },
    { type: 'credit', label: 'New Inquiries Converted', amount: metrics.inquiriesThisWeek * 2500, date: 'This Week', category: 'Income', isBase: true },
    { type: 'debit', label: 'Trainer Salaries', amount: metrics.trainers * 12000, date: 'This Month', category: 'Expense', isBase: true },
    { type: 'debit', label: 'Equipment & Maintenance', amount: Math.round(metrics.packageRevenue * 0.08), date: 'This Month', category: 'Expense', isBase: true },
    { type: 'debit', label: 'Utilities & Operations', amount: Math.round(metrics.packageRevenue * 0.06), date: 'This Month', category: 'Expense', isBase: true },
  ];
  const ledger = [
    ...baseLedger,
    ...customEntries.map((e) => ({ ...e, isBase: false })),
  ];

  const totalIncome = ledger.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalExpense = ledger.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel-card bg-gradient-to-br from-[#dff4f2] to-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0f8f9a]">Total Income</p>
          <p className="mt-2 text-3xl font-black text-[#0f8f9a]">{formatMoney(totalIncome)}</p>
          <p className="mt-1 text-xs font-bold text-[#6b8b8f]">Memberships + Conversions</p>
        </div>
        <div className="panel-card bg-gradient-to-br from-[#f4e2ee] to-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#a33f79]">Total Expenses</p>
          <p className="mt-2 text-3xl font-black text-[#a33f79]">{formatMoney(totalExpense)}</p>
          <p className="mt-1 text-xs font-bold text-[#6b8b8f]">Salaries + Operations</p>
        </div>
        <div className={`panel-card bg-gradient-to-br ${netProfit >= 0 ? 'from-[#d5f5e3] to-white' : 'from-[#fdecea] to-white'}`}>
          <p className={`text-[10px] font-black uppercase tracking-widest ${netProfit >= 0 ? 'text-[#1a7f4b]' : 'text-[#c0392b]'}`}>Net Profit</p>
          <p className={`mt-2 text-3xl font-black ${netProfit >= 0 ? 'text-[#1a7f4b]' : 'text-[#c0392b]'}`}>{formatMoney(netProfit)}</p>
          <p className="mt-1 text-xs font-bold text-[#6b8b8f]">This Month</p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="panel-card">
        <h3 className="mb-4 font-black">Add Debit / Credit Entry</h3>
        <form onSubmit={addTransaction} className="grid gap-3 md:grid-cols-[auto_1fr_auto_auto_auto]">
          <select
            value={txForm.type}
            onChange={(e) => setTxForm((f) => ({ ...f, type: e.target.value, category: e.target.value === 'credit' ? 'Income' : 'Expense' }))}
            className="admin-light-input"
          >
            <option value="debit">Debit (Expense)</option>
            <option value="credit">Credit (Income)</option>
          </select>
          <input
            value={txForm.label}
            onChange={(e) => setTxForm((f) => ({ ...f, label: e.target.value }))}
            className="admin-light-input"
            placeholder="Description (e.g. Rent, Equipment purchase...)"
            required
          />
          <input
            type="number"
            value={txForm.amount}
            onChange={(e) => setTxForm((f) => ({ ...f, amount: e.target.value }))}
            className="admin-light-input w-32"
            placeholder="₹ Amount"
            required
            min="1"
          />
          <select
            value={txForm.category}
            onChange={(e) => setTxForm((f) => ({ ...f, category: e.target.value }))}
            className="admin-light-input"
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
            <option value="Salary">Salary</option>
            <option value="Rent">Rent</option>
            <option value="Equipment">Equipment</option>
            <option value="Marketing">Marketing</option>
            <option value="Misc">Misc</option>
          </select>
          <button type="submit" className="primary-button justify-center whitespace-nowrap">
            <TrendingUp className="h-4 w-4" />
            Add Entry
          </button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Ledger Table */}
        <div className="panel-card">
          <h3 className="mb-4 font-black">Financial Ledger</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 rounded-xl bg-[#f0f9fa] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#6b8b8f]">
              <span>Transaction</span>
              <span className="text-center">Category</span>
              <span className="text-right">Amount</span>
              <span></span>
            </div>
            {ledger.map((tx, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-xl bg-white/60 px-4 py-3">
                <div>
                  <p className="text-sm font-black">{tx.label}</p>
                  <p className="text-[10px] font-bold text-[#6b8b8f]">{tx.date}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black ${tx.type === 'credit' ? 'bg-[#dff4f2] text-[#0f8f9a]' : 'bg-[#f4e2ee] text-[#a33f79]'}`}>
                  {tx.category}
                </span>
                <span className={`text-right text-sm font-black tabular-nums ${tx.type === 'credit' ? 'text-[#1a7f4b]' : 'text-[#a33f79]'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatMoney(tx.amount)}
                </span>
                {!tx.isBase ? (
                  <button onClick={() => removeEntry(i - baseLedger.length)} className="rounded-lg p-1 text-[#a33f79] hover:bg-[#f4e2ee]" title="Remove">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : <span className="w-7" />}
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-xl bg-[#0f8f9a] px-4 py-3">
              <span className="font-black text-white">Net Balance</span>
              <span className="text-[10px] font-black text-white/70">Summary</span>
              <span className="text-right text-sm font-black text-white tabular-nums">{formatMoney(netProfit)}</span>
              <span className="w-7" />
            </div>
          </div>
        </div>

        {/* Retention & Absentees */}
        <div className="space-y-4">
          <DashboardCard label="Retention rate" value={`${metrics.retentionRate}%`} icon={Activity} accent="teal" />
          <DashboardCard label="Absentees" value={metrics.absentees} icon={CalendarX2} accent="pink" />
          <DashboardCard label="Weekly inquiries" value={metrics.inquiriesThisWeek} icon={Mail} accent="amber" />
        </div>
      </div>

      {/* Absentee Follow-up */}
      <div className="panel-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">Absentee Follow-up Queue</h3>
          <span className="rounded-full bg-[#f4e2ee] px-3 py-1 text-xs font-bold text-[#a33f79]">{absenteeList.length} pending</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {absenteeList.map((contact) => (
            <div key={contact.id || contact.email} className="flex items-center justify-between rounded-2xl bg-white/60 p-4">
              <div>
                <p className="font-black">{contact.name}</p>
                <p className="text-xs text-[#6b8b8f]">{contact.email}</p>
                {contact.phone && <p className="text-xs font-bold text-[#0f8f9a]">{contact.phone}</p>}
              </div>
              <span className="rounded-full bg-[#f4e2ee] px-3 py-1 text-[10px] font-bold text-[#a33f79]">Follow-up needed</span>
            </div>
          ))}
          {!absenteeList.length && (
            <div className="col-span-2 rounded-2xl bg-[#dff4f2] p-6 text-center text-sm font-bold text-[#0f8f9a]">
              ✅ No absentee followups right now. Great retention!
            </div>
          )}
        </div>
      </div>

      {/* Recent Active Members */}
      {recentList.length > 0 && (
        <div className="panel-card">
          <h3 className="mb-4 font-black">Recently Active (This Week)</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {recentList.map((contact) => (
              <div key={contact.id || contact.email} className="rounded-2xl bg-[#dff4f2]/60 p-3">
                <p className="font-black text-sm">{contact.name}</p>
                <p className="text-xs text-[#6b8b8f] truncate">{contact.email}</p>
                <span className="mt-2 inline-block rounded-full bg-[#0f8f9a] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">{contact.type || 'Lead'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InquiriesPanel({
  contacts,
  query,
  setQuery,
  onDelete,
}: {
  contacts: ContactLead[];
  query: string;
  setQuery: (value: string) => void;
  onDelete: (id?: string) => void;
}) {
  return (
    <div className="panel-card">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-black">Admin: Inquiries</h3>
          <p className="text-xs font-semibold text-[#6b8b8f]">Contact, package and program requests</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b8b8f]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inquiries" className="rounded-xl border-0 bg-white/70 py-3 pl-10 pr-4 text-sm font-bold outline-none" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="text-xs uppercase tracking-widest text-[#6b8b8f]">
            <tr>
              <th className="py-3">Client</th>
              <th>Type</th>
              <th>Plan</th>
              <th>Message</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d7e8e8]">
            {contacts.map((contact) => (
              <tr key={contact.id || contact.email}>
                <td className="py-4">
                  <p className="font-black">{contact.name}</p>
                  <p className="text-xs text-[#6b8b8f]">{contact.email}</p>
                </td>
                <td className="text-sm font-bold">{contact.type || 'Contact'}</td>
                <td className="text-sm font-bold">{contact.plan || 'N/A'}</td>
                <td className="max-w-sm truncate text-sm text-[#5f777b]">{contact.message}</td>
                <td className="text-right">
                  <button onClick={() => onDelete(contact.id)} className="icon-button text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrainersPanel({ trainers, onEdit, onDelete }: { trainers: Trainer[]; onEdit: (trainer: Partial<Trainer>) => void; onDelete: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => onEdit({})} className="primary-button">
          <UserPlus className="h-4 w-4" />
          Add trainer
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="panel-card">
            <img src={trainer.img} alt={trainer.name} className="mb-4 h-48 w-full rounded-2xl object-cover" />
            <p className="text-xs font-black uppercase tracking-widest text-[#0f8f9a]">{trainer.role}</p>
            <h3 className="mt-2 text-xl font-black">{trainer.name}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-[#638488]">{trainer.bio}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => onEdit(trainer)} className="secondary-button"><Edit3 className="h-4 w-4" /> Edit</button>
              <button onClick={() => onDelete(trainer.id)} className="secondary-button text-red-500"><Trash2 className="h-4 w-4" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiPanel({
  form,
  setForm,
  onGenerate,
  loading,
  result,
  users,
  selectedUserId,
  setSelectedUserId,
  selectedUser,
}: {
  form: AiPlanForm;
  setForm: React.Dispatch<React.SetStateAction<AiPlanForm>>;
  onGenerate: (e: React.FormEvent) => void;
  loading: boolean;
  result: { diet: string; workout: string } | null;
  users: AdminUser[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  selectedUser: AdminUser | null;
}) {
  const savedDiet = planToText(selectedUser?.dietPlan);
  const savedWorkout = planToText(selectedUser?.workoutPlan);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={onGenerate} className="panel-card space-y-4">
        <Field label="Select user">
          <select
            value={selectedUserId}
            onChange={(e) => {
              const nextId = e.target.value;
              const nextUser = users.find((user) => user.id === nextId);
              setSelectedUserId(nextId);
              if (nextUser) {
                setForm((item) => ({
                  ...item,
                  memberName: nextUser.name || item.memberName,
                  goal: nextUser.activePlan ? `${nextUser.activePlan} fitness progress` : item.goal,
                  activityLevel: nextUser.appliedProgram || item.activityLevel,
                }));
              }
            }}
            className="admin-light-input"
          >
            <option value="">Generate without assigning</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name} - {user.email}</option>
            ))}
          </select>
        </Field>
        <Field label="Member name">
          <input value={form.memberName} onChange={(e) => setForm((item) => ({ ...item, memberName: e.target.value }))} className="admin-light-input" required />
        </Field>
        <Field label="Goal">
          <input value={form.goal} onChange={(e) => setForm((item) => ({ ...item, goal: e.target.value }))} className="admin-light-input" />
        </Field>
        <Field label="Activity level">
          <input value={form.activityLevel} onChange={(e) => setForm((item) => ({ ...item, activityLevel: e.target.value }))} className="admin-light-input" />
        </Field>
        <Field label="Workout split">
          <input value={form.workoutSplit} onChange={(e) => setForm((item) => ({ ...item, workoutSplit: e.target.value }))} className="admin-light-input" />
        </Field>
        <Field label="Diet type">
          <input value={form.dietType} onChange={(e) => setForm((item) => ({ ...item, dietType: e.target.value }))} className="admin-light-input" />
        </Field>
        <button className="primary-button w-full justify-center" disabled={loading}>
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate AI plan'}
        </button>
      </form>
      <div className="panel-card">
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="font-black">Generated Diet/Workout Plan</h3>
          {selectedUser && <p className="text-xs font-bold text-[#6b8b8f]">Assigned to {selectedUser.name}</p>}
        </div>
        {result ? (
          <div className="grid gap-4 md:grid-cols-2">
            <PlanBlock title="Diet" text={result.diet} />
            <PlanBlock title="Workout" text={result.workout} />
          </div>
        ) : savedDiet || savedWorkout ? (
          <div className="grid gap-4 md:grid-cols-2">
            <PlanBlock title="Saved diet" text={savedDiet || 'No saved diet plan.'} />
            <PlanBlock title="Saved workout" text={savedWorkout || 'No saved workout plan.'} />
          </div>
        ) : (
          <EmptyText label="Generate a plan to preview it here." />
        )}
      </div>
    </div>
  );
}

function AnalyticsPanel({ metrics, memberships, trainers }: { metrics: AdminMetrics; memberships: Membership[]; trainers: Trainer[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="panel-card">
        <h3 className="mb-5 font-black">Expense / Profit Analytics</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <DashboardCard label="Revenue" value={formatMoney(metrics.packageRevenue)} icon={TrendingUp} accent="teal" />
          <DashboardCard label="Expense" value={formatMoney(metrics.expenses)} icon={Activity} accent="pink" />
          <DashboardCard label="Profit" value={formatMoney(metrics.profit)} icon={BarChart3} accent="amber" />
        </div>
      </div>
      <div className="panel-card">
        <h3 className="mb-5 font-black">Cost drivers</h3>
        <div className="space-y-4">
          <ProgressRow label="Trainer payroll estimate" value={trainers.length * 12000} max={metrics.expenses || 1} />
          <ProgressRow label="Operations estimate" value={Math.round(metrics.packageRevenue * 0.38)} max={metrics.expenses || 1} />
          <ProgressRow label="Package revenue" value={metrics.packageRevenue} max={Math.max(metrics.packageRevenue, metrics.expenses, 1)} />
        </div>
        <p className="mt-5 text-xs font-semibold text-[#6b8b8f]">Analytics are dashboard estimates based on current package prices and trainer count.</p>
      </div>
    </div>
  );
}

function TrainerModal({
  trainer,
  setTrainer,
  onSubmit,
  saving,
}: {
  trainer: Partial<Trainer>;
  setTrainer: (trainer: Partial<Trainer> | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12353b]/40 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl">
        <h3 className="mb-5 text-2xl font-black">{trainer.id ? 'Edit trainer' : 'Add trainer'}</h3>
        <div className="space-y-4">
          <Field label="Name">
            <input value={trainer.name || ''} onChange={(e) => setTrainer({ ...trainer, name: e.target.value })} className="admin-light-input" required />
          </Field>
          <Field label="Role">
            <input value={trainer.role || ''} onChange={(e) => setTrainer({ ...trainer, role: e.target.value })} className="admin-light-input" required />
          </Field>
          <Field label="Image URL">
            <input value={trainer.img || ''} onChange={(e) => setTrainer({ ...trainer, img: e.target.value })} className="admin-light-input" required />
          </Field>
          <Field label="Bio">
            <textarea value={trainer.bio || ''} onChange={(e) => setTrainer({ ...trainer, bio: e.target.value })} className="admin-light-input" rows={4} required />
          </Field>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="primary-button flex-1 justify-center" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save trainer'}
          </button>
          <button type="button" onClick={() => setTrainer(null)} className="secondary-button flex-1 justify-center">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function DashboardCard({ label, value, icon: Icon, accent }: { label: string; value: React.ReactNode; icon: React.ElementType; accent: 'teal' | 'purple' | 'pink' | 'amber' }) {
  const accents = {
    teal: 'from-[#dcfbf8] to-white text-[#0f8f9a]',
    purple: 'from-[#eeeafd] to-white text-[#7661d1]',
    pink: 'from-[#fdeaf6] to-white text-[#d64e9b]',
    amber: 'from-[#fff0d8] to-white text-[#d28a2e]',
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accents[accent]} p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-black uppercase tracking-widest opacity-70">{label}</p>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 text-3xl font-black text-[#12353b]">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-[#6b8b8f]">{label}</span>
      {children}
    </label>
  );
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button onClick={onClick} disabled={saving} className="primary-button mt-4">
      <Save className="h-4 w-4" />
      {saving ? 'Saving...' : 'Save changes'}
    </button>
  );
}

function EmptyText({ label }: { label: string }) {
  return <p className="rounded-2xl border border-dashed border-[#bad6d8] p-6 text-center text-sm font-bold text-[#6b8b8f]">{label}</p>;
}

function PlanBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/60 p-4">
      <h4 className="mb-3 font-black">{title}</h4>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-[#4d7176]">{text}</pre>
    </div>
  );
}

function ProgressRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{formatMoney(value)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#d9eeee]">
        <div className="h-full rounded-full bg-[#0f8f9a]" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

function BlogsPanel({
  blogs,
  editingBlog,
  setEditingBlog,
  onSave,
  onDelete,
  onUploadImage,
  savingKey,
}: {
  blogs: Blog[];
  editingBlog: Partial<Blog> | null;
  setEditingBlog: (blog: Partial<Blog> | null) => void;
  onSave: (e: React.FormEvent) => void;
  onDelete: (id: string) => void;
  onUploadImage: (file?: File) => void;
  savingKey: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-black text-xl">Articles Catalog</h3>
          <p className="text-xs font-semibold text-[#6b8b8f]">Manage the FitX journal posts</p>
        </div>
        <button
          onClick={() =>
            setEditingBlog({
              title: '',
              excerpt: '',
              category: 'Training',
              author: 'FitX Coach',
              readTime: '5 min read',
              img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
              content: '',
              featured: false,
            })
          }
          className="primary-button"
        >
          <UserPlus className="h-4 w-4" />
          Create Blog Post
        </button>
      </div>

      {editingBlog && (
        <form onSubmit={onSave} className="panel-card space-y-4">
          <h4 className="font-black text-lg text-[#0f8f9a]">
            {editingBlog.id ? 'Edit Article' : 'New Article'}
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <input
                value={editingBlog.title || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                className="admin-light-input"
                placeholder="Article title"
                required
              />
            </Field>
            <Field label="Category">
              <select
                value={editingBlog.category || 'Training'}
                onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                className="admin-light-input"
              >
                <option value="Training">Training</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Mindset">Mindset</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Recovery">Recovery</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Author">
              <input
                value={editingBlog.author || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                className="admin-light-input"
                placeholder="Author name"
                required
              />
            </Field>
            <Field label="Read Time">
              <input
                value={editingBlog.readTime || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                className="admin-light-input"
                placeholder="e.g. 6 min read"
                required
              />
            </Field>
            <Field label="Featured Post">
              <div className="flex h-11 items-center">
                <input
                  type="checkbox"
                  checked={editingBlog.featured || false}
                  onChange={(e) => setEditingBlog({ ...editingBlog, featured: e.target.checked })}
                  className="h-5 w-5 rounded border-[#b9d6d8] text-[#0f8f9a] focus:ring-[#0f8f9a]"
                  id="blog-featured-checkbox"
                />
                <label htmlFor="blog-featured-checkbox" className="ml-2.5 text-xs font-bold text-[#4d7176]">
                  Display as Hero/Featured
                </label>
              </div>
            </Field>
          </div>
          <Field label="Excerpt (Short Summary)">
            <input
              value={editingBlog.excerpt || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
              className="admin-light-input"
              placeholder="Brief preview text"
              required
            />
          </Field>
          <Field label="Article Content (Supports Markdown/Plaintext)">
            <textarea
              value={editingBlog.content || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
              rows={8}
              className="admin-light-input"
              placeholder="Main article body text..."
              required
            />
          </Field>
          <Field label="Cover Image URL">
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                value={editingBlog.img || ''}
                onChange={(e) => setEditingBlog({ ...editingBlog, img: e.target.value })}
                className="admin-light-input"
                placeholder="Image URL"
                required
              />
              <label className="secondary-button cursor-pointer justify-center">
                <Upload className="h-4 w-4" />
                {savingKey === 'blog-upload' ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUploadImage(e.target.files?.[0])}
                />
              </label>
            </div>
            {editingBlog.img && (
              <img
                src={editingBlog.img}
                alt="preview"
                className="mt-3 h-32 w-48 rounded-2xl object-cover border border-[#b9d6d8]"
              />
            )}
          </Field>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={savingKey === 'blog'}
              className="primary-button flex-grow justify-center"
            >
              <Save className="h-4 w-4" />
              {savingKey === 'blog' ? 'Saving...' : 'Save Article'}
            </button>
            <button
              type="button"
              onClick={() => setEditingBlog(null)}
              className="secondary-button flex-grow justify-center"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="panel-card flex flex-col h-full justify-between">
            <div>
              <div className="relative">
                <img src={blog.img} alt={blog.title} className="h-48 w-full rounded-2xl object-cover" />
                {blog.featured && (
                  <span className="absolute top-3 right-3 bg-[#0f8f9a] text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                    Featured
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-[#dff4f2] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#0f8f9a]">
                  {blog.category}
                </span>
                <span className="text-[10px] font-bold text-[#6b8b8f]">{blog.readTime}</span>
              </div>
              <h3 className="mt-3 text-lg font-black leading-snug line-clamp-2">{blog.title}</h3>
              <p className="mt-2 text-xs font-semibold text-[#6b8b8f] line-clamp-3">{blog.excerpt}</p>
              <p className="mt-2 text-[10px] font-bold text-[#568087]">By {blog.author} • {blog.date}</p>
            </div>
            <div className="mt-5 pt-4 border-t border-[#d7e8e8] flex gap-2">
              <button
                onClick={() => setEditingBlog(blog)}
                className="secondary-button flex-grow justify-center"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => onDelete(blog.id!)}
                className="secondary-button text-red-500 flex-grow justify-center"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {!blogs.length && <div className="col-span-full"><EmptyText label="No blog posts found. Create one above to get started!" /></div>}
      </div>
    </div>
  );
}

function titleFor(tab: AdminTab) {
  const titles: Record<AdminTab, string> = {
    overview: 'Dashboard',
    profile: 'Admin Profile',
    users: 'Admin: Users',
    heroes: 'Hero Section CMS',
    offers: 'Offer Section',
    packages: 'Packages',
    gallery: 'Gallery Management',
    blogs: 'Blogs Management',
    retention: 'Retention & Absentees',
    inquiries: 'Admin: Inquiries',
    trainers: 'Admin: Trainer Management',
    ai: 'Admin: AI Diet/Workout Plans',
    analytics: 'Admin: Expense/Profit Analytics',
    clients: 'Admin: Client Management',
  };
  return titles[tab];
}

function parsePrice(price: string) {
  const amount = Number(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function planToText(plan: any) {
  if (!plan) return '';
  if (typeof plan === 'string') return plan;
  if (Array.isArray(plan)) return plan.join('\n');
  return JSON.stringify(plan, null, 2);
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function isRecent(timestamp: string | undefined, days: number) {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= days * 24 * 60 * 60 * 1000;
}

function toDateTimeLocal(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 16);
}
