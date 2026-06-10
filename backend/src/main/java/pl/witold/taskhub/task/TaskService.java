package pl.witold.taskhub.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.witold.taskhub.task.dto.*;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponse create(CreateTaskRequest request) {
        Task task = new Task(
                request.name(),
                request.description(),
                request.priority()
        );

        Task savedTask = taskRepository.save(task);

        return toResponse(savedTask);
    }

    public Page<TaskResponse> getAll(TaskSearchRequest request, Pageable pageable) {
        return taskRepository.findAll(TaskSpecification.withFilters(request), pageable)
                .map(this::toResponse);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getName(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    public TaskResponse getById(Long id) {
        Task task = findTaskById(id);
        return toResponse(task);
    }

    public TaskResponse update(Long id, UpdateTaskRequest request) {
        Task task = findTaskById(id);

        if (request.name() != null) {
            task.updateName(request.name());
        }

        if (request.description() != null) {
            task.updateDescription(request.description());
        }

        if (request.priority() != null) {
            task.updatePriority(request.priority());
        }

        if (request.status() != null) {
            task.updateStatus(request.status());
        }

        Task savedTask = taskRepository.save(task);

        return toResponse(savedTask);
    }

    public TaskResponse replace(Long id, ReplaceTaskRequest request) {
        Task task = findTaskById(id);

        task.updateName(request.name());
        task.updateDescription(request.description());
        task.updatePriority(request.priority());
        task.updateStatus(request.status());

        Task savedTask = taskRepository.save(task);

        return toResponse(savedTask);
    }

    public void delete(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));
    }
}