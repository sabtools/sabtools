"use client";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const getUrl = () => typeof window !== "undefined" ? window.location.href : "";

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${getUrl()}`)}`, "_blank");
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`, "_blank");
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(getUrl());
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold text-gray-500">Share:</span>
      <button onClick={shareWhatsApp} className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 flex items-center justify-center text-lg transition" title="Share on WhatsApp">
        💬
      </button>
      <button onClick={shareTwitter} className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-lg transition" title="Share on Twitter">
        🐦
      </button>
      <button onClick={shareFacebook} className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-lg transition" title="Share on Facebook">
        📘
      </button>
      <button onClick={shareTelegram} className="w-9 h-9 rounded-xl bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center text-lg transition" title="Share on Telegram">
        ✈️
      </button>
      <button onClick={copyLink} className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-lg transition" title="Copy Link">
        🔗
      </button>
    </div>
  );
}
