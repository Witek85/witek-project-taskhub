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

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private readonly http: HttpClient) {}

  getTasks(page = 0, size = 10): Observable<PageResponse<Task>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Task>>(this.apiUrl, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, request);
  }

  updateTaskPartially(id: number, request: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, request);
  }

  updateTask(id: number, request: CreateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}