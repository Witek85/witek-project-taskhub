import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { TaskFormControls } from '../../models/task.model';
import { FormControlErrorStateDirective } from '../../../../shared/directives/form-control-error-state.directive';

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
  private readonly router = inject(Router);

  public readonly taskAddPageStateService: TaskAddPageStateService = inject(TaskAddPageStateService);

  public priorities = signal<DictionaryOption<TaskPriority>[]>([]);
  public showDialog = signal<boolean>(false);
  public dialogMessage = signal<string>('');

  public ngOnInit(): void {
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

    this.createTask();
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

  private createTask(): void {
    const value = this.taskAddPageStateService.taskForm.getRawValue();

    if (!value.name || !value.priority) {
      return;
    }

    this.taskApi.createTask({
      name: value.name,
      description: value.description,
      priority: value.priority,
    }).subscribe({
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
}