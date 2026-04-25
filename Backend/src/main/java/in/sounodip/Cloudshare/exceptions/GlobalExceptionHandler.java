package in.sounodip.Cloudshare.exceptions;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // Handle DuplicateKeyException for duplicate email registration
    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<?> handleDuplicateEmailException(DuplicateKeyException exception){
        Map<String,Object> data= new HashMap();
        data.put("status", HttpStatus.CONFLICT);
        data.put("message","Email already exists");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(data);
    }
    // Handle AccessDeniedException for unauthorized access attempts
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", ex.getMessage()));
    }

    // Handle RateLimitingException for too many requests
    @Order(Ordered.HIGHEST_PRECEDENCE)
    @ExceptionHandler(RateLimitingException.class)
    public ResponseEntity<?> handleRateLimiting(RateLimitingException ex) {
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of("error", ex.getMessage()));
    }
}
