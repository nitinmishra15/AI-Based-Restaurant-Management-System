import React from 'react';
import { MessageSquareCode } from 'lucide-react';
export default function FloatingAIButton({ onClick }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 group flex items-center gap-2">
      {/* Tooltip */}
      <span className="hidden sm:inline-block scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap mb-1">
        Ask CulinaryAI
      </span>
      
      {/* Button */}
      <button
        onClick={onClick}
        className="w-14 h-14 bg-gradient-to-r from-[#B41B00] to-[#FF775D] rounded-full text-white shadow-[0_10px_30px_rgba(180,27,0,0.35)] flex items-center justify-center hover:scale-110 active:scale-95 hover:animate-bounce transition-all duration-300 relative"
        aria-label="Ask CulinaryAI"
      >
        <MessageSquareCode className="w-6 h-6" />
        
        {/* Subtle dot pulse */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B41B00] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
        </span>
      </button>
    </div>
  );
}
