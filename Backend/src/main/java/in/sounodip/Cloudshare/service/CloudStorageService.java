package in.sounodip.Cloudshare.service;

import in.sounodip.Cloudshare.config.CloudStorageConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype. Service;
import org.springframework. web.multipart.MultipartFile;
import software.amazon. awssdk.core.sync.RequestBody;
import software.amazon.awssdk. services.s3.S3Client;
import software.amazon.awssdk.services.s3. model.*;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class CloudStorageService {

    private final S3Client s3Client;
    private final CloudStorageConfig cloudStorageConfig;

    //Upload files to object storage and return the key for the uploaded file.
    public String uploadFile(MultipartFile file, String key) throws IOException {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(cloudStorageConfig.getBucketName())
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return key;
        } catch (S3Exception e) {
            throw new RuntimeException("Error uploading file to R2: " + e.getMessage(), e);
        }
    }

    //Download file from object storage and return an InputStream for the file content.
    public InputStream downloadFile(String key) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(cloudStorageConfig.getBucketName())
                    .key(key)
                    .build();

            return s3Client.getObject(getObjectRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("Error downloading file from R2: " + e.getMessage(), e);
        }
    }

    //Delete a file from object storage by its key.
    public void deleteFile(String key) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(cloudStorageConfig.getBucketName())
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("Error deleting file from R2: " + e.getMessage(), e);
        }
    }

    //Check if a file exists in object storage by its key.
    public boolean fileExists(String key) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(cloudStorageConfig.getBucketName())
                    .key(key)
                    .build();

            s3Client.headObject(headObjectRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (S3Exception e) {
            throw new RuntimeException("Error checking file existence in R2: " + e.getMessage(), e);
        }
    }

    //Get the size of a file in object storage by its key.
    public long getFileSize(String key) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(cloudStorageConfig. getBucketName())
                    .key(key)
                    .build();

            HeadObjectResponse response = s3Client.headObject(headObjectRequest);
            return response.contentLength();
        } catch (S3Exception e) {
            throw new RuntimeException("Error getting file size from R2: " + e.getMessage(), e);
        }
    }
}