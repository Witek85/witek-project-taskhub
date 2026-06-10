import { FormControl } from '@angular/forms';
import { TaskPriority } from './task-priority.model';
import { TaskStatus } from './task-status.model';

export interface Task {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface CreateTaskRequest {
  name: string;
  description: string | null;
  priority: TaskPriority;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TaskSearchCriteria {
  name?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export type TaskFormControls = {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  priority: FormControl<TaskPriority | null>;
}

export type TaskFilterFormControls = {
  name: FormControl<string | null>;
  priority: FormControl<TaskPriority | null>;
  status: FormControl<TaskStatus | null>;
}
