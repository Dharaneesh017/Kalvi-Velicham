import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Gallery } from './pages/gallery/gallery';
import { Members } from './pages/members/members';
import { Contact } from './pages/contact/contact';
import { Events } from './pages/events/events';

export const routes: Routes = [
    { path:'about',component:About},
    { path:'gallery',component:Gallery},
    { path:'members',component:Members},
    {path:'contact',component:Contact},
    { path:'events',component:Events},
];
