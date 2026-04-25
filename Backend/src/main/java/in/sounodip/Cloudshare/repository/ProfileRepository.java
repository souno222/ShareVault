package in.sounodip.Cloudshare.repository;

import in.sounodip.Cloudshare.document.ProfileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfileRepository extends MongoRepository <ProfileDocument,String>{

    Optional<ProfileDocument> findByClerkId(String clerkId); // Changed to Optional
    Optional<ProfileDocument> findByEmail(String email);
    boolean existsByClerkId(String clerkId);

}
