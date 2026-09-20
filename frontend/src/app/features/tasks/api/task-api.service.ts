import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateTaskRequest,
  PageResponse,
  Task,
  TaskSearchCriteria,
  UpdateTaskRequest,
} from '../models/task.model';
import { DictionaryOption } from '../models/dictionary-option.model';
import { TaskPriority } from '../models/task-priority.model';
import { TaskStatus } from '../models/task-status.model';
import { CreateTaskCommentRequest, TaskComment } from '../models/task-comment.model';
import {
  CommentControllerOpenApiService,
  TaskControllerOpenApiService,
} from '@openapi/taskhub-service';
import { mapTaskFromApi } from '../mappers/task.mapper';
import { mapCommentFromApi } from '../mappers/comment.mapper';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly openApi = inject(TaskControllerOpenApiService);
  private readonly commentOpenApi = inject(CommentControllerOpenApiService);

  constructor(private readonly http: HttpClient) {}

  getTasks(
    criteria: TaskSearchCriteria = {},
    page = 0,
    size = 10,
    sort = 'createdAt,desc',
  ): Observable<PageResponse<Task>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sort', sort);

    if (criteria.name) {
      params = params.set('name', criteria.name);
    }

    if (criteria.priority) {
      params = params.set('priority', criteria.priority);
    }

    if (criteria.status) {
      params = params.set('status', criteria.status);
    }

    if (criteria.createdFrom) {
      params = params.set('createdFrom', criteria.createdFrom);
    }

    if (criteria.createdTo) {
      params = params.set('createdTo', criteria.createdTo);
    }

    return this.http.get<PageResponse<Task>>(`${this.apiUrl}/tasks`, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.openApi.getById({ id }).pipe(map((response) => mapTaskFromApi(response)));
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, request);
  }

  updateTaskPartially(id: number, request: Partial<UpdateTaskRequest>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}`, request);
  }

  updateTask(id: number, request: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.openApi._delete({ id });
  }

  getPriorities(): Observable<DictionaryOption<TaskPriority>[]> {
    return this.http.get<DictionaryOption<TaskPriority>[]>(`${this.apiUrl}/dictionary/priorities`);
  }

  getStatuses(): Observable<DictionaryOption<TaskStatus>[]> {
    return this.http.get<DictionaryOption<TaskStatus>[]>(`${this.apiUrl}/dictionary/statuses`);
  }

  getCommentsByTaskId(taskId: number): Observable<TaskComment[]> {
    return this.commentOpenApi
      .getCommentsByTaskId({ taskId })
      .pipe(map((comments) => comments.map((comment) => mapCommentFromApi(comment, taskId))));
  }

  createComment(taskId: number, request: CreateTaskCommentRequest): Observable<TaskComment> {
    return this.http.post<TaskComment>(`${this.apiUrl}/tasks/${taskId}/comments`, request);
  }

  getTags(): Observable<DictionaryOption[]> {
    return this.http.get<DictionaryOption[]>(`${this.apiUrl}/dictionary/tags`);
  }
}
