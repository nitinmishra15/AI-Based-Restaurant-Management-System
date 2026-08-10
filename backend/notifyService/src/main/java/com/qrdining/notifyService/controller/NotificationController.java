package com.qrdining.notifyService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qrdining.notifyService.dto.ApiResponse;
import com.qrdining.notifyService.dto.OrderEmailRequest;
import com.qrdining.notifyService.dto.OtpRequest;
import com.qrdining.notifyService.dto.OtpResponse;
import com.qrdining.notifyService.dto.PaymentNotificationRequest;
import com.qrdining.notifyService.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@RequestBody OtpRequest request) {
        if (request == null || request.getMobileNumber() == null || request.getMobileNumber().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new OtpResponse(false, "Mobile number cannot be empty.", null));
        }
        
        OtpResponse response = notificationService.sendOtp(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/send-order-email")
    public ResponseEntity<ApiResponse> sendOrderEmail(@RequestBody OrderEmailRequest request) {
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Request body is required."));
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Recipient email is required."));
        }
        if (request.getOrderId() == null || request.getOrderId().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Order ID is required."));
        }

        ApiResponse response = notificationService.sendOrderConfirmationEmail(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/send-payment-notification")
    public ResponseEntity<ApiResponse> sendPaymentNotification(@RequestBody PaymentNotificationRequest request) {
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Request body is required."));
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Recipient email is required."));
        }
        if (request.getOrderId() == null || request.getOrderId().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Order ID is required."));
        }
        if (request.getPaymentId() == null || request.getPaymentId().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Payment ID is required."));
        }

        ApiResponse response = notificationService.sendPaymentNotification(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Global Exception Handler for this controller to return JSON formatted errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneralException(Exception ex) {
        System.out.println("[CONTROLLER ERROR] Unhandled Exception: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "An internal error occurred: " + ex.getMessage()));
    }
}
