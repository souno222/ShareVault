package in.sounodip.Cloudshare.service;


import in.sounodip.Cloudshare.document.UserCredits;
import in.sounodip.Cloudshare.repository.UserCreditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditRepository userCreditRepository;
    private final ProfileService profileService;
    public UserCredits createInitialCredits(String clerkId){
        UserCredits userCredits = UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("Free")
                .build();
        return userCreditRepository.save(userCredits);
    }
    public UserCredits getUserCredits(String clerkId){
        return userCreditRepository.findByClerkId(clerkId)
                .orElseGet(() -> createInitialCredits(clerkId));
    }

    public UserCredits getUserCredits(){
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    public Boolean hasEnoughCredits(int requiredCredits){
        UserCredits userCredits = getUserCredits();
        return userCredits.getCredits() >= requiredCredits;
    }
    public UserCredits consumeCredit(){
        UserCredits userCredits = getUserCredits();
        if( userCredits.getCredits()<= 0){
            return null;
        }
        userCredits.setCredits(userCredits.getCredits()-1);
        return userCreditRepository.save(userCredits);
    }
}
