package in.sounodip.Cloudshare.service;

import com.mongodb.internal.time.Timeout;
import in.sounodip.Cloudshare.document.FileMetadataDocument;
import in.sounodip.Cloudshare.document.ProfileDocument;
import in.sounodip.Cloudshare.dto.FileMetadataDTO;
import in.sounodip.Cloudshare.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final FileMetadataRepository fileMetadataRepository;

    public List<FileMetadataDTO> uploadFiles(MultipartFile files[]) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> savedFiles = new ArrayList<>();

        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new RuntimeException("Not enough credits to upload.Please purchase more credits");
        }

        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for (MultipartFile file:files){
            String fileName = UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadataDocument fileMetadata = FileMetadataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .type(file.getContentType())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();
            userCreditsService.consumeCredit();

            savedFiles.add(fileMetadataRepository.save(fileMetadata));
        }
        return savedFiles.stream().map(fileMetadataDocument -> mapToDTO(fileMetadataDocument))
                .collect(Collectors.toList());
    }

    private FileMetadataDTO mapToDTO(FileMetadataDocument fileMetadataDocument) {
        return   FileMetadataDTO.builder()
                .id(fileMetadataDocument.getId())
                .fileLocation(fileMetadataDocument.getFileLocation())
                .name(fileMetadataDocument.getName())
                .size(fileMetadataDocument.getSize())
                .type(fileMetadataDocument.getType())
                .clerkId(fileMetadataDocument.getClerkId())
                .isPublic(fileMetadataDocument.isPublic())
                .uploadedAt(fileMetadataDocument.getUploadedAt())
                .build();

    }
    public List<FileMetadataDTO> getFiles(){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> files = fileMetadataRepository.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FileMetadataDTO getPublicFile(String id){
        Optional<FileMetadataDocument> fileOptional = fileMetadataRepository.findById(id);
        if (fileOptional.isEmpty() || !fileOptional.get().isPublic()){
            throw new RuntimeException("Unable to get the file");
        }

        FileMetadataDocument document = fileOptional.get();
        return mapToDTO(document);
    }

    public FileMetadataDTO getDownloadableFile(String id){
        FileMetadataDocument file = fileMetadataRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        return mapToDTO(file);
    }

    public void deleteFile(String id){
        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not found"));
            if (!file.getClerkId().equals(currentProfile.getClerkId())){
                throw new RuntimeException("File does not belong to current user");
            }
            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);

            fileMetadataRepository.deleteById(id);
        } catch (Exception e){
            throw new RuntimeException("Error deleting the file");
        }
    }

    private static final Map<String, String> EXTENSION_TO_MIME_TYPE = Map.ofEntries(
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

    public String getMimeTypeFromExtension(String extension) {
        if (extension == null) return "application/octet-stream"; // default
        extension = extension.toLowerCase().replace(".", "");
        return EXTENSION_TO_MIME_TYPE.getOrDefault(extension, "application/octet-stream");
    }

    public FileMetadataDTO renameFile(String id, String newNameWithExtension)  {
        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            if (!file.getClerkId().equals(currentProfile.getClerkId())){
                throw new RuntimeException("File does not belong to current user");
            }
            file.setName(newNameWithExtension);
            String extension = StringUtils.getFilenameExtension(newNameWithExtension);
            file.setType(getMimeTypeFromExtension(extension));
            fileMetadataRepository.save(file);
            return mapToDTO(file);

        }catch(Exception e){
            throw new RuntimeException("Error editing the file");
        }
    }

    public FileMetadataDTO togglePublic(String id){
        FileMetadataDocument file =fileMetadataRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("File not found"));

        file.setPublic(!file.isPublic());
        fileMetadataRepository.save(file);
        return mapToDTO(file);
    }
}
