import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import pagoRoutes from './routes/pagoRoutes';
import authRoutes from './routes/authRoutes';

if (process.env['NODE_ENV'] !== "production") {
  require("dotenv").config();
}
const app = express();

const allowedOrigins = [
  'http://localhost:4200', // para desarrollo local
  'https://proyectometodopagos.onrender.com' // producción
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.use('/api/paypal', pagoRoutes);
app.use('/api/payments', pagoRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env['PORT'] || 8080;
const MONGO_URI = process.env['MONGO_URI']!;

if (!MONGO_URI) {
  console.error("❌ Error: No se encontró MONGO_URI en las variables de entorno");
  process.exit(1);
}
// Conexión a MongoDB
connectDB(MONGO_URI);

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
