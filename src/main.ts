import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // Assuming 'App' is your root standalone component
import { provideHttpClient } from '@angular/common/http'; // <-- Correct import for standalone HttpClient

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers, // Keep existing providers from app.config
    provideHttpClient() // <-- Use provideHttpClient() directly
  ]
}).catch((err) => console.error(err));