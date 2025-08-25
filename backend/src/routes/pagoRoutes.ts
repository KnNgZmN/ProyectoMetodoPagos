import { Router, Request, Response } from 'express';
import { Pago } from '../models/pago';
import { createOrder, captureOrder } from '../method/paypalService';

const router = Router();

// Crear orden de pago
router.post('/create-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    const order = await createOrder(amount);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error creando orden en PayPal' });
  }
});

// Capturar orden y guardar en MongoDB
router.post('/capture-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, producto } = req.body;

    // Capturar pago en PayPal
    const capture = await captureOrder(orderId);

    const amount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
    const payer = capture.payer;

    if (!amount) {
      res.status(400).json({ error: 'No se pudo obtener el monto de PayPal' });
      return;
    }

    // Guardar en MongoDB con datos de PayPal
    const pago = new Pago({
      usuario: payer?.payer_id || 'N/A',
      nombre: payer?.name?.given_name || 'N/A',
      apellido: payer?.name?.surname || 'N/A',
      producto: producto || 'Producto estándar',
      metodo: 'PayPal',
      monto: parseFloat(amount), // convertir a número
      fecha: new Date(),
    });

    await pago.save();

    res.json({
      message: '✅ Pago capturado y guardado en MongoDB',
      pago,
      paypalResponse: capture,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error capturando pago en PayPal', details: error });
  }
});

// POST guardar pago
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pago = new Pago(req.body);
    await pago.save();
    res.status(201).json({ msg: '✅ Pago almacenado en MongoDB Atlas', pago });
  } catch (err) {
    res.status(500).json({ msg: '❌ Error al guardar pago', error: err });
  }
});

// GET listar pagos
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pagos = await Pago.find().sort({ fecha: -1 });
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ msg: '❌ Error al obtener pagos', error: err });
  }
});

export default router;
