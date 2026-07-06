package pl.witold.taskhub.tag;

import jakarta.persistence.*;

@Entity
@Table(
        name = "tags",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_tags_code", columnNames = "code")
        }
)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(length = 30)
    private String color;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false)
    private boolean active = true;

    protected Tag() {
    }

    public Tag(String code, String label, String color, Integer sortOrder) {
        this.code = code;
        this.label = label;
        this.color = color;
        this.sortOrder = sortOrder;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    public String getColor() {
        return color;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public boolean isActive() {
        return active;
    }
}