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
import { TaskStatus } from '../../models/task-status.model';
import { FluidModule } from 'primeng/fluid';

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
    FluidModule
  ],
  templateUrl: './task-add-page.component.html',
  styleUrl: './task-add-page.component.scss'
})
export class TaskAddPageComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly taskApi = inject(TaskApiService);
  private readonly router = inject(Router);

  priorities = signal<DictionaryOption<TaskPriority>[]>([]);
  statuses = signal<DictionaryOption<TaskStatus>[]>([]);
  // saving = signal(false);

  // form = this.fb.group({
  //   name: this.fb.control('', {
  //     validators: [Validators.required, Validators.maxLength(120)]
  //   }),
  //   description: this.fb.control<string | null>(null),
  //   priority: this.fb.control<TaskPriority | null>(null, {
  //     validators: [Validators.required]
  //   }),
  //   status: this.fb.control<TaskStatus | null>(null, {
  //     validators: [Validators.required]
  //   })
  // });

  ngOnInit(): void {
    this.taskApi.getPriorities().subscribe((res) => {
      console.log(res)
    });

    this.taskApi.getStatuses().subscribe((res) => {
      console.log(res)
    });
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