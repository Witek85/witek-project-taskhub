import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateTaskRequest,
  PageResponse,
  Task,
  UpdateTaskRequest
} from '../models/task.model';
import { DictionaryOption } from '../models/dictionary-option.model';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private readonly http: HttpClient) {}

  getTasks(page = 0, size = 10): Observable<PageResponse<Task>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Task>>(`${this.apiUrl}/tasks`, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`);
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks/`, request);
  }

  updateTaskPartially(id: number, request: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}`, request);
  }

  updateTask(id: number, request: CreateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }

  getPriorities(): Observable<DictionaryOption<string>[]> {
  return this.http.get<DictionaryOption<string>[]>(
    `${this.apiUrl}/dictionary/priorities`
  );
}

getStatuses(): Observable<DictionaryOption<string>[]> {
  return this.http.get<DictionaryOption<string>[]>(
    `${this.apiUrl}/dictionary/statuses`
  );
}
}