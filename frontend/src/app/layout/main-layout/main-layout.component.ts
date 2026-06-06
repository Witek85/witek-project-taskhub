import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/tasks'
    },
    {
      label: 'Add',
      icon: 'pi pi-plus',
      routerLink: '/tasks/add'
    }
  ];
}