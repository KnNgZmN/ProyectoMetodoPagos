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
  'http://localhost:4200',
  'https://proyectometodopagos.onrender.com'
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Aplica CORS a todas las rutas
app.use(cors(corsOptions));

// ✅ Maneja preflight (OPTIONS) correctamente
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/api/paypal', pagoRoutes);
app.use('/api/payments', pagoRoutes);
app.use('/api/auth', authRoutes);

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
