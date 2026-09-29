import { useEffect, useRef, useState, memo } from "react";
import { useTheme } from "../context/ThemeContext";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const frameInterval = 55; // slower matrix speed

    let resizeTimer: any = null;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    const isLight = theme === "light";
    const fontSize = 18;
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF<>{}[]|/";
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = (currentTime: number) => {
      animId = requestAnimationFrame(draw);

      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;

      // Fade effect (remove shadow before fillRect to prevent blurring the background)
      ctx.shadowBlur = 0;
      ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      // Subtle glow for the matrix text using Yugantran cyan
      ctx.shadowBlur = 6;
      ctx.shadowColor = isLight ? "rgba(2, 132, 199, 0.3)" : "rgba(0, 242, 254, 0.6)";

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        if (isLight) {
          ctx.fillStyle = y * fontSize < canvas.height * 0.1 || Math.random() > 0.96
            ? "#000000ff" // Tailwind cyan-600
            : "rgba(0, 0, 0, 0.6)"; // cyan-600 with opacity
        } else {
          ctx.fillStyle = y * fontSize < canvas.height * 0.1 || Math.random() > 0.96
            ? "#ffffff" // Bright white head
            : "rgba(0, 242, 254, 0.55)"; // Yugantran Neon Cyan tail
        }

        ctx.fillText(char, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-40 transition-all duration-700 ${
        scrolled ? "blur-sm" : ""
      }`}
      aria-hidden="true"
    />
  );
}

export default memo(MatrixRain);
