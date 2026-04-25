package in.sounodip. Cloudshare.controller;

import in.sounodip.Cloudshare.document.UserStorageDocument;
import in.sounodip.Cloudshare. dto.AccessRequestDTO;
import in.sounodip. Cloudshare.dto.FileMetadataDTO;
import in. sounodip.Cloudshare.service.FileMetadataService;
import in.sounodip.Cloudshare.service.CloudStorageService;
import in.sounodip.Cloudshare.service. UserStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core. io.InputStreamResource;
import org.springframework. http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http. ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {
    private final FileMetadataService fileMetadataService;
    private final UserStorageService userStorageService;
    private final CloudStorageService cloudStorageService;

    //Endpoint for uploading multiple files to the R2 storage and save metadata to MongoDB. Returns metadata and remaining storage after upload.
    @PostMapping("/upload")
    public ResponseEntity<? > uploadFiles(@RequestPart("files") MultipartFile[] files) throws IOException {
        Map<String, Object> response = new HashMap<>();
        List<FileMetadataDTO> list = fileMetadataService.uploadFiles(files);
        UserStorageDocument finalStorage = userStorageService.getUserStorage();
        response.put("files", list);
        response.put("remainingStorage", finalStorage.getStorage());
        return ResponseEntity.ok(response);
    }

    //Endpoint for renaming file while keeping the same id and metadata.
    @PatchMapping("/rename/{id}")
    public ResponseEntity<FileMetadataDTO> renameFile(
            @PathVariable String id,
            @RequestParam("newName") String newNameWithExtension) {
        FileMetadataDTO updatedFile = fileMetadataService.renameFile(id, newNameWithExtension);
        return ResponseEntity. ok(updatedFile);
    }

    //Endpoint for getting all files uploaded by the current user.
    @GetMapping("/my")
    public ResponseEntity<? > getFilesForCurrentUser() {
        List<FileMetadataDTO> files = fileMetadataService.getFiles();
        return ResponseEntity.ok(files);
    }

    //Endpoint for getting metadata for a specific file by ID.
    @GetMapping("/view/{id}")
    public ResponseEntity<? > getFile(@PathVariable String id) {
        FileMetadataDTO file = fileMetadataService.getFile(id);
        return ResponseEntity.ok(file);
    }

    //Endpoint for downloading file from R2 using metadata and stream it to the client.
    @GetMapping("/download/{id}")
    public ResponseEntity<?> download(@PathVariable String id) {
        try {
            FileMetadataDTO downloadableFile = fileMetadataService.getDownloadableFile(id);
            // Download from R2
            InputStream fileStream = cloudStorageService.downloadFile(downloadableFile.getFileLocation());
            InputStreamResource resource = new InputStreamResource(fileStream);
            // Determine media type
            MediaType mediaType;
            try {
                String extension = downloadableFile.getName().substring(downloadableFile.getName().lastIndexOf(".") + 1);
                String mimeType = fileMetadataService.getMimeTypeFromExtension(extension);
                mediaType = MediaType.parseMediaType(mimeType);
            } catch (Exception e) {
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }
            
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .contentLength(downloadableFile.getSize())
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + downloadableFile.getName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            
            // Return error response with details
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage() != null ? e.getMessage() : "Download failed");
            errorResponse.put("fileId", id);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    //Endpoint for deleting a file by ID. Removes metadata from MongoDB and deletes the file from R2. Also updates user storage.
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id) {
        fileMetadataService.deleteFile(id);
        return ResponseEntity. noContent().build();
    }

    //Endpoint for changing file visibility (public/private/protected).
    // For protected files, only users in access list can download.
    // For private file,only owners can download.
    // For public files, anyone with the link can download.
    @PatchMapping("/{id}/visibility")
    public ResponseEntity<?> changeVisibility(
            @PathVariable String id,
            @RequestParam("visibility") String visibility) {
        FileMetadataDTO file = fileMetadataService.changeVisibility(id, visibility);
        return ResponseEntity.ok(file);
    }

    //Endpoint for adding emails to access list for protected files
    @PostMapping("/{id}/access")
    public ResponseEntity<?> addToAccessList(
            @PathVariable String id,
            @RequestBody AccessRequestDTO accessRequest) {
        FileMetadataDTO file = fileMetadataService. addToAccessList(id, accessRequest.getEmails());
        return ResponseEntity.ok(file);
    }

    //Endpoint for removing emails from access list for protected files
    @DeleteMapping("/{id}/access")
    public ResponseEntity<?> removeFromAccessList(
            @PathVariable String id,
            @RequestBody AccessRequestDTO accessRequest) {
        FileMetadataDTO file = fileMetadataService. removeFromAccessList(id, accessRequest.getEmails());
        return ResponseEntity.ok(file);
    }

    //Endpoint for getting access list for a protected file. Returns list of emails that have access to the file.
    @GetMapping("/{id}/access-list")
    public ResponseEntity<?> getAccessList(@PathVariable String id) {
        System.out.println("Requesting access list for file ID: " + id);
        List<String> accessList = fileMetadataService. getAccessList(id);
        Map<String, Object> response = new HashMap<>();
        response.put("accessList", accessList);
        return ResponseEntity.ok(response);
    }
}