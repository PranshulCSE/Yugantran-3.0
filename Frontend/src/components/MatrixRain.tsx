import { useEffect, useRef, useState, memo } from "react";
import { useTheme } from "../context/ThemeContext";

function isLowEndDevice(): boolean {
  const nav = navigator as any;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return true;
  if (nav.deviceMemory && nav.deviceMemory < 4) return true;
  return false;
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowEnd = isLowEndDevice();
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 16 : 18;
    const frameInterval = lowEnd ? 80 : isMobile ? 65 : 55;

    let animId: number;
    let lastTime = 0;
    let paused = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const handleVisibility = () => {
      paused = document.hidden;
      if (!paused) animId = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF<>{}[]|/";
    const charLen = chars.length;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = (currentTime: number) => {
      if (paused) return;
      animId = requestAnimationFrame(draw);
      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;

      const isLight = themeRef.current === "light";

      // Trail fade — shadowBlur must be 0 before fillRect
      ctx.shadowBlur = 0;
      ctx.fillStyle = isLight ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < columns; i++) {
        const y = drops[i];
        const x = i * fontSize;
        const char = chars[Math.floor(Math.random() * charLen)];
        const isHead = y * fontSize < canvas.height * 0.12 || Math.random() > 0.97;

        if (isLight) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.fillStyle = isHead ? "#000000" : `rgba(0,0,0,${(0.4 + Math.random() * 0.4).toFixed(2)})`;
        } else if (lowEnd) {
          // Low-end: no glow at all, just plain cyan
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(0,242,254,${(0.3 + Math.random() * 0.4).toFixed(2)})`;
        } else if (isHead) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = "#00f2fe";
          ctx.fillStyle = "#00f2fe";
        } else {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(0,242,254,0.5)";
          ctx.fillStyle = `rgba(0,242,254,${(0.35 + Math.random() * 0.35).toFixed(2)})`;
        }

        ctx.fillText(char, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
        scrolled
          ? "opacity-10 dark:opacity-20"
          : "opacity-25 dark:opacity-45"
      }`}
      aria-hidden="true"
    />
  );
}

export default memo(MatrixRain);
