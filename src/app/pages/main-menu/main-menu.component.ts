import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PagoService } from '../../services/pago.service'; // 👈 import del servicio
declare var paypal: any; // 👈 declarar variable global

@Component({
  standalone: true,
  selector: 'app-main-menu',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './main-menu.html',
  styleUrls: ['./main-menu.css'],
})
export class MainMenuComponent {
  user: { username: string; nombre: string; apellido: string } | null = null;

  form: any;
  resultado = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private pagoService: PagoService
  ) {
    this.form = this.fb.group({
      producto: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0.01)]],
    });
    const raw = localStorage.getItem('user');
    this.user = raw ? JSON.parse(raw) : null;
    if (!this.user) this.router.navigateByUrl('/login');
  }

  pagar(tipo: string) {
    if (this.form.invalid) {
      this.resultado = 'Ingrese producto y monto válido';
      return;
    }

    const { producto, monto } = this.form.value;

    if (tipo === 'PayPal') {
      // 1. Crear orden en tu backend
      this.pagoService.crearOrden(monto).subscribe({
        next: (order) => {
          console.log('✅ Orden PayPal creada:', order);

          // 2. Renderizar botón de PayPal

          if (typeof paypal !== 'undefined') {
            paypal
              .Buttons({
                createOrder: () => order.id,
                onApprove: (data: any) => {
                  this.pagoService
                    .capturarPago(
                      data.orderID,
                      this.user?.username || '',
                      this.user?.nombre || '',
                      this.user?.apellido || '',
                      producto, // 👈 viene del form
                      'PayPal' // 👈 método de pago
                    )
                    .subscribe({
                      next: (res) => {
                        this.resultado = '✅ Pago realizado con éxito y guardado en MongoDB';
                      },
                      error: () => (this.resultado = '❌ Error capturando pago en PayPal'),
                    });
                },
              })
              .render('#paypal-button-container');
          } else {
            console.error('❌ SDK de PayPal no está cargado');
          }
        },
        error: () => (this.resultado = '❌ Error creando orden en PayPal'),
      });
      return;
    }

    const body = {
      usuario: this.user?.username,
      nombre: this.user?.nombre,
      apellido: this.user?.apellido,
      producto,
      metodo: tipo,
      monto,
      fecha: new Date(),
    };

    // 🔌 Llamada real al backend
    this.pagoService.guardarPago(body).subscribe({
      next: () => (this.resultado = '✅ Pago almacenado en Base de Datos'),
      error: () => (this.resultado = '❌ Error al procesar el pago'),
    });
  }
}
