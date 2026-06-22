import React from "react";
// @ts-ignore
import logoPic from "../assets/images/luxelist_logo_1782119404718.jpg";

interface LuxeLogoProps {
  size?: number | string; // Size of the icon
  color?: string; // Optional override color for text (e.g. text color)
  showText?: boolean; // Whether to render "LuxeList" next to or under the icon
  textType?: "side" | "stacked";
  textClassName?: string; // Custom styling for text
  className?: string; // Additional classes for wrapper
  glow?: boolean; // Add soft aesthetic drop-shadow/glow effect
  isBadge?: boolean; // True to render with the full glossy rounded box background of Pic 1
  showSubtitle?: boolean; // True to include the "Smart Shopping & Budget Tracking" subtitle
}

export default function LuxeLogo({
  size = 44,
  color = "",
  showText = false,
  textType = "side",
  textClassName = "",
  className = "",
  glow = true,
  isBadge = false,
  showSubtitle = false
}: LuxeLogoProps) {
  
  const containerStyle = textType === "stacked" 
    ? "flex flex-col items-center justify-center text-center gap-2" 
    : "flex items-center gap-1.5 sm:gap-3 md:gap-4";

  return (
    <div className={`${containerStyle} ${className}`} id="luxe-brand-container">
      {/* REAL HIGH-FIDELITY LUXURY 3D LOGO IMAGE */}
      <img
        src={logoPic}
        alt="LuxeList Real Logo"
        width={size}
        height={size}
        className={`object-contain transition-all duration-500 hover:scale-[1.05] flex-shrink-0 rounded-[22%] ${
          isBadge ? "border border-purple-200/50 shadow-md" : ""
        } ${glow ? "shadow-[0_4px_12px_rgba(139,92,246,0.35)] hover:shadow-[0_8px_20px_rgba(139,92,246,0.55)]" : ""}`}
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />

      {/* LUXE LIST TEXT BRAND ACCENT - Calligraphic script & modern subtitle */}
      {showText && (
        <div className="hidden sm:flex flex-col items-start leading-none" id="luxe-brand-text-wrapper">
          <span
            id="luxe-brand-text"
            className={`font-logo select-none transition-colors duration-300 ${
              textType === "stacked" ? "text-4xl sm:text-5xl my-1" : "text-3xl sm:text-4xl"
            } ${textClassName || (color ? "" : "text-[#522BC1] hover:text-[#7E5BF7]")}`}
            style={{ 
              fontFamily: "'Playball', 'Satisfy', 'Dancing Script', 'Parisienne', cursive",
              textShadow: "0 1px 1px rgba(0,0,0,0.05)",
              ...(color ? { color } : {})
            }}
          >
            LuxeList
          </span>
          {showSubtitle && (
            <span 
              className="text-[9px] sm:text-[10.5px] opacity-80 font-sans tracking-wide font-medium mt-0.5"
              id="luxe-brand-text-subtitle"
              style={{ color: color || "#41208D" }}
            >
              Smart Shopping & Budget Tracking
            </span>
          )}
        </div>
      )}
    </div>
  );
}
