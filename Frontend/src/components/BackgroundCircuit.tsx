"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BackgroundCircuit() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // === Scene Setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // === Particles ===
    const particles = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 15;
      positions.set([x, y, z], i * 3);
      const hue = 180 + Math.random() * 120; // cyan to purple range
      const color = new THREE.Color(`hsl(${hue}, 100%, 70%)`);
      colors.set([color.r, color.g, color.b], i * 3);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // === Grid Glow ===
    const gridHelper = new THREE.GridHelper(30, 60, 0x4466ff, 0x003366);
    gridHelper.position.y = -2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    scene.add(gridHelper);

    // === Lights ===
    const ambientLight = new THREE.AmbientLight(0x3399ff, 0.25);
    const pointLight = new THREE.PointLight(0x33ffff, 0.3, 100);
    scene.add(ambientLight, pointLight);

    // === Electric Arcs ===
    const arcs: { mesh: THREE.Line; life: number }[] = [];

    const createElectricArc = (start: THREE.Vector3, end: THREE.Vector3) => {
      const segments = 15;
      const pointsArr: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const pos = new THREE.Vector3().lerpVectors(start, end, t);
        pos.x += (Math.random() - 0.5) * 0.3;
        pos.y += (Math.random() - 0.5) * 0.3;
        pos.z += (Math.random() - 0.5) * 0.3;
        pointsArr.push(pos);
      }

      const arcGeom = new THREE.BufferGeometry().setFromPoints(pointsArr);
      const hue = 180 + Math.random() * 120;
      const arcMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(`hsl(${hue}, 100%, 65%)`),
        transparent: true,
        opacity: 0.8,
      });

      const arc = new THREE.Line(arcGeom, arcMat);
      arc.userData.life = 1;
      scene.add(arc);
      arcs.push({ mesh: arc, life: 1 });
    };

    const spawnArcs = (count: number) => {
      for (let i = 0; i < count; i++) {
        const start = new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 10
        );
        const end = start.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 3
          )
        );
        createElectricArc(start, end);
      }

      const heroTitle = document.querySelector(".hero-title");
      if (heroTitle) {
        heroTitle.classList.add("glow-react");
        setTimeout(() => heroTitle.classList.remove("glow-react"), 400);
      }
    };

    // === Interaction ===
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      spawnArcs(1);
    };

    const handleClick = () => {
      spawnArcs(5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // === Scroll Interaction (Improved stability) ===
    let scrollY = window.scrollY;
    let scrollTarget = 0;

    const handleScroll = () => {
      scrollTarget = Math.min(window.scrollY / (window.innerHeight * 2), 1); // cap scroll effect
    };
    window.addEventListener("scroll", handleScroll);

    // === Animation ===
    const animate = () => {
      requestAnimationFrame(animate);

      // Scroll-based smooth depth and tilt (limited)
      scrollY += (scrollTarget - scrollY) * 0.05;
      camera.position.z = 5 - scrollY * 1.5; // subtle zoom
      camera.rotation.x = scrollY * 0.1;
      camera.rotation.y = 0; // keep horizontal alignment fixed

      // Mouse-based parallax (limited for no drift)
      target.x += (mouse.x - target.x) * 0.02;
      target.y += (mouse.y - target.y) * 0.02;
      camera.position.x = target.x * 1.0; // reduced for stability
      camera.position.y = target.y * 1.0;

      // Object Animations
      points.rotation.x += 0.0008;
      points.rotation.y += 0.001;
      gridHelper.rotation.y += 0.0006;

      arcs.forEach((arc, index) => {
        arc.life -= 0.02;
        (arc.mesh.material as THREE.LineBasicMaterial).opacity = arc.life;
        if (arc.life <= 0) {
          scene.remove(arc.mesh);
          arcs.splice(index, 1);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // === Resize Handler ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // === Cleanup ===
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {/* Main Circuit Background */}
      <div
    ref={containerRef}
    className="fixed inset-0 z-0 pointer-events-none"
    style={{
      background:
        "radial-gradient(circle at center, #000015 0%, #000010 70%, #000008 100%)",
    }}
  />

      {/* Hero Section Side Lines */}
      <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-0 flex justify-between px-6 sm:px-16 lg:px-24">
        <div className="w-[2px] h-[80vh] mt-[10vh] bg-gradient-to-b from-cyan-400/40 via-blue-500/70 to-transparent animate-pulse" />
        <div className="w-[2px] h-[80vh] mt-[10vh] bg-gradient-to-b from-cyan-400/40 via-blue-500/70 to-transparent animate-pulse" />
      </div>
    </>
  );
}
