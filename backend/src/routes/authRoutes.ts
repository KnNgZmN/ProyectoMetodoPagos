import { Router } from 'express';
import usuario from '../models/usuario';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user: any = await usuario.findOne({ username });
    if (!user) {
      res.status(401).json({ msg: 'Usuario no encontrado' });
      return;
    }

    // ✅ Comparar password hasheada
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ msg: 'Contraseña incorrecta' });
      return;
    }

    // ✅ Generar token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env['JWT_SECRET'] || 'secret_key',
      { expiresIn: '2h' }
    );

    res.json({
      msg: '✅ Login exitoso',
      token,
      user: {
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
      },
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

    // ✅ La contraseña se hashea automáticamente gracias al pre('save')
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
  } catch (err) {
    res.status(500).json({ msg: 'Error en registro', error: err });
  }
});

export default router;
