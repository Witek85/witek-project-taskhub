package pl.witold.taskhub.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import pl.witold.taskhub.task.TaskPriority;

public record CreateTaskRequest(
        @NotBlank
        @Size(max = 255)
        String name,

        @Size(max = 2000)
        String description,

        TaskPriority priority
) {
}