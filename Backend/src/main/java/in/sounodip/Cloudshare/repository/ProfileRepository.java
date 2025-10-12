package in.sounodip.Cloudshare.repository;

import in.sounodip.Cloudshare.document.ProfileDocument;
import in.sounodip.Cloudshare.dto.ProfileDTO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfileRepository extends MongoRepository <ProfileDocument,String>{

    Optional<ProfileDocument>findByEmail(String email);
    ProfileDocument findByClerkId(String ClerkId);
    boolean existsByClerkId(String ClerkId);
}
