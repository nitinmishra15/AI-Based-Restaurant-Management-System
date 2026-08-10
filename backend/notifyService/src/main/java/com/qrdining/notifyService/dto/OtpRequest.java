package com.qrdining.notifyService.dto;

public class OtpRequest {
    private String mobileNumber;
    private String email;
    private String customerName;

    public OtpRequest() {}

    public OtpRequest(String mobileNumber, String email, String customerName) {
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.customerName = customerName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}
