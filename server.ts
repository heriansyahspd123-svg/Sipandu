import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'sipandu-db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// GET /api/state - Load all persisted state across browsers and devices
app.get('/api/state', (req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return res.json({ success: true, data: JSON.parse(data) });
    }
    return res.json({ success: true, data: null });
  } catch (error) {
    console.error('Error reading db:', error);
    return res.status(500).json({ success: false, error: 'Failed to read database' });
  }
});

// POST /api/state - Save persistent state
app.post('/api/state', (req, res) => {
  try {
    const payload = req.body;
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error writing db:', error);
    return res.status(500).json({ success: false, error: 'Failed to write database' });
  }
});

// POST /api/reset - Clear persistent db
app.post('/api/reset', (req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
    return res.json({ success: true, message: 'Database reset to default' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to reset database' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
