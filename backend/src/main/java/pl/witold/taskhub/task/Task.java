package pl.witold.taskhub.task;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.NEW;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    protected Task() {
    }

    public Task(String name, String description, TaskPriority priority) {
        this.name = name;
        this.description = description;
        this.priority = priority == null ? TaskPriority.MEDIUM : priority;
        this.status = TaskStatus.NEW;
    }

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public TaskPriority getPriority() { return priority; }
    public TaskStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void update(String name, String description, TaskPriority priority, TaskStatus status) {
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.status = status;
    }

    public void updateName(String name) {
        if (name != null) {
            this.name = name;
        }
    }

    public void updateDescription(String description) {
        if (description != null) {
            this.description = description;
        }
    }

    public void updatePriority(TaskPriority priority) {
        if (priority != null) {
            this.priority = priority;
        }
    }

    public void updateStatus(TaskStatus status) {
        if (status != null) {
            this.status = status;
        }
    }
}