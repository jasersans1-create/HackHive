import React from 'react';

const HiveField: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden opacity-20 group" aria-hidden="true">
      <svg
        className="absolute w-full h-full animate-[pulse-opacity_8s_ease-in-out_infinite]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hive-pattern"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(0.5)"
          >
            <path
              d="M50 0L93.301 25V75L50 100L6.699 75V25L50 0Z"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              className="opacity-30"
            />
            <path
              d="M50 0V25M93.301 25L71.651 37.5M93.301 75L71.651 62.5M50 100V75M6.699 75L28.349 62.5M6.699 25L28.349 37.5"
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="0.5"
              strokeDasharray="1 3"
            />
          </pattern>
          <linearGradient id="fade-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hive-pattern)"
          mask="url(#fade-gradient)"
        />
      </svg>
      {/* The sweep adds just enough movement that the static hex grid does not feel flat. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] animate-[sweep_10s_ease-in-out_infinite] rotate-45 transform-gpu" />
    </div>
  );
};

export default HiveField;
