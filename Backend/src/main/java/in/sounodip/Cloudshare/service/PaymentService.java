package in.sounodip.Cloudshare.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import in.sounodip.Cloudshare.document.PaymentTransaction;
import in.sounodip.Cloudshare.document.ProfileDocument;
import in.sounodip.Cloudshare.dto.PaymentDTO;
import in.sounodip.Cloudshare.dto.PaymentVerificationDTO;
import in.sounodip.Cloudshare.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final UserStorageService userStorageService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentDTO createOrder(PaymentDTO paymentDTO){
        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId,razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",paymentDTO.getAmount());
            orderRequest.put("currency",paymentDTO.getCurrency());
            orderRequest.put("receipt","order_"+System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");

            //create pending transaction record
            PaymentTransaction transaction = PaymentTransaction.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDTO.getPlanId())
                    .amount(paymentDTO.getAmount())
                    .currency(paymentDTO.getCurrency())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .userName(currentProfile.getFirstName()+" "+currentProfile.getLastName())
                    .build();

            paymentTransactionRepository.save(transaction);

            return PaymentDTO.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Order created successfully")
                    .build();

        }catch(Exception e){
            return PaymentDTO.builder()
                    .success(false)
                    .message("Error creating order:" + e.getMessage())
                    .build();
        }

    }

    public PaymentDTO verifyPayment(PaymentVerificationDTO request){

        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            String data = request.getRazorpay_order_id() + "|" + request.getRazorpay_payment_id();

            String generatedSignature = generateHmacSha256Signature(data,razorpayKeySecret);

            if(!generatedSignature.equals(request.getRazorpay_signature())){
                updateTransactionStatus(request.getRazorpay_order_id(), "FAILED" , request.getRazorpay_payment_id(), null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Payment signature verification failed")
                        .build();
            }

            //Add storage based on plan
            Long storageToAdd=0L;
            String plan = "BASIC";
            String planId = request.getPlanId() != null ? request.getPlanId().toUpperCase() : "";

            switch (planId){
                case "PREMIUM":
                    storageToAdd=25000000L;
                    plan  = "PREMIUM";
                    break;
                case "ULTIMATE":
                    storageToAdd=75000000L;
                    plan = "ULTIMATE";
                    break;

            }


            if(storageToAdd > 0){
                userStorageService.addStorage(clerkId, storageToAdd, plan);
                updateTransactionStatus(request.getRazorpay_order_id(), "SUCCESS", request.getRazorpay_payment_id(), storageToAdd);
                return PaymentDTO.builder()
                        .success(true)
                        .message("Payment verified and storage added succesfully")
                        .storage(userStorageService.getUserStorage(clerkId).getStorage())
                        .build();
            } else{
                updateTransactionStatus(request.getRazorpay_order_id(),"FAILED", request.getRazorpay_payment_id(), null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Invalid plan selected")
                        .build();
            }
        }catch(Exception e){
            e.printStackTrace();
            try{
                updateTransactionStatus(request.getRazorpay_order_id(), "ERROR", request.getRazorpay_payment_id(), null );
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            return PaymentDTO.builder()
                    .success(false)
                    .message("Error verifying payment:" + e.getMessage())
                    .build();
        }
    }

    private String generateHmacSha256Signature(String data, String secret) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(
                    secret.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC SHA256 signature", e);
        }
    }


    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Long storageToAdd) {
        paymentTransactionRepository.findAll().stream()
                .filter(t -> t.getOrderId() != null && t.getOrderId().equals(razorpayOrderId))
                .findFirst()
                .map(transaction -> {
                    transaction.setStatus(status);
                    transaction.setPaymentId(razorpayPaymentId);
                    if(storageToAdd != null){
                        transaction.setStorageAdded(storageToAdd);
                    }
                    return paymentTransactionRepository.save(transaction);
                })
                .orElse(null);
    }
}
