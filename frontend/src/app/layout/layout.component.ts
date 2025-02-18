// layout.component.ts
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class LayoutComponent {}