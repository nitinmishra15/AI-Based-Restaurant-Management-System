package com.qrdining.notifyService.service;

import com.qrdining.notifyService.dto.ApiResponse;
import com.qrdining.notifyService.dto.OrderEmailRequest;
import com.qrdining.notifyService.dto.OtpRequest;
import com.qrdining.notifyService.dto.OtpResponse;
import com.qrdining.notifyService.dto.PaymentNotificationRequest;

public interface NotificationService {
    OtpResponse sendOtp(OtpRequest request);
    ApiResponse sendOrderConfirmationEmail(OrderEmailRequest request);
    ApiResponse sendPaymentNotification(PaymentNotificationRequest request);
}
