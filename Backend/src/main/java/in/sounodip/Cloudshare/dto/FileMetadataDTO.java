package in.sounodip.Cloudshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileMetadataDTO {

    private String id;
    private String name;
    private String type;
    private Long size;
    private String ownerName;
    private String clerkId;
    //deprecated value
    //private boolean isPublic;
    private String visibility;
    private String fileLocation;
    private LocalDateTime uploadedAt;
    @Builder.Default
    private List<String> accessList = new ArrayList<>();
}
