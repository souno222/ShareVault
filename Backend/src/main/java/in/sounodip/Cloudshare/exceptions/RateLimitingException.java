package in.sounodip.Cloudshare.exceptions;

// Custom exception to indicate that a user has exceeded the allowed number of requests within a certain time frame.
public class RateLimitingException extends RuntimeException {
    public RateLimitingException(String message) {
        super(message);
    }
}
