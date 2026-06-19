/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);
  const particleIdCounter = useRef(0);
  
  // Initialize off-screen to prevent flash
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Smooth spring animation
  const springConfig = { damping: 20, stiffness: 350, mass: 0.1 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    let lastTime = 0;
    
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || 
                        target.closest('a') || 
                        target.closest('.cursor-pointer') ||
                        target.closest('[data-hover="true"]');
      setIsHovering(!!clickable);

      // Spawn particles
      const now = performance.now();
      if (now - lastTime > 30) { // Limit spawn rate
        lastTime = now;
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        setParticles(prev => [
          ...prev.slice(-20), // Keep trail short
          { 
            id: particleIdCounter.current++, 
            x: e.clientX, 
            y: e.clientY,
            color
          }
        ]);
        setTimeout(() => {
          setParticles(prev => prev.slice(1));
        }, 800);
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <>
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1, x: p.x - 5, y: p.y - 5 }}
            animate={{ 
              opacity: 0, 
              scale: 0, 
              x: p.x + (Math.random() - 0.5) * 100, 
              y: p.y + (Math.random() - 0.5) * 100,
              rotate: Math.random() * 360
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full mix-blend-screen"
            style={{ 
              width: 10, 
              height: 10,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`
            }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center will-change-transform"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="relative border border-white flex items-center justify-center overflow-hidden"
          style={{ width: 40, height: 40 }}
          animate={{
            scale: isHovering ? 2 : 1, 
            rotate: isHovering ? 180 : 0,
            borderRadius: isHovering ? "50%" : "0%",
            backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <motion.span 
            className="z-10 font-mono uppercase tracking-[0.2em] text-[8px] overflow-hidden whitespace-nowrap"
            style={{ 
              rotate: isHovering ? -180 : 0,
              color: isHovering ? "black" : "white"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            [ACT]
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;