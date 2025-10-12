package in.sounodip.Cloudshare.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "user_credits")
public class UserCredits {
    @Id
    private String id;
    @Indexed(unique = true)
    private String clerkId;
    private Integer credits;
    private String plan; //Free,Premium,Ultimate

}
