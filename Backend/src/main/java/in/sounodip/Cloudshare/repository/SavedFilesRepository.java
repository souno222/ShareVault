package in.sounodip.Cloudshare.repository;

import in.sounodip.Cloudshare.document.SavedFilesDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SavedFilesRepository extends MongoRepository<SavedFilesDocument,String> {
    List<SavedFilesDocument> findByClerkId(String clerkId);
    boolean existsByFileIdAndClerkId(String fileId, String clerkId);
    Optional<SavedFilesDocument> findByFileIdAndClerkId(String id, String clerkId);


    void deleteByFileIdAndClerkId(String id, String clerkId);

}
