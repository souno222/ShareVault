package in.sounodip.Cloudshare.service;

import in.sounodip.Cloudshare.document.UserStorageDocument;
import in.sounodip.Cloudshare.exceptions.AccessDeniedException;
import in.sounodip.Cloudshare.repository.UserStorageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserStorageService {

    private final UserStorageRepository userStorageRepository;
    private final ProfileService profileService;

    public UserStorageDocument createInitialStorage(String clerkId) {
        Long storage = 50000000L; // 50MB in bytes
        UserStorageDocument userStorageDocument = UserStorageDocument.builder()
                .clerkId(clerkId)
                .storage(storage)
                .maxStorage(storage)
                .plan("Free")
                .build();
        return userStorageRepository.save(userStorageDocument);
    }

    public UserStorageDocument getUserStorage(String clerkId) {
        return userStorageRepository.findByClerkId(clerkId)
                .orElseGet(() -> createInitialStorage(clerkId));
    }

    public UserStorageDocument getUserStorage() {
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserStorage(clerkId);
    }

    public Boolean hasEnoughStorage(Long requiredBytes) {
        UserStorageDocument userStorageDocument = getUserStorage();
        return userStorageDocument.getStorage() >= requiredBytes;
    }

    public void consumeStorage(Long fileSize) {
        UserStorageDocument userStorageDocument = getUserStorage();
        if (userStorageDocument.getStorage() < fileSize) {
            throw new AccessDeniedException("Not enough storage");
        }
        userStorageDocument.setStorage(userStorageDocument.getStorage() - fileSize);
        userStorageRepository.save(userStorageDocument);
    }

    public void releaseStorage(Long fileSize) {
        UserStorageDocument userStorageDocument = getUserStorage();
        long newStorage = userStorageDocument.getStorage() + fileSize;
        long max = userStorageDocument.getMaxStorage() != null
                ? userStorageDocument.getMaxStorage()
                : 50000000L;
        userStorageDocument.setStorage(Math.min(newStorage, max));
        userStorageRepository.save(userStorageDocument);
    }

    public UserStorageDocument addStorage(String clerkId, Long storageToAdd,String plan){
        UserStorageDocument userStorage = userStorageRepository.findByClerkId(clerkId)
                .orElseGet(() -> createInitialStorage(clerkId));

        userStorage.setStorage(userStorage.getStorage() + storageToAdd);
        userStorage.setPlan(plan);
        return userStorageRepository.save(userStorage);
    }
}
