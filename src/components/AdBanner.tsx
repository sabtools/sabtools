"use client";

interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdBanner({ format = "horizontal", className = "" }: AdBannerProps) {
  const heights: Record<string, string> = {
    horizontal: "h-[90px]",
    vertical: "h-[600px]",
    rectangle: "h-[250px]",
  };

  return (
    <div className={`ad-placeholder ${heights[format]} w-full ${className}`}>
      <span>Ad Space - Google AdSense</span>
      {/*
        Replace this div with actual AdSense code after approval:
        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true" />
      */}
    </div>
  );
}
