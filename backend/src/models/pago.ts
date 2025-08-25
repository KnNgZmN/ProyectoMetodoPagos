import { Schema, model } from 'mongoose';

const pagoSchema = new Schema({
  usuario: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  producto: { type: String, required: true },
  metodo: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

export const Pago = model('Pago', pagoSchema);
