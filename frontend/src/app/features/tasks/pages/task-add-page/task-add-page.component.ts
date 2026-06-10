import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

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
    FormControlErrorStateDirective
  ],
  providers: [TaskAddPageStateService],
  templateUrl: './task-add-page.component.html',
  styleUrl: './task-add-page.component.scss'
})
export class TaskAddPageComponent implements OnInit {
  private readonly taskApi = inject(TaskApiService);
  private readonly router = inject(Router);

  public readonly taskAddPageStateService: TaskAddPageStateService = inject(TaskAddPageStateService);

  priorities = signal<DictionaryOption<TaskPriority>[]>([]);
  // saving = signal(false);

  public ngOnInit(): void {
    this.getPriorities();
  }
  
  public onClear(): void {
    this.taskAddPageStateService.taskForm.reset();
  }
  
  public onSubmit(): void {
    const form = this.taskAddPageStateService.taskForm;

    console.log('form', form, form.invalid);

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
        // this.saving.set(false);
        alert('ok')
      },
      error: () => {
        // this.saving.set(false);
        alert('error')
      }
    });
  }

  private markFormAsTouched(): void {
    this.taskAddPageStateService.taskForm.markAllAsTouched();
    this.taskAddPageStateService.taskForm.updateValueAndValidity();
  }

  // submit(): void {
  //   this.form.markAllAsTouched();

  //   if (this.form.invalid) {
  //     return;
  //   }

  //   const value = this.form.getRawValue();

  //   this.saving.set(true);

  //   this.taskApi.createTask({
  //     name: value.name,
  //     description: value.description,
  //     priority: value.priority!,
  //     status: value.status!
  //   }).subscribe({
  //     next: task => {
  //       this.saving.set(false);
  //       this.router.navigate(['/tasks', task.id]);
  //     },
  //     error: () => {
  //       this.saving.set(false);
  //     }
  //   });
  // }

  // cancel(): void {
  //   this.router.navigate(['/tasks']);
  // }

  // isInvalid(controlName: keyof typeof this.form.controls): boolean {
  //   const control = this.form.controls[controlName];
  //   return control.invalid && (control.touched || control.dirty);
  // }
}