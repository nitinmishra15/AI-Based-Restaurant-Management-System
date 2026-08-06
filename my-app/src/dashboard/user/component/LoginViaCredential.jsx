import React, { useState } from "react";
import { User, Mail, Lock, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";

export default function LoginViaCredential({
  mobileNumber,
  onRegisterSuccess,
  onBack,
}) {
  const { registerCustomer } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // 1 = Name/Email Details, 2 = OTP Code Verification
  const [step, setStep] = useState(1);

  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [mockOtp, setMockOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");

    if (step === 1) {
      if (name.trim().length < 2) {
        setError("Please enter a valid name.");
        return;
      }

      // Custom Email Validation
      if (!email.includes("@")) {
        setError("Email must include '@'.");
        return;
      }
      if (/^[0-9]/.test(email)) {
        setError("Email must not start with a number.");
        return;
      }
      const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setError("Email must have a valid domain structure (e.g. name@domain.com).");
        return;
      }

      // Whitelist check
      const emailParts = email.split("@");
      const domain = emailParts[emailParts.length - 1].toLowerCase();
      const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com"];
      if (!allowedDomains.includes(domain)) {
        setError("Only gmail.com, hotmail.com, and outlook.com email domains are allowed.");
        return;
      }

      setLoading(true);
      const result = await registerCustomer({
        mobileNumber,
        name,
        email,
      });
      setLoading(false);

      if (result.success === false) {
        setError(result.message || "Registration failed.");
        return;
      }

      if (result.otpSent) {
        setStep(2);
        if (result.message) {
          setInfoMsg(result.message);
          const match = result.message.match(/\b\d{6}\b/);
          if (match) {
            setMockOtp(match[0]);
          }
        }
      } else if (result.token) {
        // Fallback: registered directly
        onRegisterSuccess();
      } else {
        setError(result.message || "Registration failed.");
      }
    } else {
      if (!/^[0-9]{4,6}$/.test(otp)) {
        setError("Please enter valid OTP.");
        return;
      }

      setLoading(true);
      const result = await registerCustomer({
        mobileNumber,
        name,
        email,
        otp,
      });
      setLoading(false);

      if (result.token) {
        onRegisterSuccess();
      } else {
        setError(result.message || "Registration verification failed.");
      }
    }
  };

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp("");
      setMockOtp("");
      setInfoMsg("");
    } else {
      onBack();
    }
  };

  return (
    <div className="w-full font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-[#2D2F2F] tracking-tight">
          {step === 1 ? "Complete Registration" : "Verify Mobile Number"}
        </h2>
        <p className="text-[11px] font-semibold text-gray-400 mt-1">
          {step === 1
            ? "Provide your name and email to continue your order"
            : `Verification code sent to ${mobileNumber}`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-[11px] font-bold text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Info Message */}
      {infoMsg && !error && step === 2 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-[11px] font-bold text-blue-600">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{infoMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B41B00]/20 focus:bg-white transition-all duration-300"
                required
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B41B00]/20 focus:bg-white transition-all duration-300"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#B41B00] to-[#FF775D] text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-[0_4px_12px_rgba(180,27,0,0.2)] hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? "Sending OTP..." : "Register & Get OTP"}
              {!loading && <ShieldCheck className="w-4 h-4" />}
            </button>
          </>
        ) : (
          <>
            {/* Step 2: OTP Entry for New User */}


            <div className="relative">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 text-center tracking-widest text-xs text-gray-900 font-bold rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B41B00]/20 focus:bg-white transition-all"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-3 bg-gradient-to-r from-[#B41B00] to-[#FF775D] text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-[0_4px_12px_rgba(180,27,0,0.2)] hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify & Complete Registration"}
              {!loading && <ShieldCheck className="w-4 h-4" />}
            </button>
          </>
        )}

        {/* Back Button */}
        <button
          type="button"
          onClick={handleGoBack}
          disabled={loading}
          className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors pt-2"
        >
          {step === 2 ? "Back to Details" : "Go Back"}
        </button>
      </form>
    </div>
  );
}
