package in. sounodip.Cloudshare.service;

import in. sounodip.Cloudshare. document.FileMetadataDocument;
import in.sounodip.Cloudshare.document.ProfileDocument;
import in.sounodip.Cloudshare.dto.FileMetadataDTO;
import in.sounodip.Cloudshare.exceptions.AccessDeniedException;
import in.sounodip. Cloudshare.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype. Service;
import org.springframework. util.StringUtils;
import org. springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java. util.*;
import java.util.stream. Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {

    private final ProfileService profileService;
    private final UserStorageService userStorageService;
    private final FileMetadataRepository fileMetadataRepository;
    private final CloudStorageService cloudStorageService;

    // Service method to handle file uploads, save metadata to MongoDB, and return metadata along with remaining storage.
    public List<FileMetadataDTO> uploadFiles(MultipartFile[] files) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> uploadedFiles = new ArrayList<>();

        long totalUploadBytes = Arrays.stream(files).mapToLong(MultipartFile::getSize).sum();
        if (!userStorageService.hasEnoughStorage(totalUploadBytes)) {
            throw new AccessDeniedException("Not enough credits to upload. Please purchase more credits");
        }

        for (MultipartFile file : files){
            // Generate unique key for R2 storage
            String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String r2Key = UUID.randomUUID() + "." + fileExtension;

            // Upload to R2
            String uploadedKey = cloudStorageService.uploadFile(file, r2Key);

            FileMetadataDocument fileMetadata = FileMetadataDocument.builder()
                    .fileLocation(uploadedKey) // Store R2 key instead of file path
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .ownerName(currentProfile.getFirstName() + " " + currentProfile.getLastName())
                    .type(file.getContentType())
                    .clerkId(currentProfile.getClerkId())
                    .visibility("private")
                    .accessList(new ArrayList<>())
                    .uploadedAt(LocalDateTime.now())
                    .build();

            userStorageService.consumeStorage(file.getSize());

            uploadedFiles.add(fileMetadataRepository.save(fileMetadata));
        }
        return uploadedFiles.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert FileMetadataDocument to FileMetadataDTO for API responses.
    private FileMetadataDTO mapToDTO(FileMetadataDocument fileMetadataDocument) {
        return FileMetadataDTO.builder()
                .id(fileMetadataDocument.getId())
                .fileLocation(fileMetadataDocument. getFileLocation())
                .name(fileMetadataDocument.getName())
                .size(fileMetadataDocument.getSize())
                .ownerName(fileMetadataDocument.getOwnerName())
                .type(fileMetadataDocument.getType())
                .visibility(fileMetadataDocument.getVisibility())
                .accessList(fileMetadataDocument.getAccessList())
                .uploadedAt(fileMetadataDocument.getUploadedAt())
                .build();
    }

    // Service method to retrieve all files uploaded by the current user.
    public List<FileMetadataDTO> getFiles(){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> files = fileMetadataRepository.findByClerkId(currentProfile. getClerkId());
        return files.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // Service method to retrieve metadata for a specific file by ID, with access control based on visibility settings.
    public FileMetadataDTO getFile(String id) {
        FileMetadataDocument file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new AccessDeniedException("File not found"));

        ProfileDocument currentProfile = profileService.getCurrentProfile();

        String visibility = file.getVisibility();

        // Owner always has access
        if (file.getClerkId().equals(currentProfile.getClerkId())) {
            return mapToDTO(file);
        }

        // Public files are accessible to everyone
        if ("public".equals(visibility)) {
            return mapToDTO(file);
        }

        // Private files are only accessible to owner
        if ("private".equals(visibility)) {
            throw new AccessDeniedException("Access denied. This file is private");
        }

        // Protected files require email in access list
        if ("protected". equals(visibility)) {
            String userEmail = currentProfile.getEmail();
            if (userEmail == null || ! file.getAccessList().contains(userEmail. toLowerCase())) {
                throw new AccessDeniedException("Access denied. You don't have permission to view this file");
            }
            return mapToDTO(file);
        }
        throw new AccessDeniedException("Access denied");
    }

    // Service method to get the file size for a specific file by ID, used for storage management when deleting files.
    public long getFileSize(String id){
        Optional<FileMetadataDocument> fileOptional = fileMetadataRepository.findById(id);
        return fileOptional.get().getSize();
    }

    //Service method for getting metadata for a specific file by ID, with access control for downloading based on visibility settings. Similar to getFile but focused on download permissions.
    public FileMetadataDTO getDownloadableFile(String id){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        FileMetadataDocument file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new AccessDeniedException("File not found"));

        validateFileAccess(file, currentProfile);

        return mapToDTO(file);
    }

    // Helper method to validate access to a file based on its visibility settings and the current user's profile.
    // Used for both viewing metadata and downloading files.
    private void validateFileAccess(FileMetadataDocument file, ProfileDocument currentProfile) {
        String visibility = file.getVisibility();

        // Owner always has access
        if (file.getClerkId().equals(currentProfile.getClerkId())){
            return;
        }

        // Public files are accessible to everyone
        if ("public".equals(visibility)){
            return;
        }

        // Private files are only accessible to owner
        if ("private".equals(visibility)){
            throw new AccessDeniedException("Access denied. This file is private");
        }

        // Protected files require email in access list
        if ("protected".equals(visibility)){
            String userEmail = currentProfile.getEmail();
            if (userEmail == null || !file.getAccessList().contains(userEmail.toLowerCase())){
                throw new AccessDeniedException("Access denied. You don't have permission to access this file");
            }
            return;
        }

        throw new AccessDeniedException("Access denied");
    }

    // Service method to delete a file by ID.
    // It checks if the file belongs to the current user, releases storage, deletes the file from R2, and removes metadata from MongoDB.
    public void deleteFile(String id){
        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new AccessDeniedException("File not found"));

            if (!file.getClerkId().equals(currentProfile.getClerkId())){
                throw new AccessDeniedException("File does not belong to current user");
            }
            // Release storage before deleting the file
            userStorageService.releaseStorage(getFileSize(id));

            // Delete from R2
            cloudStorageService.deleteFile(file.getFileLocation());

            // Delete metadata from database
            fileMetadataRepository.deleteById(id);
        } catch (Exception e){
            throw new AccessDeniedException("Error deleting the file: " + id);
        }
    }

    // Helper method to determine MIME type based on file extension.
    // Used when renaming files to update the MIME type accordingly.
    private static final Map<String, String> EXTENSION_TO_MIME_TYPE = Map. ofEntries(
            Map.entry("pdf", "application/pdf"),
            Map.entry("jpg", "image/jpeg"),
            Map.entry("jpeg", "image/jpeg"),
            Map.entry("png", "image/png"),
            Map.entry("txt", "text/plain"),
            Map.entry("html", "text/html"),
            Map.entry("csv", "text/csv"),
            Map.entry("mp4", "video/mp4"),
            Map.entry("mp3", "audio/mpeg")
    );

    // Service method to get MIME type from file extension.
    // Returns "application/octet-stream" for unknown extensions or if extension is null.
    public String getMimeTypeFromExtension(String extension) {
        if (extension == null) return "application/octet-stream";
        extension = extension.toLowerCase(). replace(".", "");
        return EXTENSION_TO_MIME_TYPE.getOrDefault(extension, "application/octet-stream");
    }

    //Service method to rename a file by ID.
    // It checks if the file belongs to the current user, updates the name and MIME type based on the new extension, and saves the changes to MongoDB.
    public FileMetadataDTO renameFile(String id, String newNameWithExtension) {
        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new AccessDeniedException("File not found"));

            if (!file.getClerkId().equals(currentProfile.getClerkId())){
                throw new AccessDeniedException("File does not belong to current user");
            }

            file.setName(newNameWithExtension);
            String extension = StringUtils.getFilenameExtension(newNameWithExtension);
            file.setType(getMimeTypeFromExtension(extension));
            fileMetadataRepository.save(file);
            return mapToDTO(file);

        } catch(Exception e){
            throw new AccessDeniedException("Error editing the file: " + id);
        }
    }

    // Service method to change the visibility of a file by ID.
    public FileMetadataDTO changeVisibility(String id, String newVisibility){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        FileMetadataDocument file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getClerkId().equals(currentProfile.getClerkId())){
            throw new AccessDeniedException("File does not belong to current user");
        }

        // Validate visibility value
        if (! Arrays.asList("private", "public", "protected").contains(newVisibility)){
            throw new AccessDeniedException("Invalid visibility value. Must be 'private', 'public', or 'protected'");
        }

        file.setVisibility(newVisibility);

        // Clear access list if changing from protected to something else
        if (!"protected".equals(newVisibility)){
            file.setAccessList(new ArrayList<>());
        }

        fileMetadataRepository.save(file);
        return mapToDTO(file);
    }

    public FileMetadataDTO addToAccessList(String id, List<String> emails){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        FileMetadataDocument file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new AccessDeniedException("File not found"));

        if (!file. getClerkId().equals(currentProfile.getClerkId())){
            throw new AccessDeniedException("File does not belong to current user");
        }

        if (!"protected".equals(file.getVisibility())){
            throw new AccessDeniedException("File must be protected to manage access list");
        }

        // Normalize emails to lowercase and add to access list
        List<String> normalizedEmails = emails.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .filter(email -> !email.isEmpty())
                .toList();

        List<String> currentAccessList = file.getAccessList();
        if (currentAccessList == null){
            currentAccessList = new ArrayList<>();
        }

        // Add new emails (avoiding duplicates)
        for (String email : normalizedEmails){
            if (!currentAccessList.contains(email)){
                currentAccessList.add(email);
            }
        }
        file.setAccessList(currentAccessList);
        fileMetadataRepository.save(file);
        return mapToDTO(file);
    }

    // Service method to remove emails from the access list of a protected file by ID.
    // It checks if the file belongs to the current user, verifies that the file is protected, and then removes the specified emails from the access list before saving the changes to MongoDB.
    public FileMetadataDTO removeFromAccessList(String id, List<String> emails){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        FileMetadataDocument file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new AccessDeniedException("File not found"));

        if (! file.getClerkId().equals(currentProfile.getClerkId())){
            throw new AccessDeniedException("File does not belong to current user");
        }

        if (!"protected".equals(file.getVisibility())){
            throw new AccessDeniedException("File must be protected to manage access list");
        }

        // Normalize emails to lowercase
        List<String> normalizedEmails = emails.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .toList();

        List<String> currentAccessList = file.getAccessList();
        if (currentAccessList != null){
            currentAccessList.removeAll(normalizedEmails);
            file.setAccessList(currentAccessList);
            fileMetadataRepository.save(file);
        }

        return mapToDTO(file);
    }

    // Service method to retrieve the access list for a protected file by ID.
    public List<String> getAccessList(String id){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        FileMetadataDocument file = fileMetadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getClerkId().equals(currentProfile.getClerkId())){
            throw new AccessDeniedException("File does not belong to current user");
        }

        return file.getAccessList() != null ? file.getAccessList() : new ArrayList<>();
    }

}