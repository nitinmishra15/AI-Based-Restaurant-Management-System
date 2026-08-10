package com.qrdining.notifyService.dto;

public class OtpResponse {
    private boolean success;
    private String message;
    private String otp;

    public OtpResponse() {}

    public OtpResponse(boolean success, String message, String otp) {
        this.success = success;
        this.message = message;
        this.otp = otp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
