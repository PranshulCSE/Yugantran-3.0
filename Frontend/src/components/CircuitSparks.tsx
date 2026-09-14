import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

export default function CircuitSparks() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    // Generate random spark positions for the Hero section
    const newSparks = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      size: 2 + Math.random() * 4,
    }));
    setSparks(newSparks);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          className="absolute rounded-full"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            background: 'radial-gradient(circle, #00ffff 0%, #00d4ff 50%, transparent 100%)',
            filter: 'blur(1px)',
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            boxShadow: [
              '0 0 0px rgba(0, 255, 255, 0)',
              '0 0 20px rgba(0, 255, 255, 0.8)',
              '0 0 10px rgba(0, 255, 255, 0.6)',
              '0 0 0px rgba(0, 255, 255, 0)',
            ],
          }}
          transition={{
            duration: spark.duration,
            delay: spark.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Larger pulsing nodes */}
      {[
        { x: 20, y: 15, delay: 0 },
        { x: 80, y: 25, delay: 1 },
        { x: 50, y: 60, delay: 0.5 },
        { x: 30, y: 80, delay: 1.5 },
        { x: 70, y: 70, delay: 0.8 },
      ].map((node, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            background: '#00ffff',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.5)',
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 2.5,
            delay: node.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Electric arcs between nodes */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </linearGradient>
          <filter id="arc-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated arcs connecting the nodes */}
        <path
          d="M 20 15 Q 50 30, 80 25"
          stroke="url(#arc-gradient)"
          strokeWidth="1"
          fill="none"
          filter="url(#arc-glow)"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0,100;100,0;0,100"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 50 60 Q 40 70, 30 80"
          stroke="url(#arc-gradient)"
          strokeWidth="1"
          fill="none"
          filter="url(#arc-glow)"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0,80;80,0;0,80"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 70 70 Q 60 65, 50 60"
          stroke="url(#arc-gradient)"
          strokeWidth="1"
          fill="none"
          filter="url(#arc-glow)"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0,50;50,0;0,50"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
