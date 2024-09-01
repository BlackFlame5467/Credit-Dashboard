import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/total-info/total-info.component').then(
            (m) => m.TotalInfoComponent
          ),
      },
      {
        path: 'short-info',
        loadComponent: () =>
          import('./pages/short-info/short-info.component').then(
            (m) => m.ShortInfoComponent
          ),
      },
    ],
  },
];
