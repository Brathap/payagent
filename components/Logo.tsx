'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 36 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="ppPrimary" x1="4" y1="4" x2="38" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#003087" />
            <stop offset="1" stopColor="#0079C1" />
          </linearGradient>
          <linearGradient id="ppAccent" x1="16" y1="12" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0079C1" />
            <stop offset="1" stopColor="#00CFE8" />
          </linearGradient>
          <filter id="shadow" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#003087" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Rounded Squircle Base */}
        <rect width="48" height="48" rx="14" fill="url(#ppPrimary)" filter="url(#shadow)" />

        {/* Back 'P' Monogram */}
        <path
          d="M17 12H27.5C31.6421 12 35 15.3579 35 19.5C35 23.6421 31.6421 27 27.5 27H22.5L20 37H15L17 12Z"
          fill="white"
          fillOpacity="0.28"
        />

        {/* Front Vibrant 'P' Monogram with Fintech Forward Slash */}
        <path
          d="M21 16H31C34.866 16 38 19.134 38 23C38 26.866 34.866 30 31 30H26L23.8 38H19L21 16Z"
          fill="white"
        />

        {/* Dynamic Energy Node / AI Spark */}
        <circle cx="33" cy="15" r="2.5" fill="#00CFE8" />
        <circle cx="33" cy="15" r="4.5" stroke="#00CFE8" strokeWidth="0.8" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}
