import { useEffect, useRef, memo } from "react";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const frameInterval = 50; // ~20fps for classic matrix feel

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOP<>{}[]|/\\";
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = (currentTime: number) => {
      animId = requestAnimationFrame(draw);

      if (currentTime - lastTime < frameInterval) return;
      lastTime = currentTime;

      // Fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        // Bright head char
        if (y * fontSize < canvas.height * 0.1 || Math.random() > 0.97) {
          ctx.fillStyle = "#aaffaa";
        } else {
          ctx.fillStyle = "rgba(0, 180, 50, 0.7)";
        }

        ctx.fillText(char, x, y * fontSize);

        // Reset drop
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-[0.12]"
      aria-hidden="true"
    />
  );
}

export default memo(MatrixRain);
