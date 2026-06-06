import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { TaskApiService } from '../../api/task-api.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list-page',
  imports: [TableModule, ButtonModule, TagModule],
  templateUrl: './task-list-page.component.html',
  styleUrl: './task-list-page.component.scss'
})
export class TaskListPageComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(false);

  constructor(
    private readonly taskApi: TaskApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);

    this.taskApi.getTasks().subscribe({
      next: response => {
        this.tasks.set(response.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openTask(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }
}