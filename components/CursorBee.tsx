import React, { useEffect, useRef } from 'react';

type Point = {
  x: number;
  y: number;
};

const BEE_SIZE = 42;
const EDGE_SPAWN_MARGIN = 96;
const MAX_SPEED = 760;
const MAX_FORCE = 2300;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const spawnFromScreenEdge = (): Point => {
  const side = Math.floor(Math.random() * 4);

  if (side === 0) return { x: -EDGE_SPAWN_MARGIN, y: Math.random() * window.innerHeight };
  if (side === 1) return { x: window.innerWidth + EDGE_SPAWN_MARGIN, y: Math.random() * window.innerHeight };
  if (side === 2) return { x: Math.random() * window.innerWidth, y: -EDGE_SPAWN_MARGIN };

  return { x: Math.random() * window.innerWidth, y: window.innerHeight + EDGE_SPAWN_MARGIN };
};

const CursorBee: React.FC = () => {
  const beeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bee = beeRef.current;
    if (!bee) return;

    const start = spawnFromScreenEdge();
    let x = start.x;
    let y = start.y;
    let vx = 0;
    let vy = 0;
    let angle = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let lastTime = performance.now();
    let animationFrame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const fly = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const dx = targetX - x;
      const dy = targetY - y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      const arriveSpeed = clamp(distance * 5.2, 120, MAX_SPEED);
      const desiredVx = (dx / distance) * arriveSpeed;
      const desiredVy = (dy / distance) * arriveSpeed;
      let steerX = desiredVx - vx;
      let steerY = desiredVy - vy;
      const steerLength = Math.sqrt(steerX * steerX + steerY * steerY) || 1;

      if (steerLength > MAX_FORCE) {
        steerX = (steerX / steerLength) * MAX_FORCE;
        steerY = (steerY / steerLength) * MAX_FORCE;
      }

      const flutter = Math.sin(now * 0.016) * 170;
      const sideX = -dy / distance;
      const sideY = dx / distance;

      vx += (steerX + sideX * flutter) * delta;
      vy += (steerY + sideY * flutter) * delta;

      const speed = Math.sqrt(vx * vx + vy * vy) || 1;
      if (speed > MAX_SPEED) {
        vx = (vx / speed) * MAX_SPEED;
        vy = (vy / speed) * MAX_SPEED;
      }

      x += vx * delta;
      y += vy * delta;

      if (speed > 2) {
        const targetAngle = Math.atan2(vy, vx);
        const diff = Math.atan2(Math.sin(targetAngle - angle), Math.cos(targetAngle - angle));
        angle += diff * (1 - Math.exp(-12 * delta));
      }

      const bob = Math.sin(now * 0.012) * 2.5;
      const tilt = Math.sin(now * 0.02) * 0.08;
      bee.style.transform = `translate3d(${x}px, ${y + bob}px, 0) rotate(${angle + tilt}rad)`;
      animationFrame = requestAnimationFrame(fly);
    };

    bee.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    animationFrame = requestAnimationFrame(fly);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={beeRef}
      className="cursor-bee fixed left-0 top-0 z-[9997] pointer-events-none will-change-transform"
      style={{
        width: BEE_SIZE,
        height: BEE_SIZE,
        marginLeft: -BEE_SIZE / 2,
        marginTop: -BEE_SIZE / 2,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 96 76" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="cursor-bee-body" cx="42%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#fff7ad" />
            <stop offset="36%" stopColor="#facc15" />
            <stop offset="78%" stopColor="#e89a00" />
            <stop offset="100%" stopColor="#8a4b00" />
          </radialGradient>
          <radialGradient id="cursor-bee-head" cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#fff8c7" />
            <stop offset="54%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#b96300" />
          </radialGradient>
          <linearGradient id="cursor-bee-wing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="58%" stopColor="#dff7ff" stopOpacity="0.76" />
            <stop offset="100%" stopColor="#8fd8ff" stopOpacity="0.28" />
          </linearGradient>
          <filter id="cursor-bee-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#facc15" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#cursor-bee-shadow)">
          <g className="cursor-bee-wing cursor-bee-wing-left">
            <path
              d="M40 30 C31 9 45 -3 63 5 C62 24 52 34 40 30 Z"
              fill="url(#cursor-bee-wing)"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.25"
            />
            <path d="M43 27 C48 18 54 11 61 6" stroke="rgba(120,190,210,0.42)" strokeWidth="0.9" fill="none" />
          </g>

          <g className="cursor-bee-wing cursor-bee-wing-right">
            <path
              d="M48 31 C52 8 70 0 84 13 C78 30 64 38 48 31 Z"
              fill="url(#cursor-bee-wing)"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.25"
            />
            <path d="M52 28 C61 20 70 15 80 13" stroke="rgba(120,190,210,0.42)" strokeWidth="0.9" fill="none" />
          </g>

          <path d="M22 45 L8 38 L8 52 Z" fill="#171717" />
          <ellipse cx="41" cy="45" rx="27" ry="17" fill="url(#cursor-bee-body)" />
          <path d="M24 31 C29 39 29 51 24 59" stroke="#161616" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M39 29 C46 38 46 52 39 61" stroke="#161616" strokeWidth="6" strokeLinecap="round" />
          <path d="M54 33 C59 40 59 50 54 57" stroke="#161616" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
          <ellipse cx="64" cy="45" rx="15" ry="14" fill="url(#cursor-bee-head)" />
          <path d="M49 35 C57 30 67 32 74 38" stroke="rgba(255,255,255,0.42)" strokeWidth="2.3" strokeLinecap="round" fill="none" />
          <circle cx="70" cy="40" r="2.7" fill="#111" />
          <circle cx="70.9" cy="39.2" r="0.8" fill="#fff" />
          <path d="M72 50 Q68 53 63 51" stroke="#1f1f1f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M69 32 Q72 22 80 20" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M61 31 Q60 21 53 18" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="81" cy="20" r="2.1" fill="#111" />
          <circle cx="53" cy="18" r="2.1" fill="#111" />
          <path d="M32 60 Q30 68 25 70" stroke="#151515" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M48 62 Q48 70 42 72" stroke="#151515" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M58 58 Q62 67 68 69" stroke="#151515" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default CursorBee;
