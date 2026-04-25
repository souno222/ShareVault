package in.sounodip.Cloudshare.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "files")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class FileMetadataDocument {

    @Id
    private String id;
    private String name;
    private String type;
    private Long size;
    private String clerkId;
    private String ownerName;
    private String visibility;
    private String fileLocation;
    private LocalDateTime uploadedAt;
    @Builder.Default
    private List<String> accessList = new ArrayList<>();
}
