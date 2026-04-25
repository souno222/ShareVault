package in.sounodip.Cloudshare.service;

import in.sounodip.Cloudshare.document.ProfileDocument;
import in.sounodip.Cloudshare.dto.ProfileDTO;
import in.sounodip.Cloudshare.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    // Service method for creating a new profile.
    public ProfileDTO createProfile(ProfileDTO profileDTO){
        if(profileRepository.existsByClerkId(profileDTO.getClerkId())){
            return updateProfile(profileDTO);
        }

        ProfileDocument profile = ProfileDocument.builder()
                .clerkId(profileDTO.getClerkId())
                .email(profileDTO.getEmail())
                .firstName(profileDTO.getFirstName())
                .lastName(profileDTO.getLastName())
                .photoUrl(profileDTO.getPhotoUrl())
                .storage(50000)
                .createdAt(Instant.now())
                .build();

        profile = profileRepository.save(profile);

        return ProfileDTO.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .photoUrl(profile.getPhotoUrl())
                .storage(profile.getStorage())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    // Service method for updating an existing profile. Only non-null and non-empty fields will be updated.
    public ProfileDTO updateProfile(ProfileDTO profileDTO){
        ProfileDocument existingProfile = profileRepository.findByClerkId(profileDTO.getClerkId())
                .orElse(null);
        if(existingProfile != null){
            if(profileDTO.getEmail() != null && !profileDTO.getEmail().isEmpty()){
                existingProfile.setEmail(profileDTO.getEmail());
            }
            if(profileDTO.getFirstName() != null && !profileDTO.getFirstName().isEmpty()){
                existingProfile.setFirstName(profileDTO.getFirstName());
            }
            if(profileDTO.getLastName() != null && !profileDTO.getLastName().isEmpty()){
                existingProfile.setLastName(profileDTO.getLastName());
            }
            if(profileDTO.getPhotoUrl() != null && !profileDTO.getPhotoUrl().isEmpty()){
                existingProfile.setPhotoUrl(profileDTO.getPhotoUrl());
            }
            profileRepository.save(existingProfile);
            return ProfileDTO.builder()
                    .id(existingProfile.getId())
                    .email(existingProfile.getEmail())
                    .clerkId(existingProfile.getClerkId())
                    .firstName(existingProfile.getFirstName())
                    .lastName(existingProfile.getLastName())
                    .photoUrl(existingProfile.getPhotoUrl())
                    .storage(existingProfile.getStorage())
                    .createdAt(existingProfile.getCreatedAt())
                    .build();
        }
        return null;
    }

    // Service method to check if a profile exists for a given clerkId.
    public boolean existsByClerkId(String ClerkId){
        return profileRepository.existsByClerkId(ClerkId);
    }

    // Service method to delete a profile by its clerkId. If the profile exists, it will be deleted.
    public void deleteProfile(String ClerkId){
        profileRepository.findByClerkId(ClerkId)
                .ifPresent(profileRepository::delete);
    }

    // Service method to retrieve the current user's profile based on the clerkId extracted from the JWT token.
    // If the user is not authenticated or if the profile does not exist, an exception will be thrown.
    public ProfileDocument getCurrentProfile(){
        if(SecurityContextHolder.getContext().getAuthentication() == null){
            throw new UsernameNotFoundException("User not authenticated");
        }
        
        String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();

        return profileRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Profile not found for clerkId: " + clerkId + ". Please complete registration."
                ));
    }
}
