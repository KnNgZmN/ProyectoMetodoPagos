import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiMenu = environment.apiMenu; // Node + TS + Atlas

  constructor(private http: HttpClient) { }

  crearOrden(monto: number) {
    return this.http.post<any>(`${this.apiMenu}/paypal/create-order`, { amount: monto });
  }

  capturarPago(
    orderId: string,
    usuario: string,
    nombre: string,
    apellido: string,
    producto: string,
    metodo: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiMenu}/paypal/capture-order`, {
      orderId,
      usuario,
      nombre,
      apellido,
      producto,
      metodo,
    });
  }

  guardarPago(body: any) {
    return this.http.post<any>(`${this.apiMenu}/payments`, body);
  }

  obtenerPagos(): Observable<any> {
    return this.http.get(`${this.apiMenu}/payments`);
  }
}
