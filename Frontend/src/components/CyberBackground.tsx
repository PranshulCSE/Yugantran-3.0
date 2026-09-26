import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let isVisible = true;
    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let resizeTimer: any = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    // Optimized particle count
    const particleCount = Math.min(Math.floor(width / 50), 28);
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }[] = [];

    const isLight = theme === "light";
    const colors = isLight
      ? ["#0284c7", "#0891b2", "#6366f1", "#059669"]
      : ["#00f2fe", "#38bdf8", "#818cf8", "#00ff41"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.15,
        color: colors[i % colors.length],
      });
    }

    // Floating cyber data stream packets (capped to 6 for speed)
    const streams: {
      x: number;
      y: number;
      speed: number;
      chars: string[];
      length: number;
      opacity: number;
    }[] = [];

    const hexChars = "0123456789ABCDEF<>/";
    const streamCount = Math.min(Math.floor(width / 180), 6);

    for (let i = 0; i < streamCount; i++) {
      const length = Math.floor(Math.random() * 6) + 3;
      const chars = Array.from({ length }, () =>
        hexChars[Math.floor(Math.random() * hexChars.length)]
      );
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 0.8 + 0.4,
        chars,
        length,
        opacity: Math.random() * 0.18 + 0.05,
      });
    }

    let lastTime = 0;
    const fps = 30;
    const frameInterval = 1000 / fps;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < frameInterval) return;
      lastTime = currentTime - (elapsed % frameInterval);

      ctx.clearRect(0, 0, width, height);

      // Render faint data streams
      ctx.font = "10px 'Share Tech Mono', monospace";
      for (let s of streams) {
        s.y += s.speed;
        if (s.y > height + 100) {
          s.y = -80;
          s.x = Math.random() * width;
        }

        for (let j = 0; j < s.chars.length; j++) {
          const cy = s.y - j * 14;
          if (cy > 0 && cy < height) {
            const charAlpha = (1 - j / s.length) * s.opacity;
            ctx.fillStyle = isLight
              ? `rgba(2, 132, 199, ${charAlpha * 0.8})`
              : `rgba(0, 242, 254, ${charAlpha})`;
            ctx.fillText(s.chars[j], s.x, cy);
          }
        }
      }

      // Update particle constellation
      const maxDistSq = 6400; // 80px squared
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = isLight ? p.alpha * 0.8 : p.alpha;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isLight
              ? "rgba(2, 132, 199, 0.12)"
              : "rgba(56, 189, 248, 0.12)";
            ctx.globalAlpha = (1 - Math.sqrt(distSq) / 80) * 0.25;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(resizeTimer);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
      {/* Deep Cyber Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-[450px] h-[400px] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-3xl" />

      {/* Interactive Cyber Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 dark:opacity-70" />

      {/* Cyber Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-transparent to-slate-100/80 dark:from-[#020617]/50 dark:via-transparent dark:to-[#020617]/90 pointer-events-none" />
    </div>
  );
}
