import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';

import { TaskApiService } from '../../api/task-api.service';
import { DictionaryOption } from '../../models/dictionary-option.model';
import { TaskPriority } from '../../models/task-priority.model';
import { FluidModule } from 'primeng/fluid';
import { TaskAddPageStateService } from './task-add-page-state-service';
import { Task, TaskFormControls } from '../../models/task.model';
import { FormControlErrorStateDirective } from '../../../../shared/directives/form-control-error-state.directive';
import { LoaderService } from '../../../../core/loader/loader.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'ws-task-add',
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    FluidModule,
    FormControlErrorStateDirective,
    DialogModule
  ],
  providers: [TaskAddPageStateService],
  templateUrl: './task-add-page.component.html',
  styleUrl: './task-add-page.component.scss'
})
export class TaskAddPageComponent implements OnInit {
  private readonly taskApi = inject(TaskApiService);
  private readonly route = inject(ActivatedRoute);

  public readonly destroyRef: DestroyRef = inject(DestroyRef);
  public readonly taskAddPageStateService: TaskAddPageStateService = inject(TaskAddPageStateService);
  private readonly loaderService = inject(LoaderService);

  public priorities = signal<DictionaryOption<TaskPriority>[]>([]);
  public showDialog = signal<boolean>(false);
  public dialogMessage = signal<string>('');
  public editMode = signal<boolean>(false);

  public task!: Task;

  public ngOnInit(): void {
    const mode = this.route.snapshot.data['mode'];
    console.log('mode', mode);

    if (mode === 'edit') {
      this.editMode.set(true);
      const id = this.route.snapshot.paramMap.get('id');
      this.loadTask(Number(id));
    }

    this.getPriorities();
  }
  
  public onClear(): void {
    this.taskAddPageStateService.taskForm.reset();
  }

  public onClose(): void {
    this.showDialog.set(false);
    this.dialogMessage.set('')
  }
  
  public onSubmit(): void {
    const form = this.taskAddPageStateService.taskForm;
    if (form.invalid) {
      form.markAllAsTouched();
      form.updateValueAndValidity();
      return;
    }

    if (this.editMode()) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }

  public isInvalid(controlName: keyof TaskFormControls): boolean {
    const control = this.taskAddPageStateService.taskForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private getPriorities(): void {
    this.taskApi.getPriorities().subscribe((res) => {
      this.priorities.set(res);
    });
  }

  private loadTask(id: number): void {
    this.loaderService.startLoading();
    this.taskApi.getTaskById(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.loaderService.completeLoading();
      })
    )
    .subscribe({
      next: task => {
        this.task = task;
        this.taskAddPageStateService.updateForm(task);
      },
      error: (err) => {
        console.log('error, err');
      }
    });
  }

  private createTask(): void {
    const value = this.taskAddPageStateService.taskForm.getRawValue();

    if (!value.name || !value.priority) {
      return;
    }

    this.loaderService.startLoading();
    this.taskApi.createTask({
      name: value.name,
      description: value.description,
      priority: value.priority,
    })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.loaderService.completeLoading();
      })
    )
    .subscribe({
      next: task => {
        this.showDialog.set(true);
        this.dialogMessage.set('Task has been succesfully created');
        this.onClear();
      },
      error: (err) => {
        console.log('error', err)
      }
    });
  }

  private updateTask(): void {
    const value = this.taskAddPageStateService.taskForm.getRawValue();

    if (!value.name || !value.priority) {
      return;
    }

    this.loaderService.startLoading();
    this.taskApi.updateTask(this.task.id, {
      name: value.name,
      description: value.description,
      priority: value.priority,
      status: this.task.status,
    })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.loaderService.completeLoading();
      })
    )
    .subscribe({
      next: task => {
        this.showDialog.set(true);
        this.dialogMessage.set('Task has been succesfully updated');
      },
      error: (err) => {
        console.log('error', err)
      }
    });
  }
}