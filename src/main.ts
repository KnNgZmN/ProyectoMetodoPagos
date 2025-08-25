// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // o './app/app'
import { appConfig } from './app/services/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
