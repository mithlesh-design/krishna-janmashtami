import React, { useState, useEffect } from 'react';
import { X, Copy, Check, MessageCircle, Share2, Sparkles } from 'lucide-react';

export default function ShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareTitle = "श्री कृष्ण जन्माष्टमी | Krishna Janmashtami";
  const shareText = "प्रेम, भक्ति और आनंद के इस पावन उत्सव में आपका स्वागत है। राधे कृष्ण! ✨";
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://krishna.org';

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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    });
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareTitle}\n${shareText}\n${shareUrl}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07182E]/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-[#0b2447] border border-[#F4B942]/30 rounded-3xl p-6 shadow-[0_25px_60px_rgba(7,24,46,0.95)] text-center text-[#FFF5DF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#FFF5DF]/60 hover:text-[#FFF5DF] hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1.5 mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#123A68]/60 border border-[#F4B942]/30 text-xs font-serif-dev text-[#FDE68A]">
            <Sparkles className="w-3 h-3 text-[#F4B942]" />
            <span>जन्माष्टमी मंगलकामनाएं</span>
          </div>
          <h3 className="font-serif-dev text-2xl font-bold gold-gradient-text">
            शुभकामनाएं साझा करें
          </h3>
          <p className="text-xs text-[#FFF5DF]/70 font-light">
            अपने प्रियजनों के साथ भक्ति एवं आनंद का यह पावन उत्सव बांटें।
          </p>
        </div>

        {/* Action Options */}
        <div className="mt-6 space-y-3">
          {/* Copy Link button */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F4B942]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#123A68] flex items-center justify-center text-[#F4B942]">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-medium text-[#FFF5DF]">
                  {copied ? 'Link copied 🙏' : 'Copy Website Link'}
                </div>
                <div className="text-[11px] text-[#FFF5DF]/50 truncate max-w-[170px]">
                  {shareUrl}
                </div>
              </div>
            </div>

            <div className="text-[#F4B942] group-hover:scale-110 transition-transform">
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </div>
          </button>

          {/* WhatsApp share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group text-decoration-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-medium text-[#FFF5DF]">
                  Share via WhatsApp
                </div>
                <div className="text-[11px] text-[#FFF5DF]/50">
                  Send directly to family & friends
                </div>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </a>
        </div>

        {/* Confirmation Toast if Copied */}
        {copied && (
          <div className="mt-4 py-2 px-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-serif-dev animate-fadeIn">
            ✨ लिंक कॉपी हो गया! अब आप इसे कहीं भी साझा कर सकते हैं।
          </div>
        )}
      </div>
    </div>
  );
}
