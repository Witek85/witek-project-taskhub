import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TaskFormControls } from "../../models/task.model";
import { TaskPriority } from "../../models/task-priority.model";

@Injectable()
export class TaskAddPageStateService {

  public get taskForm(): FormGroup<TaskFormControls> {
    return this._taskForm;
  }

  private _taskForm: FormGroup<TaskFormControls> = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.required]),
    priority: new FormControl<TaskPriority | null>(null, [Validators.required])
  })

}