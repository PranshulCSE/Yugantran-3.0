"use client";
import { useEffect } from "react";

export default function MotherboardBackground() {
  useEffect(() => {
    const root = document.documentElement;

    const handleMouseMove = (e: MouseEvent) => {
      root.style.setProperty("--mouse-x", `${e.clientX}px`);
      root.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    const handleMouseEnter = () => {
      root.style.setProperty("--glow-size", "300px");
    };

    const handleMouseLeave = () => {
      root.style.setProperty("--glow-size", "0px");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Dull motherboard wires */}
      <div
        id="motherboard-bg"
        className="fixed inset-0 bg-repeat z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2300001a'/%3E%3Cpath d='M0 5 L20 5 L20 25 L70 25 L70 5 L100 5' stroke='%23003366' stroke-width='2' fill='none'/%3E%3Cpath d='M0 15 L30 15 L30 40 L100 40' stroke='%23003366' stroke-width='1' fill='none'/%3E%3Cpath d='M10 0 L10 30 L40 30 L40 60 L10 60 L10 100' stroke='%23003366' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0 80 L50 80 L50 70 L80 70 L80 90 L100 90' stroke='%23003366' stroke-width='0.5' fill='none'/%3E%3Cpath d='M90 0 L90 50 L60 50 L60 100' stroke='%23003366' stroke-width='1' fill='none'/%3E%3Cpath d='M0 50 L20 50 L20 70 L40 70 L40 90 L60 90' stroke='%23003366' stroke-width='1' fill='none'/%3E%3C/svg%3E\")",
        }}
      ></div>

      {/* Glowing wires (masked by mouse glow) */}
      <div
        id="glow-layer"
        className="fixed inset-0 bg-repeat z-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='transparent'/%3E%3Cpath d='M0 5 L20 5 L20 25 L70 25 L70 5 L100 5' stroke='%2300ffff' stroke-width='2' fill='none'/%3E%3Cpath d='M0 15 L30 15 L30 40 L100 40' stroke='%2300ffff' stroke-width='1' fill='none'/%3E%3Cpath d='M10 0 L10 30 L40 30 L40 60 L10 60 L10 100' stroke='%2300ffff' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0 80 L50 80 L50 70 L80 70 L80 90 L100 90' stroke='%2300ffff' stroke-width='0.5' fill='none'/%3E%3Cpath d='M90 0 L90 50 L60 50 L60 100' stroke='%2300ffff' stroke-width='1' fill='none'/%3E%3Cpath d='M0 50 L20 50 L20 70 L40 70 L40 90 L60 90' stroke='%2300ffff' stroke-width='1' fill='none'/%3E%3C/svg%3E\")",
          maskImage:
            "radial-gradient(circle var(--glow-size, 0px) at var(--mouse-x, -500px) var(--mouse-y, -500px), black 0%, transparent 100%)",
          maskRepeat: "no-repeat",
          transition: "mask-size 0.3s ease-out",
        }}
      ></div>

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-[#00001a]/50 z-20 pointer-events-none"></div>
    </>
  );
}
