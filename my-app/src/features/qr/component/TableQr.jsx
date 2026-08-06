import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";
import { LuScanQrCode } from "react-icons/lu";

export default function TableQr() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const tableId = "1";
  const origin = window.location.origin;
  const targetPath = `${origin}/user?tableId=${tableId}`;
  
  // Free QR Code generator API to generate a scanable QR code image for Table #1
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=000000&data=${encodeURIComponent(targetPath)}`;

  useEffect(() => {
    // Clear previous customer session to ensure default guest mode on table scan simulation
    logout();
  }, [logout]);

  // Proceed directly to the user menu on this browser device
  const handleGo = () => {
    navigate(`/user?tableId=${tableId}`);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#F6F6F6] px-4 font-sans select-none antialiased">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 text-center flex flex-col items-center">
        
        {/* Logo and Header */}
        <div className="bg-orange-500 rounded-2xl w-14 h-14 flex items-center justify-center text-white mb-4 shadow-md shadow-orange-500/20">
          <LuScanQrCode size={30} />
        </div>
        
        <h1 className="text-2xl font-black text-[#2D2F2F] tracking-tight">
          Scan QR Code
        </h1>
        <p className="text-gray-400 text-xs mt-1 max-w-[250px] font-medium leading-relaxed">
          Scan this QR Code with your smartphone to sit at **Table No 1** and open the digital menu.
        </p>

        {/* QR Code Frame */}
        <div className="my-6 p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl flex justify-center items-center shadow-inner relative group">
          <img
            src={qrUrl}
            alt="Table 1 QR Code"
            className="w-48 h-48 rounded-lg object-contain bg-white p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* URL Display */}
        <div className="w-full mb-5 px-2 bg-gray-50 border rounded-xl py-2.5 text-[10px] text-gray-500 font-mono select-all truncate">
          {targetPath}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleGo}
          className="w-full bg-[#B41B00] hover:bg-[#FF775D] text-white font-bold py-3.5 rounded-full text-xs shadow-lg shadow-[#B41B00]/20 transition-all duration-300 active:scale-98 cursor-pointer uppercase tracking-wider"
        >
          Proceed on this device
        </button>

      </div>
    </div>
  );
}