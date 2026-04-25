package in.sounodip.Cloudshare.controller;


import in.sounodip.Cloudshare.document.UserStorageDocument;
import in.sounodip.Cloudshare.dto.UserStorageDTO;
import in.sounodip.Cloudshare.service.UserStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/users")
@RestController
@RequiredArgsConstructor
public class UserStorageController {

    private final UserStorageService userStorageService;

    //Endpoint to get the current user's remaining storage and plan details.
    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(){
        UserStorageDocument userStorageDocument = userStorageService.getUserStorage();
        UserStorageDTO response = UserStorageDTO.builder()
                .storage(userStorageDocument.getStorage())
                .plan(userStorageDocument.getPlan())
                .build();
        return ResponseEntity.ok(response);
    }
}
