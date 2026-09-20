import {
  CreateTaskRequest as ApiCreateTaskRequest,
  CreateTaskRequestPriorityEnum,
  PageTaskResponse,
  ReplaceTaskRequest as ApiReplaceTaskRequest,
  ReplaceTaskRequestPriorityEnum,
  ReplaceTaskRequestStatusEnum,
  TaskResponse,
  TaskResponsePriorityEnum,
  TaskResponseStatusEnum,
  UpdateTaskRequest as ApiUpdateTaskRequest,
  UpdateTaskRequestPriorityEnum,
  UpdateTaskRequestStatusEnum,
} from '@openapi/taskhub-service';

import {
  CreateTaskRequest,
  PageResponse,
  Task,
  TaskTag,
  UpdateTaskRequest,
} from '../models/task.model';
import { TaskPriority } from '../models/task-priority.model';
import { TaskStatus } from '../models/task-status.model';

// The generated model represents unique JSON arrays as Set, which JSON.stringify omits.
class JsonArraySet<T> extends Set<T> {
  toJSON(): T[] {
    return [...this];
  }
}

export function mapCreateTaskToApi(request: CreateTaskRequest): ApiCreateTaskRequest {
  return {
    name: request.name,
    ...(request.description !== null ? { description: request.description } : {}),
    priority: CreateTaskRequestPriorityEnum[request.priority],
    tagCodes: new JsonArraySet(request.tagCodes),
  };
}

export function mapUpdateTaskToApi(request: Partial<UpdateTaskRequest>): ApiUpdateTaskRequest {
  return {
    ...(request.name !== undefined ? { name: request.name } : {}),
    ...(request.description != null ? { description: request.description } : {}),
    ...(request.priority !== undefined
      ? { priority: UpdateTaskRequestPriorityEnum[request.priority] }
      : {}),
    ...(request.status !== undefined
      ? { status: UpdateTaskRequestStatusEnum[request.status] }
      : {}),
    ...(request.tagCodes !== undefined ? { tagCodes: new JsonArraySet(request.tagCodes) } : {}),
  };
}

export function mapReplaceTaskToApi(request: UpdateTaskRequest): ApiReplaceTaskRequest {
  if (
    request.name === undefined ||
    request.priority === undefined ||
    request.status === undefined
  ) {
    throw new Error('Replacing a task requires name, priority, and status.');
  }

  return {
    name: request.name,
    ...(request.description != null ? { description: request.description } : {}),
    priority: ReplaceTaskRequestPriorityEnum[request.priority],
    status: ReplaceTaskRequestStatusEnum[request.status],
    ...(request.tagCodes !== undefined ? { tagCodes: new JsonArraySet(request.tagCodes) } : {}),
  };
}

export function mapTaskFromApi(task: TaskResponse): Task {
  return {
    id: task.id!,
    name: task.name!,
    description: task.description ?? null,
    createdAt: task.createdAt!,
    updatedAt: task.updatedAt!,
    priority: task.priority as TaskPriority,
    status: task.status as TaskStatus,
    tags: (task.tags ?? []).map(
      (tag): TaskTag => ({
        code: tag.code!,
        label: tag.label!,
        color: tag.color ?? null,
      }),
    ),
  };
}

export function mapTaskPageFromApi(page: PageTaskResponse): PageResponse<Task> {
  return {
    content: (page.content ?? []).map(mapTaskFromApi),
    totalElements: page.totalElements!,
    totalPages: page.totalPages!,
    size: page.size!,
    number: page.number!,
  };
}
