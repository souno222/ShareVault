package in.sounodip.Cloudshare.service;

import in.sounodip.Cloudshare.exceptions.RateLimitingException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Resolves the bucket for a given user ID, creating a new one if it doesn't exist.
    public Bucket resolveBucket(String userId) {
        return buckets.computeIfAbsent(userId, this::createNewBucket);
    }

    // Creates a new bucket with a limit of 5 requests per minute for the given user ID.
    private Bucket createNewBucket(String userId) {
        Bandwidth limit = Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    // Tries to consume a token from the bucket for the given user ID.
    // If the bucket is empty, it throws a RateLimitingException with the time to wait before the next request can be made.
    public boolean tryConsume(String userId) {
        ConsumptionProbe probe = resolveBucket(userId).tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            long waitTimeSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
            throw new RateLimitingException("Too many requests. Try again in " + waitTimeSeconds + " seconds.");
        }
        return true;
    }
}
