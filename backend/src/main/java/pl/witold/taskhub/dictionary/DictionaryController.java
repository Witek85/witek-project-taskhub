package pl.witold.taskhub.dictionary;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.witold.taskhub.dictionary.dto.DictionaryOptionResponse;
import pl.witold.taskhub.task.TaskPriority;
import pl.witold.taskhub.task.TaskStatus;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/dictionary")
public class DictionaryController {

    @GetMapping("/priorities")
    public List<DictionaryOptionResponse> getPriorities() {
        return Arrays.stream(TaskPriority.values())
                .map(priority -> new DictionaryOptionResponse(
                        priority.getLabel(),
                        priority.name()
                        ))
                .toList();
    }

    @GetMapping("/statuses")
    public List<DictionaryOptionResponse> getStatuses() {
        return Arrays.stream(TaskStatus.values())
                .map(status -> new DictionaryOptionResponse(
                        status.getLabel(),
                        status.name()
                ))
                .toList();
    }
}