"use client";

import React from "react";

export type SugoiMood = "normal" | "happy" | "annoyed" | "enraged";
export type SugoiExpression = "normal" | "focused" | "smug" | "scared" | "happy";

interface SugoiAvatarProps {
  mood: SugoiMood;
  expression?: SugoiExpression;
  size?: number;
  onClick?: () => void;
  className?: string;
  showGoggles?: boolean;
  goggleLift?: boolean;
}

export default function SugoiAvatar({ mood, expression, size = 120, onClick, className = "", showGoggles = false, goggleLift = false }: SugoiAvatarProps) {
  const isShaking = mood === "enraged";
  const glowClass = mood === "happy" ? "sugoi-glow-happy" : mood === "annoyed" ? "sugoi-glow-annoyed" : mood === "enraged" ? "sugoi-glow-enraged" : "";
  // Expression overrides mood for eye rendering when pipeline is active
  const eyeState = expression && expression !== "normal" ? expression : mood;

  return (
    <button type="button" onClick={onClick}
      className={`sugoi-avatar-btn cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 ${isShaking ? "sugoi-shake" : ""} ${glowClass} ${className}`}
      style={{ background: "none", border: "none", padding: 0 }} aria-label="Click Sugoi the Catbot">
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
        {/* Ears */}
        <path d="M55 85 L35 35 L80 65 Z" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2.5" />
        <path d="M145 85 L165 35 L120 65 Z" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2.5" />
        <path d="M58 78 L45 48 L75 68 Z" fill="#fce7f3" />
        <path d="M142 78 L155 48 L125 68 Z" fill="#fce7f3" />
        {/* Head */}
        <circle cx="100" cy="110" r="55" fill="#fef3c7" stroke="#d1d5db" strokeWidth="1.5" />
        {/* Hair */}
        <ellipse cx="100" cy="68" rx="58" ry="28" fill="#6ee7b7" />
        <ellipse cx="70" cy="78" rx="22" ry="18" fill="#6ee7b7" />
        <ellipse cx="130" cy="78" rx="22" ry="18" fill="#6ee7b7" />
        <ellipse cx="100" cy="60" rx="48" ry="22" fill="#34d399" />
        <ellipse cx="50" cy="100" rx="14" ry="25" fill="#6ee7b7" />
        <ellipse cx="150" cy="100" rx="14" ry="25" fill="#6ee7b7" />
        <path d="M62 82 Q72 60 85 78" fill="#34d399" />
        <path d="M115 78 Q128 60 138 82" fill="#34d399" />
        <path d="M85 75 Q100 55 115 75" fill="#34d399" />
        {/* Bow */}
        <ellipse cx="100" cy="60" rx="6" ry="5" fill="#ef4444" />
        <path d="M94 60 Q85 50 78 58 Q85 65 94 60 Z" fill="#ef4444" />
        <path d="M106 60 Q115 50 122 58 Q115 65 106 60 Z" fill="#ef4444" />
        <circle cx="100" cy="60" r="3" fill="#fca5a5" />
        {/* Blush */}
        {mood !== "enraged" && eyeState !== "scared" && (
          <><ellipse cx="72" cy="122" rx="10" ry="5" fill="#fda4af" opacity="0.4" />
          <ellipse cx="128" cy="122" rx="10" ry="5" fill="#fda4af" opacity="0.4" /></>
        )}

        {/* ══ EYES — mood/expression driven ══ */}
        {(eyeState === "normal") && (<>
          <ellipse cx="82" cy="112" rx="8" ry="9" fill="#1e3a5f" />
          <ellipse cx="118" cy="112" rx="8" ry="9" fill="#1e3a5f" />
          <circle cx="85" cy="109" r="3" fill="white" opacity="0.8" />
          <circle cx="121" cy="109" r="3" fill="white" opacity="0.8" />
          <circle cx="79" cy="114" r="1.5" fill="white" opacity="0.5" />
          <circle cx="115" cy="114" r="1.5" fill="white" opacity="0.5" />
        </>)}
        {(eyeState === "happy") && (<>
          <path d="M74 112 Q82 102 90 112" stroke="#1e3a5f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M110 112 Q118 102 126 112" stroke="#1e3a5f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <text x="62" y="105" fontSize="8" fill="#fbbf24">✦</text>
          <text x="132" y="105" fontSize="8" fill="#fbbf24">✦</text>
        </>)}
        {(eyeState === "annoyed") && (<>
          <path d="M74 108 L90 108" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="82" cy="114" rx="7" ry="5" fill="#1e3a5f" />
          <path d="M110 108 L126 108" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="118" cy="114" rx="7" ry="5" fill="#1e3a5f" />
          <ellipse cx="142" cy="100" rx="4" ry="7" fill="#90dbf4" opacity="0.7" />
          <ellipse cx="142" cy="97" rx="2.5" ry="3" fill="white" opacity="0.5" />
        </>)}
        {(eyeState === "enraged") && (<>
          <ellipse cx="82" cy="112" rx="9" ry="8" fill="#ef4444" />
          <ellipse cx="118" cy="112" rx="9" ry="8" fill="#ef4444" />
          <ellipse cx="82" cy="112" rx="5" ry="4.5" fill="#fca5a5" />
          <ellipse cx="118" cy="112" rx="5" ry="4.5" fill="#fca5a5" />
          <path d="M70 100 L92 106" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
          <path d="M130 100 L108 106" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(145, 88)">
            <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="4" y1="-4" x2="-4" y2="4" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </>)}
        {/* Focused — determined eyes with slight squint */}
        {(eyeState === "focused") && (<>
          <ellipse cx="82" cy="112" rx="7" ry="7" fill="#1e3a5f" />
          <ellipse cx="118" cy="112" rx="7" ry="7" fill="#1e3a5f" />
          <path d="M72 106 L92 108" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
          <path d="M128 106 L108 108" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
          <circle cx="84" cy="110" r="2.5" fill="white" opacity="0.7" />
          <circle cx="120" cy="110" r="2.5" fill="white" opacity="0.7" />
        </>)}
        {/* Smug — confident half-closed eyes */}
        {(eyeState === "smug") && (<>
          <ellipse cx="82" cy="114" rx="8" ry="5" fill="#1e3a5f" />
          <ellipse cx="118" cy="114" rx="8" ry="5" fill="#1e3a5f" />
          <path d="M74 110 L90 112" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
          <path d="M126 110 L110 112" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
          <circle cx="85" cy="112" r="2" fill="white" opacity="0.6" />
          <circle cx="121" cy="112" r="2" fill="white" opacity="0.6" />
          <text x="62" y="105" fontSize="7" fill="#cfbaf0">★</text>
          <text x="134" y="105" fontSize="7" fill="#cfbaf0">★</text>
        </>)}
        {/* Scared — big watery eyes with tears */}
        {(eyeState === "scared") && (<>
          <ellipse cx="82" cy="112" rx="9" ry="11" fill="#1e3a5f" />
          <ellipse cx="118" cy="112" rx="9" ry="11" fill="#1e3a5f" />
          <circle cx="85" cy="108" r="4" fill="white" opacity="0.9" />
          <circle cx="121" cy="108" r="4" fill="white" opacity="0.9" />
          <circle cx="80" cy="115" r="2" fill="white" opacity="0.5" />
          <circle cx="116" cy="115" r="2" fill="white" opacity="0.5" />
          {/* Tear drops */}
          <ellipse cx="72" cy="124" rx="3" ry="5" fill="#90dbf4" opacity="0.6" />
          <ellipse cx="128" cy="124" rx="3" ry="5" fill="#90dbf4" opacity="0.6" />
          <path d="M72 106 L90 110" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M128 106 L110 110" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
        </>)}

        {/* ══ MOUTH ══ */}
        {(eyeState === "normal" || eyeState === "focused") && (
          <path d="M93 130 Q97 126 100 130 Q103 126 107 130" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {(eyeState === "happy" || eyeState === "smug") && (<>
          <path d="M85 128 Q100 142 115 128" stroke="#1e3a5f" strokeWidth="2" fill="#fecaca" strokeLinecap="round" />
          <path d="M92 128 L94 133 L96 128" fill="white" />
        </>)}
        {eyeState === "annoyed" && (
          <path d="M88 132 Q94 128 100 132 Q106 136 112 132" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {eyeState === "enraged" && (<>
          <ellipse cx="100" cy="135" rx="14" ry="10" fill="#1e3a5f" />
          <ellipse cx="100" cy="133" rx="10" ry="6" fill="#7f1d1d" />
          <path d="M90 130 L92 137 L94 130" fill="white" />
          <path d="M106 130 L108 137 L110 130" fill="white" />
        </>)}
        {eyeState === "scared" && (
          <path d="M92 132 Q96 128 100 132 Q104 128 108 132" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Headphones */}
        <path d="M48 105 Q48 70 100 70 Q152 70 152 105" stroke="#d1d5db" strokeWidth="4" fill="none" />
        <rect x="42" y="98" width="14" height="20" rx="5" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
        <rect x="144" y="98" width="14" height="20" rx="5" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />

        {/* Cyber Goggles (dark mode) */}
        {showGoggles && (
          <g className={goggleLift ? "goggle-lift" : ""} style={goggleLift ? { transform: "translateY(-12px)", transition: "transform 0.3s ease" } : { transition: "transform 0.3s ease" }}>
            <rect x="65" y="103" width="30" height="18" rx="6" fill="#2d3748" stroke="#f7374f" strokeWidth="2" opacity="0.9" />
            <rect x="105" y="103" width="30" height="18" rx="6" fill="#2d3748" stroke="#f7374f" strokeWidth="2" opacity="0.9" />
            <line x1="95" y1="112" x2="105" y2="112" stroke="#f7374f" strokeWidth="2" />
            <circle cx="80" cy="112" r="4" fill="#f7374f" opacity="0.4" />
            <circle cx="120" cy="112" r="4" fill="#f7374f" opacity="0.4" />
            <rect x="65" y="106" width="30" height="4" rx="2" fill="white" opacity="0.15" />
            <rect x="105" y="106" width="30" height="4" rx="2" fill="white" opacity="0.15" />
          </g>
        )}

        {/* Body */}
        <path d="M72 155 Q72 150 78 150 L122 150 Q128 150 128 155 L128 175 Q128 185 100 185 Q72 185 72 175 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
        <ellipse cx="100" cy="162" rx="18" ry="3" fill="#d1d5db" opacity="0.4" />
        <rect x="82" y="158" width="36" height="16" rx="6" fill="#f1c0e8" opacity="0.6" />
        <text x="100" y="170" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#7c3aed" opacity="0.7">SUGOI</text>
        <ellipse cx="100" cy="155" rx="5" ry="3.5" fill="#f59e0b" />
        <path d="M95 155 Q88 148 84 153 Q88 158 95 155 Z" fill="#f59e0b" />
        <path d="M105 155 Q112 148 116 153 Q112 158 105 155 Z" fill="#f59e0b" />
        <circle cx="100" cy="155" r="2" fill="#fde68a" />
      </svg>
    </button>
  );
}
