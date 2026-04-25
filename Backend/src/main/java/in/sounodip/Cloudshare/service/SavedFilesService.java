package in.sounodip.Cloudshare.service;

import in.sounodip.Cloudshare.document.FileMetadataDocument;
import in.sounodip.Cloudshare.document.ProfileDocument;
import in.sounodip.Cloudshare.document.SavedFilesDocument;
import in.sounodip.Cloudshare.dto.SavedFilesDTO;
import in.sounodip.Cloudshare.exceptions.AccessDeniedException;
import in.sounodip.Cloudshare.repository.FileMetadataRepository;
import in.sounodip.Cloudshare.repository.ProfileRepository;
import in.sounodip.Cloudshare.repository.SavedFilesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedFilesService {
    private final ProfileService profileService;
    private final ProfileRepository profileRepository;
    private final SavedFilesRepository savedFilesRepository;
    private final FileMetadataRepository fileMetadataRepository;

    //Save file
    public SavedFilesDTO saveFile(String fileId){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        FileMetadataDocument file = fileMetadataRepository.findById(fileId)
                .orElseThrow(()->new AccessDeniedException("File not found"));

        //Check if file is already saved
        if(savedFilesRepository.existsByFileIdAndClerkId(fileId, currentProfile.getClerkId())){
            throw new AccessDeniedException("File is already saved");
        }

        //Check file access for current user
        boolean isOwner = file.getClerkId().equals(currentProfile.getClerkId());
        switch (file.getVisibility()) {
            case "private" -> {
                if (!isOwner) {
                    throw new AccessDeniedException("You don't have access to this file");
                }
            }
            case "protected" -> {
                if (!isOwner && (file.getAccessList() == null || !file.getAccessList().contains(currentProfile.getEmail()))) {
                    throw new AccessDeniedException("You don't have access to this file");
                }
            }
            case "public" -> {
                // Public files are accessible to everyone
            }
            default -> {
                throw new AccessDeniedException("Invalid file visibility");
            }
        }
        String ownerName = profileRepository.findByClerkId(file.getClerkId())
                .map(profile -> profile.getFirstName() + " " + profile.getLastName())
                .orElse("Unknown User");


        //Save file details in the saved files collection
        SavedFilesDocument savedFile = SavedFilesDocument.builder()
                .fileId(fileId)
                .fileName(fileMetadataRepository.findById(fileId).get().getName())
                .size(fileMetadataRepository.findById(fileId).get().getSize())
                .clerkId(currentProfile.getClerkId())
                .ownerName(ownerName)
                .uploadedAt(file.getUploadedAt())
                .savedAt(LocalDateTime.now())
                .build();
        savedFilesRepository.save(savedFile);

        return mapToDTO(savedFile);

    }

    private SavedFilesDTO mapToDTO(SavedFilesDocument savedFilesDocument){
        return SavedFilesDTO.builder()
                .id(savedFilesDocument.getId())
                .fileId(savedFilesDocument.getFileId())
                .size(savedFilesDocument.getSize())
                .clerkId(savedFilesDocument.getClerkId())
                .fileName(savedFilesDocument.getFileName())
                .ownerName(savedFilesDocument.getOwnerName())
                .uploadedAt(savedFilesDocument.getUploadedAt())
                .savedAt(savedFilesDocument.getSavedAt())
                .build();
    }

    //get list of saved files
    public List<SavedFilesDTO> getSavedFiles(){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<SavedFilesDocument> savedFiles = savedFilesRepository.findByClerkId(currentProfile.getClerkId());
        return savedFiles.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    //remove saved file
    public void removeSavedFile(String savedFileId){
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String currentClerkId = currentProfile.getClerkId();
            SavedFilesDocument savedFile = savedFilesRepository.findByFileIdAndClerkId(savedFileId, currentClerkId)
                    .orElseThrow(() -> new AccessDeniedException("Saved file not found"));
            if (!savedFile.getClerkId().equals(currentProfile.getClerkId())) {
                throw new AccessDeniedException("You don't have permission to delete this saved file");
            }
            savedFilesRepository.deleteByFileIdAndClerkId(savedFileId, currentClerkId);
        }
        catch (Exception e){
            throw new AccessDeniedException("Error removing saved file: " + e.getMessage());
        }
    }

    public boolean isFileSaved(String fileId){
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        return savedFilesRepository.existsByFileIdAndClerkId(fileId, currentProfile.getClerkId());
    }
}
