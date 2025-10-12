package in.sounodip.Cloudshare.service;

import in.sounodip.Cloudshare.document.ProfileDocument;
import in.sounodip.Cloudshare.dto.ProfileDTO;
import in.sounodip.Cloudshare.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor

public class ProfileService {
        private final ProfileRepository profileRepository;
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
                    .credits(5)
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
                    .credits(profile.getCredits())
                    .createdAt(profile.getCreatedAt())
                    .build();
        }
        public ProfileDTO updateProfile(ProfileDTO profileDTO){
            ProfileDocument existingProfile = profileRepository.findByClerkId(profileDTO.getClerkId());
            if(existingProfile!= null){
                //update fields if provided
                if(profileDTO.getEmail()!= null && !profileDTO.getEmail().isEmpty()){
                    existingProfile.setEmail(profileDTO.getEmail());
                }
                if(profileDTO.getFirstName() !=  null && !profileDTO.getFirstName().isEmpty()){
                    existingProfile.setFirstName(profileDTO.getFirstName());
                }
                if (profileDTO.getLastName() != null && !profileDTO.getLastName().isEmpty()){
                    existingProfile.setLastName(profileDTO.getLastName());
                }
                if (profileDTO.getPhotoUrl() != null && !profileDTO.getPhotoUrl().isEmpty()){
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
                        .credits(existingProfile.getCredits())
                        .createdAt(existingProfile.getCreatedAt())
                        .build();
            }
            return null;
        }
        public boolean existsByClerkId(String ClerkId){
            return profileRepository.existsByClerkId(ClerkId);
        }
        public void deleteProfile(String ClerkId){
            ProfileDocument existingProfile = profileRepository.findByClerkId(ClerkId);
            if(existingProfile != null){
                profileRepository.delete(existingProfile);
            }

        }

        public ProfileDocument getCurrentProfile(){
            if (SecurityContextHolder.getContext().getAuthentication() == null){
                throw new UsernameNotFoundException("User not authenticated");
            }
            String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();
            return profileRepository.findByClerkId(clerkId);
        }

}
