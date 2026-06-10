import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TaskFilterFormControls } from "../../models/task.model";
import { TaskPriority } from "../../models/task-priority.model";
import { TaskStatus } from "../../models/task-status.model";

@Injectable()
export class TaskListPageStateService {

  public get taskFilterForm(): FormGroup<TaskFilterFormControls> {
    return this._taskFilterForm;
  }

  private _taskFilterForm: FormGroup<TaskFilterFormControls> = new FormGroup({
    name: new FormControl<string | null>(null),
    priority: new FormControl<TaskPriority | null>(null),
    status: new FormControl<TaskStatus | null>(null)
  })
}