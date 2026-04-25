package in.sounodip.Cloudshare.exceptions;

// Custom exception to indicate access denial when a user does not have the permission to perform a certain action.
public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
