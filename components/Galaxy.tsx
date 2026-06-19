import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Galaxy: React.FC = () => {
  const { scrollY } = useScroll();
  const scrollLimit = 500;

  // Faster rotation when scrolling
  const scrollRotation = useTransform(scrollY, [0, scrollLimit], [0, 720]);
  const sunScale = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 0.2]);
  const sunOpacity = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 0]);

    const orbits = [
      { radius: 100, duration: 20, planetSize: 12, delay: 0 },
      { radius: 160, duration: 30, planetSize: 14, delay: 2 },
      { radius: 240, duration: 40, planetSize: 16, delay: 4 },
      { radius: 340, duration: 55, planetSize: 12, delay: 6 },
      { radius: 460, duration: 70, planetSize: 18, delay: 1 },
    ];
  
    const dustParticles = React.useMemo(() => {
      return Array.from({ length: 40 }).map((_, i) => ({
        id: `dust-${i}`,
        size: Math.random() * 3 + 1,
        left: (Math.random() - 0.5) * 800,
        top: (Math.random() - 0.5) * 800,
        rotateDuration: 20 + Math.random() * 40,
        scaleDuration: 2 + Math.random() * 2,
        opacityDuration: 2 + Math.random() * 2,
      }));
    }, []);
  
    // Honeycomb path for the sun
    const numHexagons = 19;
    const hexRadius = 15;
    
    // Generate hex coordinates
    const hexagons = React.useMemo(() => {
      const hexes = [];
      const width = Math.sqrt(3) * hexRadius;
      const height = 2 * hexRadius;
      
      const qRange = [-2, -1, 0, 1, 2];
      const rRange = [-2, -1, 0, 1, 2];
      
      for (const q of qRange) {
        for (const r of rRange) {
           const s = -q-r;
           if (Math.abs(s) <= 2) {
              const x = width * (q + r/2);
              const y = height * (3/4 * r);
              hexes.push({ q, r, x, y, id: `${q}-${r}` });
           }
        }
      }
      return hexes;
    }, []);
  
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative flex items-center justify-center"
          style={{ rotate: scrollRotation }}
        >
          {/* Central Sun as Honeycomb Hive */}
          <motion.div
            className="absolute flex items-center justify-center mix-blend-screen"
            style={{ 
              width: 140, 
              height: 140, 
              scale: sunScale, 
              opacity: sunOpacity,
              filter: 'drop-shadow(0px 0px 40px rgba(255, 200, 0, 0.4)) drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.8))'
            }}
          >
            <svg viewBox="-80 -80 160 160" className="w-full h-full" style={{ color: "rgba(255, 220, 100, 0.9)" }}>
              {hexagons.map(hex => (
                <polygon
                  key={hex.id}
                  points="13,-7.5 0,-15 -13,-7.5 -13,7.5 0,15 13,7.5"
                  fill="currentColor"
                  stroke="rgba(0,0,0,0.8)"
                  strokeWidth="2"
                  transform={`translate(${hex.x}, ${hex.y}) scale(0.95)`}
                />
              ))}
            </svg>
          </motion.div>
  
          {/* Orbits and Bee Planets */}
          {orbits.map((orbit, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/5"
              style={{ width: orbit.radius * 2, height: orbit.radius * 2 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: orbit.duration,
                repeat: Infinity,
                ease: "linear",
                delay: orbit.delay
              }}
            >
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: orbit.planetSize * 2,
                  height: orbit.planetSize * 2,
                  top: '50%',
                  left: -orbit.planetSize,
                  transform: 'translateY(-50%)',
                  filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.5))'
                }}
              >
                  {/* Cute Bee SVG */}
                  <svg 
                     viewBox="0 0 100 100" 
                     className="w-full h-full text-yellow-300" 
                     style={{ transform: "rotate(90deg)" }} // orient bee forward in orbit
                  >
                    {/* Wings */}
                    <path d="M50 30 Q70 0 90 20 Q70 40 50 40" fill="rgba(255,255,255,0.7)" />
                    <path d="M50 70 Q70 100 90 80 Q70 60 50 60" fill="rgba(255,255,255,0.7)" />
                    {/* Body */}
                    <ellipse cx="40" cy="50" rx="30" ry="20" fill="currentColor" />
                    {/* Stripes */}
                    <path d="M25 33 Q30 50 25 67 L35 69 Q40 50 35 31 Z" fill="#222" />
                    <path d="M45 31 Q50 50 45 69 L55 67 Q60 50 55 33 Z" fill="#222" />
                    {/* Stinger */}
                    <path d="M10 50 L0 48 L0 52 Z" fill="#222" />
                    {/* Eye */}
                    <circle cx="60" cy="42" r="3" fill="#222" />
                  </svg>
              </div>
            </motion.div>
          ))}
          
          {/* Extra glowing dust particles on the galaxy plane */}
        {dustParticles.map((dust) => (
          <motion.div
            key={dust.id}
            className="absolute rounded-full bg-white/40"
            style={{
              width: dust.size,
              height: dust.size,
              left: dust.left,
              top: dust.top,
            }}
            animate={{ rotate: -360, scale: [1, 1.5, 1], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              rotate: { duration: dust.rotateDuration, repeat: Infinity, ease: 'linear' },
              scale: { duration: dust.scaleDuration, repeat: Infinity },
              opacity: { duration: dust.opacityDuration, repeat: Infinity }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Galaxy;
