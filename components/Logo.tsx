'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Official PayPal gradient colors */}
          <linearGradient id="paypalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#003087" />
            <stop offset="50%" stopColor="#0070BA" />
            <stop offset="100%" stopColor="#00CFE8" />
          </linearGradient>

          <linearGradient id="paypalAccentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0070BA" />
            <stop offset="100%" stopColor="#008CFF" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer squircle container */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="26"
          fill="url(#paypalBlueGrad)"
          className="transition-all duration-300"
        />

        {/* Sleek geometric inner highlights */}
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx="25"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="2"
          fill="none"
        />

        {/* Back 'P' glyph */}
        <path
          d="M32 74V26H53C62 26 69 32 69 41C69 50 62 55 53 55H42V74H32Z"
          fill="rgba(0, 48, 135, 0.45)"
        />

        {/* Front Interlocking 'P' glyph (Clean, modern icon geometry) */}
        <path
          d="M40 80V32H61C70 32 77 38 77 47C77 56 70 61 61 61H50V80H40Z"
          fill="#FFFFFF"
          filter="url(#glow)"
        />

        {/* Cyan AI Core Star Accent in upper corner */}
        <circle cx="73" cy="27" r="6" fill="#00CFE8" />
        <circle cx="73" cy="27" r="3" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
