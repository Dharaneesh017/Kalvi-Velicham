import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import {  SchoolsComponent } from './pages/schools/schools';
import {  VolunteerComponent } from './pages/volunteer/volunteer';
import { Successstories } from './pages/successstories/successstories';
import { DonateComponent } from './pages/donate/donate';

export const routes: Routes = [
  { path: '',component:Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'schools', component:SchoolsComponent },
  { path: 'volunteer',  component: VolunteerComponent},
  { path: 'successstories', component: Successstories },
  { path: 'donate', component:DonateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
