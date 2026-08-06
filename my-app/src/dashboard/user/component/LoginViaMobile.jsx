import React, { useState, useEffect } from "react";
import {
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Info,
} from "lucide-react";

import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";

export default function LoginViaMobile({
  onLoginSuccess,
  onNewUser,
  onBack,
}) {
  const {
    checkCustomerMobile,
    verifyCustomerOtp,
  } = useAuth();

  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");

  // 1 = Mobile Number, 2 = OTP
  const [step, setStep] = useState(1);

  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [mockOtp, setMockOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);

  // ===============================
  // OTP Countdown Timer
  // ===============================
  useEffect(() => {
    let interval;

    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // ===============================
  // STEP 1: Check Mobile Number
  // ===============================
  const handleGetOTP = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setInfoMsg("");
    setMockOtp("");

    if (!/^[6-9][0-9]{9}$/.test(mobileNumber)) {
      setError("Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.");
      return;
    }

    setLoading(true);
    const result = await checkCustomerMobile(mobileNumber);
    setLoading(false);

    if (result.success === false) {
      setError(result.message || "Failed to connect to the authentication server.");
      return;
    }

    if (result.isRegistered) {
      // Existing customer
      setStep(2);
      setResendTimer(30);

      // Capture and extract OTP code from server message
      if (result.message) {
        setInfoMsg(result.message);
        const match = result.message.match(/\b\d{6}\b/);
        if (match) {
          setMockOtp(match[0]);
        }
      }
    } else {
      // New customer
      if (onNewUser) {
        onNewUser(mobileNumber);
      }
    }
  };

  // ===============================
  // STEP 2: Verify OTP
  // ===============================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{4,6}$/.test(otp)) {
      setError("Please enter valid OTP.");
      return;
    }

    setLoading(true);
    const result = await verifyCustomerOtp(mobileNumber, otp);
    setLoading(false);

    if (result.success || result.token) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError(result.message || "Invalid OTP.");
    }
  };

  // ===============================
  // Change Mobile Number
  // ===============================
  const handleGoBack = () => {
    setStep(1);
    setOtp("");
    setError("");
    setInfoMsg("");
    setMockOtp("");
  };

  return (
    <div className="w-full font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-[#2D2F2F]">
          Login via Mobile
        </h2>
        <p className="text-[11px] font-semibold text-gray-400 mt-1">
          {step === 1
            ? "Enter your mobile number to continue"
            : `OTP sent to ${mobileNumber}`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex gap-2 text-[11px] font-bold text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Mobile Number Step */}
      {step === 1 ? (
        <form onSubmit={handleGetOTP} className="space-y-4">
          <div className="relative">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="w-full pl-10 pr-4 py-3 text-xs text-gray-900 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B41B00]/20 focus:bg-white transition-all"
              required
            />
            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          <button
            type="submit"
            disabled={loading || mobileNumber.length !== 10}
            className="w-full py-3 rounded-full bg-[#B41B00] text-white font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Checking..." : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-xs text-gray-400"
          >
            Back to Cart
          </button>
        </form>
      ) : (
        // OTP Step
        <form onSubmit={handleVerifyOTP} className="space-y-4">


          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full pl-10 pr-4 py-3 text-center tracking-widest text-xs text-gray-900 font-bold rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B41B00]/20 focus:bg-white transition-all"
              required
            />
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="w-full py-3 rounded-full bg-[#B41B00] text-white font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Verify OTP"}
            <ShieldCheck className="w-4 h-4" />
          </button>

          {resendTimer > 0 ? (
            <span className="block text-center text-xs text-gray-400">
              Resend OTP in {resendTimer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setResendTimer(30);
                handleGetOTP();
              }}
              className="block mx-auto text-xs text-[#B41B00] font-bold"
            >
              Resend OTP
            </button>
          )}

          <button
            type="button"
            onClick={handleGoBack}
            className="block mx-auto text-xs text-gray-500 hover:text-gray-800 underline"
          >
            Change Number
          </button>
        </form>
      )}
    </div>
  );
}
