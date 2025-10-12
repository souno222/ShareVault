package in.sounodip.Cloudshare.repository;

import in.sounodip.Cloudshare.document.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface UserCreditRepository extends MongoRepository<UserCredits,String> {
    Optional<UserCredits> findByClerkId(String clerkId);


}
