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
  status: TaskStatus;
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