import { Injectable, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TaskFilterFormControls } from "../../models/task.model";
import { TaskPriority } from "../../models/task-priority.model";
import { TaskStatus } from "../../models/task-status.model";

@Injectable()
export class TaskListPageStateService {

  public readonly page: WritableSignal<number> = signal(0);
  public readonly size: WritableSignal<number> = signal(10);
  public readonly totalElements: WritableSignal<number> = signal(0);
  public readonly totalPages: WritableSignal<number> = signal(0);
  
  public get taskFilterForm(): FormGroup<TaskFilterFormControls> {
    return this._taskFilterForm;
  }

  public setPageData(totalElements: number, totalPages: number, page: number, size: number): void {
    this.totalElements.set(totalElements);
    this.totalPages.set(totalPages);
    this.page.set(page);
    this.size.set(size);
  }

  public resetPagination(): void {
    this.page.set(0);
  }

  private _taskFilterForm: FormGroup<TaskFilterFormControls> = new FormGroup({
    name: new FormControl<string | null>(null),
    priority: new FormControl<TaskPriority | null>(null),
    status: new FormControl<TaskStatus | null>(null),
    createdFrom: new FormControl<Date | null>(null),
    createdTo: new FormControl<Date | null>(null)
  })
}