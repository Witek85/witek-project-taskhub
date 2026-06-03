package pl.witold.taskhub.task.dto;

import pl.witold.taskhub.task.TaskPriority;
import pl.witold.taskhub.task.TaskStatus;

import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String name,
        String description,
        TaskPriority priority,
        TaskStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}