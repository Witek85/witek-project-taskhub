import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { TaskApiService } from '../../api/task-api.service';
import { Task } from '../../models/task.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-details-page',
  imports: [CardModule, TagModule],
  templateUrl: './task-details-page.component.html',
  styleUrl: './task-details-page.component.scss'
})
export class TaskDetailsPageComponent implements OnInit {
  task = signal<Task | null>(null);
  loading = signal(false);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly taskApi: TaskApiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      return;
    }

    this.loading.set(true);

    this.taskApi.getTaskById(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe({
      next: task => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}