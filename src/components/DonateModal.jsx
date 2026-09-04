import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, Sparkles } from 'lucide-react';

export default function DonateModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const upiId = 'krishna.janmashtami@upi';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07182E]/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0b2447] border border-[#F4B942]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(7,24,46,0.95)] text-center text-[#FFF5DF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative golden ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-24 bg-[#F4B942]/20 filter blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#FFF5DF]/60 hover:text-[#FFF5DF] hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Devotional Badge & Title */}
        <div className="space-y-1.5 mt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#123A68]/70 border border-[#F4B942]/30 text-xs text-[#FDE68A]">
            <Sparkles className="w-3 h-3 text-[#F4B942]" />
            <span className="devanagari-safe leading-normal">पवित्र समर्पण</span>
          </div>

          <h3 className="devanagari-hero-title text-2xl sm:text-3xl font-bold gold-gradient-text tracking-tight">
            श्री कृष्ण सेवा में सहयोग
          </h3>

          {/* Respectful devotional line as requested */}
          <div className="py-1">
            <p className="devanagari-safe text-base sm:text-lg text-[#FDE68A] font-medium leading-relaxed max-w-sm mx-auto">
              “अपनी श्रद्धा और सामर्थ्य के अनुसार इस सेवा में अपना सहयोग अर्पित करें।”
            </p>
          </div>
        </div>

        {/* Clean, High-Contrast QR Code Card with User's Uploaded QR */}
        <div className="my-5 p-4 rounded-2xl bg-white text-[#07182E] shadow-[0_12px_35px_rgba(0,0,0,0.55)] border-2 border-[#F4B942]/45 max-w-[240px] mx-auto flex flex-col items-center group">
          <div className="w-48 h-48 sm:w-52 sm:h-52 p-1.5 rounded-xl bg-white flex items-center justify-center relative overflow-hidden">
            <img
              src="/images/C2BB165C-442A-452E-826F-85419BAD3BEA.PNG"
              alt="UPI Donation QR Code"
              className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#07182E]/85 tracking-wider uppercase">
            <QrCode className="w-3.5 h-3.5 text-[#123A68]" />
            <span>Scan With Any UPI App</span>
          </div>
        </div>

        {/* Supporting message and simple UPI details */}
        <div className="space-y-3 max-w-sm mx-auto">
          <p className="devanagari-safe text-xs sm:text-sm text-[#FFF5DF]/85 font-normal leading-relaxed">
            Google Pay, PhonePe, Paytm या किसी भी UPI ऐप से इस QR कोड को स्कैन करके आप अपनी इच्छानुसार कोई भी सहयोग राशि सीधे अर्पित कर सकते हैं।
          </p>

          {/* Clean UPI ID Copy Pill */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#F4B942]/40 transition-colors text-xs">
            <div className="flex items-center gap-1.5 text-[#FFF5DF]/80 overflow-hidden">
              <span className="text-[#FDE68A] font-semibold shrink-0">UPI ID:</span>
              <span className="font-mono text-[#FFF5DF] truncate select-all">{upiId}</span>
            </div>

            <button
              onClick={handleCopyUPI}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F4B942]/20 hover:bg-[#F4B942]/30 text-[#FDE68A] transition-all cursor-pointer font-medium active:scale-95 shrink-0 ml-2"
              aria-label="Copy UPI ID"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-serif-dev">कॉपी हुआ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="font-serif-dev">कॉपी करें</span>
                </>
              )}
            </button>
          </div>

          {/* Devotional Footnote */}
          <div className="pt-2 text-[11px] text-[#FFF5DF]/60 devanagari-safe border-t border-white/5">
            🌸 आपका हर योगदान श्री कृष्ण जन्माष्टमी उत्सव, गौसेवा एवं महाप्रसाद में समर्पित है 🙏
          </div>
        </div>
      </div>
    </div>
  );
}
