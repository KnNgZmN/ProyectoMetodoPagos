import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('⚠️ Por favor completa todos los campos correctamente.');
      return;
    }

    this.loading = true;
    const { username, password } = this.form.value;

    this.auth.login({ username, password }).subscribe({
      next: (res) => {
        // Se espera que tu backend devuelva algo como:
        // { token: 'JWT_TOKEN', user: { username, nombre, apellido } }
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        alert('✅ Inicio de sesión exitoso');
        this.router.navigateByUrl('/menu');
        this.loading = false;
      },
      error: (err) => {
        alert(err.error?.message || '❌ Credenciales inválidas');
        this.loading = false;
      },
    });
  }
}
