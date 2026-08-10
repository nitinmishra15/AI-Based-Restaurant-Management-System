package com.qrdining.notifyService.dto;

public class OrderEmailRequest {
    private String orderId;
    private String customerName;
    private String email;
    private double amount;
    private String orderDate;
    private String status;

    public OrderEmailRequest() {}

    public OrderEmailRequest(String orderId, String customerName, String email, double amount, String orderDate, String status) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.email = email;
        this.amount = amount;
        this.orderDate = orderDate;
        this.status = status;
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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
