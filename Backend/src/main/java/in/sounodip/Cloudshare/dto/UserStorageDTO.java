package in.sounodip.Cloudshare.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStorageDTO {

    private String userId;
    private Long storage; //in KB
    private String plan;

}
