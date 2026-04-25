package in.sounodip.Cloudshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SavedFilesDTO {
    private String id;
    private String fileId;
    private String fileName;
    private Long size;
    private String clerkId;
    private String ownerName;
    private LocalDateTime uploadedAt;
    private LocalDateTime savedAt;
}
