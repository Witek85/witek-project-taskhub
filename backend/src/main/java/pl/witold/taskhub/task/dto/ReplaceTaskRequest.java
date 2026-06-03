package pl.witold.taskhub.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import pl.witold.taskhub.task.TaskPriority;
import pl.witold.taskhub.task.TaskStatus;

public record ReplaceTaskRequest(
        @NotBlank
        @Size(max = 255)
        String name,

        @Size(max = 2000)
        String description,

        @NotNull
        TaskPriority priority,

        @NotNull
        TaskStatus status
) {
}