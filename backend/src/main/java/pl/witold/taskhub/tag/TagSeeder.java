package pl.witold.taskhub.tag;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TagSeeder implements CommandLineRunner {

    private final TagRepository tagRepository;

    public TagSeeder(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public void run(String... args) {
        List<Tag> tags = List.of(
                new Tag("FRONTEND", "Frontend", "blue", 10),
                new Tag("BACKEND", "Backend", "green", 20),
                new Tag("DEVOPS", "DevOps", "orange", 30),
                new Tag("BUG", "Bug", "red", 40),
                new Tag("FEATURE", "Feature", "purple", 50),
                new Tag("REFACTOR", "Refactor", "gray", 60)
        );

        for (Tag tag : tags) {
            if (!tagRepository.existsByCode(tag.getCode())) {
                tagRepository.save(tag);
            }
        }
    }
}