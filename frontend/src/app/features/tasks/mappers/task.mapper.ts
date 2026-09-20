import {
  TaskResponse,
  TaskResponsePriorityEnum,
  TaskResponseStatusEnum,
} from '@openapi/taskhub-service';

import { Task, TaskTag } from '../models/task.model';
import { TaskPriority } from '../models/task-priority.model';
import { TaskStatus } from '../models/task-status.model';

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
