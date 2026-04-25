package in.sounodip.Cloudshare.document;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "saved_files")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SavedFilesDocument {

    @Id
    private String id;
    private String fileId;
    private String clerkId;
    private String fileName;
    private Long size;
    private String ownerName;
    private LocalDateTime uploadedAt;
    private LocalDateTime savedAt;
}
