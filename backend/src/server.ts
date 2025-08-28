import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import pagoRoutes from './routes/pagoRoutes';
import authRoutes from './routes/authRoutes';

if (process.env['NODE_ENV'] !== "production") {
  require("dotenv").config();
}

const app = express();

// Si quieres mantener CORS solo para localhost durante desarrollo
const allowedOrigins = [
  'http://localhost:4200', // Angular en local
  'https://proyectometodopagos.onrender.com' // Render (producción)
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Aplica CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// ---------------------
// 1️⃣ Rutas del backend
// ---------------------
app.use('/api/paypal', pagoRoutes);
app.use('/api/payments', pagoRoutes);
app.use('/api/auth', authRoutes);

// ---------------------
// 2️⃣ Servir Angular
// ---------------------
const frontendPath = path.join(__dirname, '../../../dist/interfaz-pagos/browser');

// Servir archivos estáticos de Angular
app.use(express.static(frontendPath));

// Para cualquier ruta que no sea API → devolver Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------------------
// 3️⃣ Configuración servidor
// ---------------------
const PORT = parseInt(process.env['PORT'] || '8080', 10);
const MONGO_URI = process.env['MONGO_URI']!;

if (!MONGO_URI) {
  console.error("❌ Error: No se encontró MONGO_URI en las variables de entorno");
  process.exit(1);
}

// Conexión a MongoDB
connectDB(MONGO_URI);

app.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`)
);
