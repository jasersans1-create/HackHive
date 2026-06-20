import React, { useEffect, useRef, useState } from 'react';

type Player = {
  x: number;
  y: number;
  angle: number;
};

const FOV = Math.PI / 3;
const MAX_RAY_DISTANCE = 12;
const RAY_STEP = 0.025;
const MIN_RAYS = 80;
const MOVE_SPEED = 2.4;
const TURN_SPEED = 2.2;
const STARTING_PLAYER: Player = { x: 1.5, y: 1.5, angle: 0 };

// A tiny map keeps the arcade demo self-contained and fast to boot.
const MAZE_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const hasAnyKey = (keys: Set<string>, options: string[]) => options.some((key) => keys.has(key));

const Raycaster: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const playerRef = useRef<Player>({ ...STARTING_PLAYER });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastTime = performance.now();

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      // Draw at device-pixel resolution, then work in normal CSS pixels.
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const isWall = (x: number, y: number) => {
      const mapX = Math.floor(x);
      const mapY = Math.floor(y);
      return MAZE_MAP[mapY]?.[mapX] !== 0;
    };

    const movePlayer = (deltaTime: number) => {
      const player = playerRef.current;
      const moveStep = deltaTime * MOVE_SPEED;
      const turnStep = deltaTime * TURN_SPEED;

      if (hasAnyKey(keysRef.current, ['a', 'arrowleft'])) {
        player.angle -= turnStep;
      }
      if (hasAnyKey(keysRef.current, ['d', 'arrowright'])) {
        player.angle += turnStep;
      }

      const direction =
        Number(hasAnyKey(keysRef.current, ['w', 'arrowup'])) -
        Number(hasAnyKey(keysRef.current, ['s', 'arrowdown']));

      if (direction !== 0) {
        const nextX = player.x + Math.cos(player.angle) * moveStep * direction;
        const nextY = player.y + Math.sin(player.angle) * moveStep * direction;

        // Resolve axes separately so sliding along walls feels natural.
        if (!isWall(nextX, player.y)) player.x = nextX;
        if (!isWall(player.x, nextY)) player.y = nextY;
      }
    };

    const castRay = (angle: number) => {
      const player = playerRef.current;
      let distance = 0;

      // A stepped ray is enough for this small maze and keeps the math easy to follow.
      while (distance < MAX_RAY_DISTANCE) {
        const testX = player.x + Math.cos(angle) * distance;
        const testY = player.y + Math.sin(angle) * distance;

        if (isWall(testX, testY)) return distance;
        distance += RAY_STEP;
      }

      return MAX_RAY_DISTANCE;
    };

    const renderMinimap = () => {
      const scale = 8;
      const padding = 14;
      const player = playerRef.current;

      context.save();
      context.globalAlpha = 0.72;
      MAZE_MAP.forEach((row, y) => {
        row.forEach((cell, x) => {
          context.fillStyle = cell ? '#ffffff' : '#1f2937';
          context.fillRect(padding + x * scale, padding + y * scale, scale - 1, scale - 1);
        });
      });
      context.fillStyle = '#38bdf8';
      context.beginPath();
      context.arc(padding + player.x * scale, padding + player.y * scale, 3, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const render = (time: number) => {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      movePlayer(deltaTime);

      context.fillStyle = '#050505';
      context.fillRect(0, 0, width, height);

      const horizon = height / 2;
      const ceiling = context.createLinearGradient(0, 0, 0, horizon);
      ceiling.addColorStop(0, '#0f172a');
      ceiling.addColorStop(1, '#020617');
      context.fillStyle = ceiling;
      context.fillRect(0, 0, width, horizon);

      const floor = context.createLinearGradient(0, horizon, 0, height);
      floor.addColorStop(0, '#111827');
      floor.addColorStop(1, '#000000');
      context.fillStyle = floor;
      context.fillRect(0, horizon, width, height - horizon);

      const rays = Math.max(MIN_RAYS, Math.floor(width / 6));
      const player = playerRef.current;

      for (let i = 0; i < rays; i += 1) {
        const rayAngle = player.angle - FOV / 2 + (i / rays) * FOV;
        const rawDistance = castRay(rayAngle);
        const distance = rawDistance * Math.cos(rayAngle - player.angle);
        const wallHeight = Math.min(height, height / Math.max(distance, 0.12));
        const shade = Math.max(42, 255 - distance * 26);
        const stripWidth = width / rays + 1;

        context.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        context.fillRect(i * stripWidth, horizon - wallHeight / 2, stripWidth, wallHeight);
      }

      renderMinimap();
      animationFrame = requestAnimationFrame(render);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault();
      }
      keysRef.current.add(key);
    };
    const onKeyUp = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());

    playerRef.current = { ...STARTING_PLAYER };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      keysRef.current.clear();
    };
  }, [isPlaying]);

  return (
    <div className="group relative flex h-full w-full cursor-crosshair items-center justify-center overflow-hidden bg-black">
      {isPlaying ? (
        <canvas ref={canvasRef} className="block h-full w-full" />
      ) : (
        <button
          type="button"
          className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white transition hover:bg-white/5"
          onClick={() => setIsPlaying(true)}
          data-hover="true"
        >
          <span className="font-mono text-xl font-bold uppercase tracking-[0.3em] md:text-3xl">
            START_MAZE
          </span>
        </button>
      )}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-between border-b border-white/20 bg-black/80 p-2 font-mono text-[10px] text-gray-500">
        <span>TINY_RAYCASTER</span>
        <span>WASD / ARROWS</span>
      </div>
    </div>
  );
};

export default Raycaster;
