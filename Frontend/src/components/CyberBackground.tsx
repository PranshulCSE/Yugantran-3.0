import { useEffect, useRef } from "react";

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes for cyber constellation
    const particleCount = Math.min(Math.floor(width / 18), 75);
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }[] = [];

    const colors = ["#00f2fe", "#38bdf8", "#818cf8", "#a855f7"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
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

    const hexChars = "0123456789ABCDEF<>{}[]/*+~#_";
    const streamCount = Math.min(Math.floor(width / 70), 22);

    for (let i = 0; i < streamCount; i++) {
      const length = Math.floor(Math.random() * 12) + 6;
      const chars = Array.from({ length }, () =>
        hexChars[Math.floor(Math.random() * hexChars.length)]
      );
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.5 + 0.6,
        chars,
        length,
        opacity: Math.random() * 0.25 + 0.08,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw faint cyber grid
      ctx.strokeStyle = "rgba(56, 189, 248, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 65;
      const offsetX = (time * 8) % gridSize;
      const offsetY = (time * 8) % gridSize;

      ctx.beginPath();
      for (let x = offsetX; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Render data streams
      ctx.font = "11px 'Share Tech Mono', monospace";
      for (let s of streams) {
        s.y += s.speed;
        if (s.y > height + 200) {
          s.y = -150;
          s.x = Math.random() * width;
        }

        for (let j = 0; j < s.chars.length; j++) {
          const cy = s.y - j * 16;
          if (cy > 0 && cy < height) {
            const charAlpha = (1 - j / s.length) * s.opacity;
            if (j === 0) {
              ctx.fillStyle = `rgba(255, 255, 255, ${charAlpha * 1.5})`;
            } else {
              ctx.fillStyle = `rgba(0, 242, 254, ${charAlpha})`;
            }
            if (Math.random() > 0.94) {
              s.chars[j] = hexChars[Math.floor(Math.random() * hexChars.length)];
            }
            ctx.fillText(s.chars[j], s.x, cy);
          }
        }
      }

      // Update and connect particle constellation
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
            ctx.globalAlpha = (1 - dist / 130) * 0.45;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Cyber Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/18 via-blue-600/8 to-transparent rounded-full blur-3xl opacity-75" />
      <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-gradient-radial from-indigo-500/15 via-purple-600/8 to-transparent rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-40 left-1/3 w-[800px] h-[600px] bg-gradient-radial from-blue-600/15 via-cyan-500/6 to-transparent rounded-full blur-3xl opacity-70" />

      {/* Interactive Cyber Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />

      {/* Cyber Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-transparent to-[#030712]/90 pointer-events-none" />
    </div>
  );
}
