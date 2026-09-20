import {
  CreateTaskRequest as ApiCreateTaskRequest,
  CreateTaskRequestPriorityEnum,
  TaskResponse,
  TaskResponsePriorityEnum,
  TaskResponseStatusEnum,
} from '@openapi/taskhub-service';

import { CreateTaskRequest, Task, TaskTag } from '../models/task.model';
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
