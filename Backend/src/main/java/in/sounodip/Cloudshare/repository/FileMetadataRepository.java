package in.sounodip.Cloudshare.repository;

import in.sounodip.Cloudshare.document.FileMetadataDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FileMetadataRepository extends MongoRepository<FileMetadataDocument,String> {

    List<FileMetadataDocument> findByClerkId(String clerkId);
    Optional<FileMetadataDocument> findById(String id);
    String findClerkIdById(String id);
    Long countByClerkId(String clerkId);

}
