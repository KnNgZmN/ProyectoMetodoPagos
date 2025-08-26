import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
})
export class RegistroComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('⚠️ Por favor completa todos los campos correctamente');
      return;
    }

    this.loading = true;
    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        alert(res.message || '✅ Usuario registrado con éxito');
        this.router.navigateByUrl('/login');
        this.loading = false;
      },
      error: (err) => {
        alert(err.error?.error || '❌ Error al registrar usuario');
        this.loading = false;
      },
    });
  }
}
