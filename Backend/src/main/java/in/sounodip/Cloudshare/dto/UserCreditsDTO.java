package in.sounodip.Cloudshare.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreditsDTO {

    private String userId;
    private String clerkId;
    private Integer credits;
    private String plan;

}
