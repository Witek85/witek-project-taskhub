import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { TaskApiService } from '../../api/task-api.service';
import { Task } from '../../models/task.model';
import { LoaderService } from '../../../../core/loader/loader.service';
import { ConfirmationService } from 'primeng/api';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-list-page',
  imports: [TableModule, ButtonModule, TagModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './task-list-page.component.html',
  styleUrl: './task-list-page.component.scss'
})
export class TaskListPageComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(false);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly taskApi = inject(TaskApiService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  public ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
    this.loading.set(true);

    this.taskApi.getTasks()
    .pipe(
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe({
      next: response => {
        this.tasks.set(response.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  public openTask(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  public editTask(event: Event, taskId: number): void {
    event.stopPropagation();
    this.router.navigate(['/tasks', taskId, 'edit']);
  }

  public onDeleteTask(event: Event, taskId: number): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected task?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.deleteTask(taskId);
      }
    });
  }

  private deleteTask(taskId: number): void {
    this.loaderService.startLoading();

    this.taskApi.deleteTask(taskId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loaderService.completeLoading();
        })
      )
      .subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err: string) => {
          console.log('error', err);
        }
      });
  }
}