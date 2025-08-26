import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 🔑 Middleware para hashear antes de guardar
usuarioSchema.pre<IUsuario>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 📌 Método para comparar contraseñas
usuarioSchema.methods['comparePassword'] = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this['password']);
};

export default model<IUsuario>('Usuario', usuarioSchema);
