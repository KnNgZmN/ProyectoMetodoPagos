import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import pagoRoutes from './routes/pagoRoutes';
import authRoutes from './routes/authRoutes';
import fs from 'fs';

if (process.env['NODE_ENV'] !== 'production') {
  require('dotenv').config();
}

const app = express();

// Middleware para registrar todas las solicitudes (útil para debug)
app.use((req, res, next) => {
  console.log(`🛰️  ${req.method} ${req.path}`);
  next();
});

// ✅ Configuración CORS
const allowedOrigins = [
  'http://localhost:4200',
  'https://proyectometodopagos.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ CORS no permitido para este origen'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.options('*', cors()); // Manejar preflight

// ---------------------
// 1️⃣ Rutas del backend
// ---------------------
app.use('/api/paypal', pagoRoutes);
app.use('/api/payments', pagoRoutes);
app.use('/api/auth', authRoutes);

// ---------------------
// 2️⃣ Servir Angular
// ---------------------
const frontendPath = path.join(process.cwd(), 'dist/interfaz-pagos/browser');

// Servir archivos estáticos de Angular
app.use(express.static(frontendPath));

// Para cualquier ruta que no sea API → devolver Angular
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');

  console.log('Buscando frontend en:', indexPath);

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('No se encontró el frontend (index.html)');
  }
});

// ---------------------
// 3️⃣ Configuración servidor
// ---------------------
const PORT = parseInt(process.env['PORT'] || '8080', 10);
const MONGO_URI = process.env['MONGO_URI']!;

if (!MONGO_URI) {
  console.error(
    '❌ Error: No se encontró MONGO_URI en las variables de entorno'
  );
  process.exit(1);
}

// Conexión a MongoDB
connectDB(MONGO_URI);

app.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`)
);
