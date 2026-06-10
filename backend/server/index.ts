import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  readData, 
  writeData, 
  SEED_BLOGS, 
  SEED_TRAINERS, 
  SEED_TRANSFORMATIONS, 
  SEED_PROGRAMS, 
  SEED_MEMBERSHIPS, 
  SEED_GALLERY 
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ADMIN CREDENTIAL (Simple auth for local dashboard setup)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// --- AUTH ENDPOINT ---
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'fitx-admin-jwt-token-mock' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// --- BLOGS ENDPOINTS ---
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await readData('blogs.json', SEED_BLOGS);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load blogs' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blogs = await readData('blogs.json', SEED_BLOGS);
    const newBlog = {
      ...req.body,
      id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    
    // If new blog is featured, unfeature others
    if (newBlog.featured) {
      blogs.forEach(b => b.featured = false);
    }

    blogs.push(newBlog);
    await writeData('blogs.json', blogs);
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let blogs = await readData('blogs.json', SEED_BLOGS);
    const index = blogs.findIndex(b => b.id === id);
    
    if (index === -1) return res.status(404).json({ error: 'Blog not found' });

    const updatedBlog = { ...blogs[index], ...req.body, id };
    
    if (updatedBlog.featured) {
      blogs.forEach(b => { if(b.id !== id) b.featured = false; });
    }

    blogs[index] = updatedBlog;
    await writeData('blogs.json', blogs);
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let blogs = await readData('blogs.json', SEED_BLOGS);
    const filtered = blogs.filter(b => b.id !== id);
    
    await writeData('blogs.json', filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// --- TRAINERS ENDPOINTS ---
app.get('/api/trainers', async (req, res) => {
  try {
    const trainers = await readData('trainers.json', SEED_TRAINERS);
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load trainers' });
  }
});

app.post('/api/trainers', async (req, res) => {
  try {
    const trainers = await readData('trainers.json', SEED_TRAINERS);
    const newTrainer = {
      ...req.body,
      id: trainers.length > 0 ? Math.max(...trainers.map(t => t.id)) + 1 : 1
    };
    trainers.push(newTrainer);
    await writeData('trainers.json', trainers);
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add trainer' });
  }
});

app.put('/api/trainers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let trainers = await readData('trainers.json', SEED_TRAINERS);
    const idx = trainers.findIndex(t => t.id === id);
    
    if (idx === -1) return res.status(404).json({ error: 'Trainer not found' });
    trainers[idx] = { ...trainers[idx], ...req.body, id };
    await writeData('trainers.json', trainers);
    res.json(trainers[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update trainer' });
  }
});

app.delete('/api/trainers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let trainers = await readData('trainers.json', SEED_TRAINERS);
    const filtered = trainers.filter(t => t.id !== id);
    await writeData('trainers.json', filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trainer' });
  }
});

// --- TRANSFORMATIONS ---
app.get('/api/transformations', async (req, res) => {
  try {
    const data = await readData('transformations.json', SEED_TRANSFORMATIONS);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load transformations' });
  }
});

// --- PROGRAMS ENDPOINTS ---
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await readData('programs.json', SEED_PROGRAMS);
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load programs' });
  }
});

app.post('/api/programs', async (req, res) => {
  try {
    const programs = await readData('programs.json', SEED_PROGRAMS);
    const newProgram = {
      ...req.body,
      id: programs.length > 0 ? Math.max(...programs.map(p => p.id)) + 1 : 1,
      slug: req.body.title.toLowerCase().replace(/ /g, '-')
    };
    programs.push(newProgram);
    await writeData('programs.json', programs);
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add program' });
  }
});

app.put('/api/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let programs = await readData('programs.json', SEED_PROGRAMS);
    const idx = programs.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Program not found' });

    programs[idx] = { 
      ...programs[idx], 
      ...req.body, 
      id, 
      slug: req.body.title ? req.body.title.toLowerCase().replace(/ /g, '-') : programs[idx].slug 
    };
    await writeData('programs.json', programs);
    res.json(programs[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update program' });
  }
});

app.delete('/api/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let programs = await readData('programs.json', SEED_PROGRAMS);
    const filtered = programs.filter(p => p.id !== id);
    await writeData('programs.json', filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

// --- MEMBERSHIPS ---
app.get('/api/memberships', async (req, res) => {
  try {
    const data = await readData('memberships.json', SEED_MEMBERSHIPS);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load memberships' });
  }
});

// --- GALLERY ---
app.get('/api/gallery', async (req, res) => {
  try {
    const data = await readData('gallery.json', SEED_GALLERY);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load gallery' });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const gallery = await readData('gallery.json', SEED_GALLERY);
    const newItem = {
      ...req.body,
      id: gallery.length > 0 ? Math.max(...gallery.map(g => g.id)) + 1 : 1
    };
    gallery.push(newItem);
    await writeData('gallery.json', gallery);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gallery' });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let gallery = await readData('gallery.json', SEED_GALLERY);
    const filtered = gallery.filter(g => g.id !== id);
    await writeData('gallery.json', filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// --- CONTACTS / LEADS ENDPOINTS ---
app.get('/api/contacts', async (req, res) => {
  try {
    const data = await readData('contacts.json', []);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contacts = await readData('contacts.json', []);
    const newLead = {
      ...req.body,
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      timestamp: new Date().toISOString()
    };
    contacts.unshift(newLead); // Store newer leads first
    await writeData('contacts.json', contacts);
    res.status(201).json({ success: true, data: newLead });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save contact request' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let contacts = await readData('contacts.json', []);
    const filtered = contacts.filter(c => c.id !== id);
    await writeData('contacts.json', filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
