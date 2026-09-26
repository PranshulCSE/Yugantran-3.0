import { useEffect, useRef, memo } from "react";
import { useTheme } from "../context/ThemeContext";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const frameInterval = 65; // ~15fps for matrix feel without CPU drain

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
    const fontSize = 16;
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF<>{}[]|/";
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = (currentTime: number) => {
      animId = requestAnimationFrame(draw);

      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;

      // Fade effect
      ctx.fillStyle = isLight ? "rgba(248, 250, 252, 0.08)" : "rgba(2, 6, 23, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        if (isLight) {
          ctx.fillStyle = y * fontSize < canvas.height * 0.1 || Math.random() > 0.96
            ? "#0284c7"
            : "rgba(5, 150, 105, 0.45)";
        } else {
          ctx.fillStyle = y * fontSize < canvas.height * 0.1 || Math.random() > 0.96
            ? "#aaffaa"
            : "rgba(0, 180, 50, 0.6)";
        }

        ctx.fillText(char, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
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
      className="fixed inset-0 z-0 pointer-events-none opacity-[0.08] dark:opacity-[0.12]"
      aria-hidden="true"
    />
  );
}

export default memo(MatrixRain);
