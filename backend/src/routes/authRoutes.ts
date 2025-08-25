import { Router } from 'express';
import usuario from '../models/usuario';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await usuario.findOne({ username });
    if (!user) {
      res.status(401).json({ msg: 'Usuario no encontrado' });
      return;
    }

    // 🚨 En un proyecto real: compara password con bcrypt
    if (user?.password !== password) {
      res.status(401).json({ msg: 'Contraseña incorrecta' });
      return;
    }

    res.json({
      username: user?.username,
      nombre: user?.nombre,
      apellido: user?.apellido,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error en login', error: err });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { nombre, apellido, username, password } = req.body;

    // Verificar si ya existe
    const userExists = await usuario.findOne({ username });
    if (userExists) {
      res.status(400).json({ msg: 'El usuario ya existe' });
      return;
    }

    // Crear nuevo usuario (⚡ en un proyecto real deberías encriptar la password con bcrypt)
    const newUser = new usuario({ nombre, apellido, username, password });
    await newUser.save();

    res.status(201).json({
      msg: '✅ Usuario registrado correctamente',
      user: {
        username: newUser.username,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
      },
    });
    return;
  } catch (err) {
    res.status(500).json({ msg: 'Error en registro', error: err });
    return;
  }
});

export default router;
