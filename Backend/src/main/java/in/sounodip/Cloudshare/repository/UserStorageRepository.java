package in.sounodip.Cloudshare.repository;

import in.sounodip.Cloudshare.document.UserStorageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface UserStorageRepository extends MongoRepository<UserStorageDocument,String> {
    Optional<UserStorageDocument> findByClerkId(String clerkId);


}
