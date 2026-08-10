package com.qrdining.notifyService.dto;

public class PaymentNotificationRequest {
    private String paymentId;
    private String orderId;
    private String customerName;
    private String email;
    private String mobileNumber;
    private double amount;
    private String status;
    private String paymentDate;

    public PaymentNotificationRequest() {}

    public PaymentNotificationRequest(String paymentId, String orderId, String customerName, String email, String mobileNumber, double amount, String status, String paymentDate) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.customerName = customerName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.amount = amount;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(String paymentDate) {
        this.paymentDate = paymentDate;
    }
}
