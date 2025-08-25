import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="shell">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .shell {
        min-height: 100dvh;
        display: grid;
        place-items: center;
        background: #f5f7fb;
      }
    `,
  ],
})
export class AppComponent {}
