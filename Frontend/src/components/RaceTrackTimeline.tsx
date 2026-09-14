import React, { useRef, useMemo } from "react";
import { motion } from "motion/react";
import { useInView } from "motion/react";

type EventItem = {
    time: string;
    title: string;
    venue: string;
    notes?: string;
};

export default function RaceTrackTimeline() {
    const ref = useRef<HTMLElement | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    // Memoized event data
    const events = useMemo<EventItem[]>(
        () => [
            { time: "9:30 – 10:30", title: "Registration & Inauguration", venue: "F-Block & Auditorium", notes: "—" },
            { time: "9:00 – 10:00", title: "Buffer / Setup Time", venue: "—", notes: "Setup and Movement to event venues" },
            { time: "10:00 – 1:00", title: "BGMI", venue: "201, 202 (C Block)", notes: "—" },
            { time: "10:00 – 1:00", title: "Free Fire", venue: "201, 202 (C Block)", notes: "—" },
            { time: "10:00 – 1:00", title: "Free Fire(Solo)", venue: "201 (C Block)", notes: "—" },
            { time: "10:00 – 1:00", title: "BGMI(Solo)", venue: "202 (C Block)", notes: "—" },
            { time: "10:30 – 11:00", title: "Startup Bid", venue: "Auditorium", notes: "—" },
            { time: "10:30 – 11:30", title: "Tekken 7", venue: "307 (C Block)", notes: "—" },
            { time: "11:00 – 11:30", title: "Tech Show", venue: "Auditorium", notes: "—" },
            { time: "11:30 – 12:30", title: "Tech Quiz", venue: "GTH 1 & 2 (C Block)", notes: "—" },
            { time: "12:30 – 1:30", title: "Poster Making", venue: "102, 206 (C Block)", notes: "—" },
            { time: "12:40 – 1:30", title: "Lunch Break", venue: "—", notes: "50 minutes" },
            { time: "1:30 – 2:30", title: "Code Relay", venue: "GTH 1 & 2 (C Block)", notes: "—" },
            { time: "2:30 – 3:00", title: "Tech Treasure", venue: "305, 306 (C Block)", notes: "—" },
            { time: "3:00 – 4:20", title: "Prize Distribution", venue: "Auditorium", notes: "—" },
        ],
        []
    );

    // Anchor positions for cards along the track (initial anchors)
    // Anchor positions — EXACTLY on the racetrack, perfectly spaced
const cardAnchors = useMemo(() => {
    const total = events.length; // 15

    // Create an SVG path programmatically
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Track curve (same as your motionPath)
    path.setAttribute(
        "d",
        "M 100 350 C 260 260, 420 250, 600 320 C 760 380, 820 250, 1000 300 C 1180 350, 1240 450, 1350 420"
    );
    svg.appendChild(path);

    const fullLength = path.getTotalLength();

    // Sample exact coordinates equally along the track
    return Array.from({ length: total }).map((_, i) => {
        const p = path.getPointAtLength((fullLength * i) / (total - 1));
        return { x: p.x, y: p.y };
    });
}, [events.length]);



    // Animation variants (like About.tsx)
    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.08, duration: 0.6, ease: "easeOut" },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
    };

    // Compute non-overlapping card layout from anchors - improved algorithm (same approach as before)
    const laidOutCards = useMemo(() => {
        const cardWidth = 300;
        const cardHeight = 92;
        const verticalMargin = 23;
        const vShift = 12; // vertical incremental shift
        const maxAttempts = 120;
        const placed: { x: number; y: number; w: number; h: number }[] = [];

        const rects: { x: number; y: number; w: number; h: number; markerX: number; markerY: number }[] = [];

        const intersects = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
            !(a.x + a.w <= b.x || a.x >= b.x + b.w || a.y + a.h <= b.y || a.y >= b.y + b.h);

        for (let i = 0; i < cardAnchors.length; i++) {
            const anchor = cardAnchors[i];
            const preferAbove = i % 2 !== 0;

            let cardX = Math.round(anchor.x - cardWidth / 2);
            let cardY = preferAbove ? Math.round(anchor.y - cardHeight - verticalMargin) : Math.round(anchor.y + verticalMargin);

            const minX = 8;
            const maxX = Math.max(...cardAnchors.map(a => a.x)) + 50;

            let currentRect = { x: cardX, y: cardY, w: cardWidth, h: cardHeight };

            let attempts = 0;
            let hDir = i % 2 === 0 ? 1 : -1;
            while (placed.some((p) => intersects(p, currentRect)) && attempts < maxAttempts) {
                if (attempts < 8) {
                    currentRect.y += preferAbove ? -vShift : vShift;
                } else if (attempts < 22) {
                    currentRect.x += hDir * (8 + Math.floor((attempts - 8) / 3) * 6);
                    hDir = -hDir;
                } else {
                    currentRect.y += preferAbove ? -vShift * 1.6 : vShift * 1.6;
                    currentRect.x += hDir * 12;
                    hDir = -hDir;
                }

                if (currentRect.x < minX) currentRect.x = minX;
                if (currentRect.x > maxX) currentRect.x = maxX;

                attempts++;
            }

            if (currentRect.x < minX) currentRect.x = minX;
            if (currentRect.x > maxX) currentRect.x = maxX;

            placed.push({ ...currentRect });

            rects.push({
                x: currentRect.x,
                y: currentRect.y,
                w: currentRect.w,
                h: currentRect.h,
                // keep marker offsets for reference but we will use absolute anchors for drawing markers/lines
                markerX: Math.round(anchor.x - currentRect.x),
                markerY: Math.round(anchor.y - currentRect.y),
            });
        }

        return rects;
    }, [cardAnchors]);

    return (
        <section id="timeline" ref={ref} className="relative py-24 overflow-visible bg-transparent">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Header section (motion) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.45 }}
                        className="inline-block mb-4"
                    >
                        <span className="px-4 py-2 glass rounded-full text-sm text-cyan-400">YUGANTRAN 2.0 — Schedule</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-orbitron mb-4">
                    <span className="gradient-text">Event Flow</span> - Timeline
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Visual timeline of the day — real racing car runs along the route to guide your eye.
                    </p>
                </motion.div>

                {/* Main SVG as a motion container so children pick up stagger */}
                <motion.svg
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="rt-svg w-full h-auto"
                    viewBox="0 0 1400 600"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Racing track timeline showing the YUGANTRAN 2.0 schedule"
                >
                    <defs>
                        <linearGradient id="cyanToPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00eaff" />
                            <stop offset="60%" stopColor="#6de0ff" />
                            <stop offset="100%" stopColor="#7b5cff" />
                        </linearGradient>

                        <linearGradient id="trackInner" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#2b2b2b" />
                            <stop offset="100%" stopColor="#0b0b0b" />
                        </linearGradient>

                        <filter id="glowSmall" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="6" result="s" />
                            <feMerge>
                                <feMergeNode in="s" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.55" />
                        </filter>

                        <path
                            id="motionPath"
                            d="
                M 100 350
                C 260 260, 420 250, 600 320
                C 760 380, 820 250, 1000 300
                C 1180 350, 1240 450, 1350 420
              "
                        />
                    </defs>

                    {/* Track layers (no background rectangle, user has their own background) */}
                    <g>
                        <path
                            d="M 100 350 C 260 260, 420 250, 600 320 C 760 380, 820 250, 1000 300 C 1180 350, 1240 450, 1350 420"
                            fill="none"
                            stroke="url(#cyanToPurple)"
                            strokeWidth="16"
                            strokeLinecap="round"
                            opacity="0.18"
                        />
                        <path
                            d="M 100 350 C 260 260, 420 250, 600 320 C 760 380, 820 250, 1000 300 C 1180 350, 1240 450, 1350 420"
                            fill="none"
                            stroke="#22272b"
                            strokeWidth="12"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 100 350 C 260 260, 420 250, 600 320 C 760 380, 820 250, 1000 300 C 1180 350, 1240 450, 1350 420"
                            fill="none"
                            stroke="url(#trackInner)"
                            strokeWidth="6"
                            strokeLinecap="round"
                        />
                    </g>

                    {/* dashed centerline */}
                    <path
                        d="M 120 350 C 260 275, 420 265, 595 330 C 760 390, 825 265, 990 315 C 1160 360, 1210 450, 1330 430"
                        fill="none"
                        stroke="#ffd659"
                        strokeWidth="5"
                        strokeDasharray="28 20"
                        strokeLinecap="round"
                        opacity="0.95"
                    />

                    {/* moving streak for motion */}
                    <path
                        d="M 100 350 C 260 260, 420 250, 600 320 C 760 380, 820 250, 1000 300 C 1180 350, 1240 450, 1350 420"
                        fill="none"
                        stroke="url(#cyanToPurple)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="1 260"
                        strokeDashoffset="0"
                        style={{ mixBlendMode: "screen" } as any}
                        filter="url(#glowSmall)"
                    >
                        <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="5s" repeatCount="indefinite" />
                    </path>

                    {/* Realistic-style car silhouette based on the provided image */}
                    <g filter="url(#softShadow)">
                        <g transform="translate(-24,-12)">
                            <animateMotion dur="5.4s" repeatCount="indefinite" rotate="auto">
                                <mpath href="#motionPath" />
                            </animateMotion>

                            <g transform="scale(0.95)" aria-hidden>
                                {/* car body */}
                                <path
                                    d="M8 22 C22 8, 52 8, 78 22 L92 34 C96 38,96 44,89 50 L18 50 C12 44,12 38,18 32 Z"
                                    fill="#5b7072ff"
                                    stroke="#0095a8"
                                    strokeWidth="0.8"
                                />
                                {/* highlight */}
                                <path
                                    d="M12 26 C26 14, 46 14, 72 26"
                                    fill="none"
                                    stroke="#00eaff"
                                    strokeWidth="1.6"
                                    opacity="0.85"
                                />
                                {/* windshield */}
                                <path d="M30 14 L54 14 L66 24 L38 24 Z" fill="#024965ff" opacity="0.9" />
                                {/* wheels */}
                                <circle cx="28" cy="54" r="6.2" fill="#071b22" stroke="#0b8899" strokeWidth="1.2" />
                                <circle cx="72" cy="54" r="6.2" fill="#071b22" stroke="#0b8899" strokeWidth="1.2" />
                                {/* headlight glow (front) */}
                                <ellipse cx="84" cy="36" rx="4" ry="2.2" fill="#ffd659" opacity="0.95" />
                                <ellipse cx="84" cy="36" rx="10" ry="4" fill="#ffd659" opacity="0.12" />
                            </g>
                        </g>
                    </g>

                    {/* Event markers & connectors drawn using absolute coordinates,
              cards drawn at absolute positions — this ensures markers spread properly
              over the track (no shared/clamped X coordinate). */}
                    {events.map((ev, i) => {
                        const layout = laidOutCards[i];
                        const cardWidth = 300;
                        const cardHeight = 92;

                        // Anchor on track (absolute)
                        const anchor = cardAnchors[i] ?? { x: 120 + i * 90, y: 300 };
                        const anchorX = anchor.x;
                        const anchorY = anchor.y;

                        // card absolute position (from layout)
                        const posX = layout ? layout.x : Math.round(anchor.x - cardWidth / 2);
                        const posY = layout ? layout.y : Math.round(anchor.y - cardHeight - 42);

                        // determine whether the card sits above or below the anchor
                        const cardCenterY = posY + cardHeight / 2;
                        const isAnchorAboveCard = anchorY < posY + cardHeight / 2;

                        // connector endpoints (absolute)
                        const cardEdgeX = posX + cardWidth / 2; // connect from center of card horizontally
                        const cardEdgeY = isAnchorAboveCard ? posY + cardHeight : posY; // bottom if anchor is above, top if anchor is below

                        // draw multiple marker dots along the vertical connector like the reference screenshot
                        const dotCount = 3;
                        const dots: { cx: number; cy: number }[] = [];
                        // place dots evenly between the anchor and the cardEdgeY (but keep them visually stacked)
                        for (let d = 0; d < dotCount; d++) {
                            const t = (d + 1) / (dotCount + 1);
                            const dotY = anchorY + (cardEdgeY - anchorY) * t;
                            dots.push({ cx: anchorX, cy: Math.round(dotY) });
                        }

                        return (
                            <motion.g key={i} variants={itemVariants} style={{ willChange: "transform, opacity" }} role="group">
                                {/* vertical connector (absolute) */}
                                <line
                                    x1={anchorX}
                                    y1={anchorY}
                                    x2={anchorX}
                                    y2={cardEdgeY}
                                    stroke="#ffd659"
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    opacity={0.50}
                                />

                                {/* stacked dots */}
                                {dots.map((d, idx) => (
                                    <circle key={idx} cx={d.cx} cy={d.cy} r={8 - idx * 1.4} fill="#ffd659" opacity={0.40} filter="url(#glowSmall)" />
                                ))}

                                {/* marker circle at track (slightly larger) */}
                                <circle cx={anchorX} cy={anchorY} r={10} fill="#ffd659" filter="url(#glowSmall)" />

                                {/* card background (absolute position) */}
                                <g transform={`translate(${posX}, ${posY})`}>
                                    <rect
                                        x={0}
                                        y={0}
                                        rx={10}
                                        ry={10}
                                        width={cardWidth}
                                        height={cardHeight}
                                        fill="none"
                                    />

                                    <rect
                                        x={0}
                                        y={0}
                                        rx={10}
                                        ry={10}
                                        width={12}
                                        height={cardHeight}
                                        fill="none"
                                    />

                                    <text
                                        x={26}
                                        y={28}
                                        fontSize={15}
                                        fill="#eafcff"
                                        fontFamily="Orbitron, sans-serif"
                                    >
                                        {ev.title}
                                    </text>

                                    <text
                                        x={26}
                                        y={48}
                                        fontSize={13}
                                        fill="#bfeeff"
                                        fontFamily="Inter, sans-serif"
                                    >
                                        {ev.time} • {ev.venue}
                                    </text>

                                    <text
                                        x={26}
                                        y={66}
                                        fontSize={12}
                                        fill="#bfeeff"
                                        fontFamily="Inter, sans-serif"
                                    >
                                        {ev.notes ?? ""}
                                    </text>
                                </g>

                            </motion.g>
                        );
                    })}
                </motion.svg>
            </div>
        </section>
    );
}