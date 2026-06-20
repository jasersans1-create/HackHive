import React, { useEffect, useRef, useState } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
};

type PointerState = {
  active: boolean;
  x: number;
  y: number;
};

const PARTICLE_COUNT = 400;
const COLORS = ['#fff', '#666', '#ff3366', '#33ccff'];
const TRAIL_FADE = 'rgba(0, 0, 0, 0.2)';

const randomParticle = (width: number, height: number): Particle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
  mass: Math.random() * 2 + 1,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

const pullTowardPointer = (particle: Particle, pointer: PointerState) => {
  if (!pointer.active) return;

  const dx = pointer.x - particle.x;
  const dy = pointer.y - particle.y;
  const distanceSq = dx * dx + dy * dy;
  const distance = Math.sqrt(distanceSq) || 1;
  const force = 1000 / (distanceSq + 100);

  particle.vx += (dx / distance) * force * (1 / particle.mass);
  particle.vy += (dy / distance) * force * (1 / particle.mass);
};

const GravitySim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = canvas.width;
    let height = canvas.height;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => randomParticle(width, height));

    const pointer: PointerState = { active: false, x: 0, y: 0 };

    const onMouseDown = () => { pointer.active = true; };
    const onMouseUp = () => { pointer.active = false; };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);

    let animationFrame: number;

    const render = () => {
      context.fillStyle = TRAIL_FADE;
      context.fillRect(0, 0, width, height);

      for (const particle of particles) {
        pullTowardPointer(particle, pointer);

        // This little bit of drag keeps the swarm from exploding off-screen.
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.mass, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full relative cursor-crosshair group flex justify-center items-center overflow-hidden">
      {isPlaying ? (
        <canvas ref={canvasRef} className="w-full h-full block" />
      ) : (
        <button
          type="button"
          className="absolute inset-0 flex flex-col items-center justify-center bg-black hover:bg-white/5 transition duration-300"
          onClick={() => setIsPlaying(true)}
          data-hover="true"
        >
          <h2 className="text-xl md:text-3xl font-mono uppercase tracking-[0.3em] font-bold text-white group-hover:text-blue-400 transition-colors">
            PULL_THE_SWARM
          </h2>
        </button>
      )}
      <div className="absolute top-0 left-0 right-0 p-2 border-b border-white/20 flex justify-between font-mono text-[10px] text-gray-500 bg-black/80 z-10 pointer-events-none">
        <span>KINETIC_TOY</span>
        <span>HOLD_MOUSE_TO_PULL</span>
      </div>
    </div>
  );
};

export default GravitySim;
