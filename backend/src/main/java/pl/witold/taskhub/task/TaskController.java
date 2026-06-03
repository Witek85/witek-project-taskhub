package pl.witold.taskhub.task;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import pl.witold.taskhub.task.dto.CreateTaskRequest;
import pl.witold.taskhub.task.dto.TaskResponse;
import pl.witold.taskhub.task.dto.UpdateTaskRequest;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public TaskResponse create(@Valid @RequestBody CreateTaskRequest request) {
        return taskService.create(request);
    }

    @GetMapping
    public Page<TaskResponse> getAll(Pageable pageable) {
        return taskService.getAll(pageable);
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable Long id) {
        return taskService.getById(id);
    }

    @PatchMapping("/{id}")
    public TaskResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        return taskService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }
}