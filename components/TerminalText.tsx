import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TerminalTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const TerminalText: React.FC<TerminalTextProps> = ({ text, delay = 0, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      // Slight jitter keeps the typing from feeling mechanically timed.
      const typingDelay = 50 + Math.random() * 50;
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, typingDelay);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, started, text]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span 
        className="inline-block align-middle ml-1 font-mono"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.49, 0.5, 1], ease: "linear" }}
      >
        _
      </motion.span>
    </span>
  );
};

export default TerminalText;
