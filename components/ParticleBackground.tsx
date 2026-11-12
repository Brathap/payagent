'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  theme: 'light' | 'dark';
}

export default function ParticleBackground({ theme }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isLight = theme === 'light';
    const particleCount = Math.min(width > 1200 ? 55 : 35, 60);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label?: string;
    }[] = [];

    const labels = ['APCP v1.0', 'Orders v2', 'Ed25519', '10% Rebate', 'Zero-Dispute', 'AG Grid v36'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.2,
        label: i < labels.length ? labels[i] : undefined,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Particle update & draw
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? 'rgba(0, 112, 186, 0.4)' : 'rgba(0, 207, 232, 0.45)';
        ctx.fill();

        // Connect near neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 130) * (isLight ? 0.08 : 0.15);
            ctx.strokeStyle = isLight
              ? `rgba(0, 112, 186, ${alpha})`
              : `rgba(0, 207, 232, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw occasional floating badge text
        if (p.label) {
          ctx.font = '10px monospace';
          ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.35)' : 'rgba(148, 163, 184, 0.35)';
          ctx.fillText(p.label, p.x + 8, p.y + 3);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}
