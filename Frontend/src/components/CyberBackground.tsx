import { useEffect, useRef } from "react";

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Optimized particle nodes for cyber constellation
    const particleCount = Math.min(Math.floor(width / 35), 40);
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }[] = [];

    const colors = ["#00f2fe", "#38bdf8", "#818cf8", "#00ff41"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.45 + 0.15,
        color: colors[i % colors.length],
      });
    }

    // Floating cyber data stream packets
    const streams: {
      x: number;
      y: number;
      speed: number;
      chars: string[];
      length: number;
      opacity: number;
    }[] = [];

    const hexChars = "0123456789ABCDEF<>{}[]/*";
    const streamCount = Math.min(Math.floor(width / 110), 12);

    for (let i = 0; i < streamCount; i++) {
      const length = Math.floor(Math.random() * 8) + 4;
      const chars = Array.from({ length }, () =>
        hexChars[Math.floor(Math.random() * hexChars.length)]
      );
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.2 + 0.5,
        chars,
        length,
        opacity: Math.random() * 0.2 + 0.06,
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
      ctx.font = "11px 'Share Tech Mono', monospace";
      for (let s of streams) {
        s.y += s.speed;
        if (s.y > height + 150) {
          s.y = -100;
          s.x = Math.random() * width;
        }

        for (let j = 0; j < s.chars.length; j++) {
          const cy = s.y - j * 15;
          if (cy > 0 && cy < height) {
            const charAlpha = (1 - j / s.length) * s.opacity;
            ctx.fillStyle = j === 0 ? `rgba(255, 255, 255, ${charAlpha * 1.4})` : `rgba(0, 242, 254, ${charAlpha})`;
            ctx.fillText(s.chars[j], s.x, cy);
          }
        }
      }

      // Update particle constellation
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
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 10000) { // 100px squared
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
            ctx.globalAlpha = (1 - dist / 100) * 0.35;
            ctx.lineWidth = 0.7;
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
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
      {/* Deep Cyber Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />

      {/* Interactive Cyber Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />

      {/* Cyber Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617]/90 pointer-events-none" />
    </div>
  );
}
