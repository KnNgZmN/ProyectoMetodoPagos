import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db';
import pagoRoutes from './routes/pagoRoutes';
import authRoutes from './routes/authRoutes';


// ⚙️ Cargar variables de entorno
if (process.env['NODE_ENV'] !== 'production') {
  dotenv.config();
}

const app = express();

app.get('/', (req, res) => {
  res.json({ ok: true });
});

// ✅ Middleware de debugging (útil en Render)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// ✅ CORS - versión abierta para pruebas (puedes restringir después)
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:4200',
      'https://proyectometodopagos.onrender.com',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// 🛡️ Aplica CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight requests

// 🧠 Body parser
app.use(express.json());

// 🔌 Rutas backend
app.use('/api/paypal', pagoRoutes);
app.use('/api/payments', pagoRoutes);
app.use('/api/auth', authRoutes);

// 🌐 Servir frontend de Angular (producción)
const frontendPath = path.join(process.cwd(), 'dist/interfaz-pagos/browser');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('No se encontró el frontend');
  }
});

// 🚀 Iniciar servidor
const PORT = parseInt(process.env['PORT'] || '8080', 10);
const MONGO_URI = process.env['MONGO_URI'];

if (!MONGO_URI) {
  console.error('❌ No se encontró MONGO_URI');
  process.exit(1);
}
connectDB(MONGO_URI);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor en http://0.0.0.0:${PORT}`);
});

console.log("✅ Rutas cargadas:");
console.log("/api/auth ->", authRoutes.stack.map(r => r.route?.path));
console.log("/api/paypal ->", pagoRoutes.stack.map(r => r.route?.path));