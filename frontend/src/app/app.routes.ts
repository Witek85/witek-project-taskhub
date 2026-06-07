import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks'
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/pages/task-list-page/task-list-page.component')
            .then(m => m.TaskListPageComponent)
      },
      {
        path: 'tasks/add',
        loadComponent: () =>
          import('./features/tasks/pages/task-add-page/task-add-page.component')
            .then(m => m.TaskAddPageComponent)
      },
      {
        path: 'tasks/:id',
        loadComponent: () =>
          import('./features/tasks/pages/task-details-page/task-details-page.component')
            .then(m => m.TaskDetailsPageComponent)
      }
    ]
  }
];