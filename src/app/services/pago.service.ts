import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = 'http://localhost:8080/api/payments'; // Node + TS + Atlas

  constructor(private http: HttpClient) {}

  crearOrden(monto: number) {
    return this.http.post<any>('http://localhost:8080/api/paypal/create-order', { amount: monto });
  }

  capturarPago(
    orderId: string,
    usuario: string,
    nombre: string,
    apellido: string,
    producto: string,
    metodo: string
  ): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/paypal/capture-order', {
      orderId,
      usuario,
      nombre,
      apellido,
      producto,
      metodo,
    });
  }

  guardarPago(body: any) {
    return this.http.post<any>('http://localhost:8080/api/paypal', body);
  }

  obtenerPagos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
