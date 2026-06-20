import { Fragment, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EMPHASIZED_WORDS = new Set(['Hackatime', 'API', 'open-source', 'bot', 'model', 'co-founders', 'hackathon']);

const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  const repeatDelays = useMemo(() => [Math.random() * 4 + 2, Math.random() * 4 + 2], []);

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="absolute top-[1px] left-0 -ml-[1px] text-red-500 opacity-50 mix-blend-screen pointer-events-none"
        animate={{ x: [-1, 1, 0], y: [0, 0, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: repeatDelays[0] }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute -top-[1px] left-0 ml-[1px] text-blue-500 opacity-50 mix-blend-screen pointer-events-none"
        animate={{ x: [1, -1, 0], y: [0, 0, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: repeatDelays[1] }}
      >
        {text}
      </motion.span>
      <span className="relative z-10">{text}</span>
    </span>
  );
};

const TypewriterText = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(" ");
  
  const getWordWrap = (word: string) => {
    const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, '');
    
    if (cleanWord === "HACKHIVE") {
      return <GlitchText text={word} className="text-black bg-white px-2 py-0.5 font-bold tracking-[0.2em] uppercase mx-1" />;
    } else if (cleanWord === "Macbook") {
      return <span className="text-white font-mono uppercase tracking-widest border-b border-white pb-1">{word}</span>;
    } else if (EMPHASIZED_WORDS.has(cleanWord)) {
       return <span className="text-blue-300 font-mono bg-blue-900/20 px-1.5 py-0.5 rounded text-sm tracking-tight">{word}</span>;
    }
    return word;
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
        hidden: {},
      }}
      className={`inline-block ${className} flex flex-wrap`}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            variants={{
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
            }}
            transition={{ duration: 0.4 }}
            className="inline-block"
          >
            {getWordWrap(word)}
          </motion.span>
          <span className="inline-block w-2 md:w-2.5"></span>
        </Fragment>
      ))}
    </motion.div>
  );
};

const StorySection = () => {
  return (
    <section id="story" className="relative z-10 py-24 md:py-48 bg-[#000] border-t border-white/10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-24 md:mb-32">
          <div className="h-px w-12 bg-white/30" />
          <span className="font-mono text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase">FIELD_NOTES // WHY THIS EXISTS</span>
        </div>

        <div className="space-y-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start"
          >
            <div className="md:col-span-4 font-mono text-gray-500 text-xs tracking-widest uppercase mt-2">
              <GlitchText text="[ 01_START_HERE ]" />
            </div>
            <div className="md:col-span-8 text-xl md:text-3xl font-sans font-light leading-relaxed text-gray-300">
              <TypewriterText text="If you have ten project ideas and no clue where to start, you are exactly the kind of person we want here. Hack Club is full of teenagers shipping messy, real things. You learn by building, breaking, asking, and showing people what you made." />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start"
          >
            <div className="md:col-span-4 font-mono text-gray-500 text-xs tracking-widest uppercase mt-2">
              <GlitchText text="[ 02_TIME_COUNTS ]" />
            </div>
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="text-xl md:text-3xl font-sans font-light leading-relaxed text-gray-300">
                <TypewriterText text="Hackatime makes your hours visible. Not in a scary scoreboard way, more like proof that the tiny late-night commits actually happened. Build a bot, a web app, a board, or a model. Those hours can help you get API credits, parts, keyboards, and sometimes even a Macbook.*" />
              </div>
              <motion.div 
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 1, duration: 1 }}
                viewport={{ once: true }}
                className="font-mono text-xs md:text-sm text-red-500/80 tracking-wider bg-red-950/20 p-4 border border-red-900/30"
              >
                * AI is fine as a helper, but keep it to 30% of the project max. You should still understand the code, fix the bugs, explain what changed, and do the real effort: commits, debugging, experiments, and the parts where you actually learn.
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start"
          >
            <div className="md:col-span-4 font-mono text-gray-500 text-xs tracking-widest uppercase mt-2">
               <GlitchText text="[ 03_ONLINE_INDIA ]" />
            </div>
            <div className="md:col-span-8 text-xl md:text-3xl font-sans font-light leading-relaxed text-gray-300">
                <TypewriterText text="Right now HackHive is completely online. There is no Delhi HQ to show up to. If you are anywhere in India and you want people to build with, ask questions around, or show your weird hardware or app idea to, you are welcome here." />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="border border-white/20 p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/5 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500" />
            <div className="relative z-10 flex flex-col items-start gap-8">
              <h3 className="text-2xl md:text-4xl font-sans font-light text-white tracking-widest uppercase">
                <GlitchText text="Pull up. Build something." />
              </h3>
              <p className="text-gray-400 font-mono text-xs md:text-sm leading-relaxed max-w-2xl">
                Start tiny. Bring one broken idea, one repo, one circuit, one question. Join online from anywhere in India and we will help you turn it into something you can point at and say: yeah, I made that.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mt-4">
                <motion.a 
                  whileHover={{ scale: 1.1, y: -5, boxShadow: "0px 10px 30px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  href="https://hack.club/join/GXVIWV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-4 bg-white text-black font-mono tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors"
                  data-hover="true"
                >
                  Join the swarm <ArrowUpRight className="w-4 h-4" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, y: -5, boxShadow: "0px 10px 30px rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  href="https://hackclub.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-mono tracking-widest uppercase text-xs hover:bg-white/10 transition-colors"
                  data-hover="true"
                >
                  See Hack Club <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default StorySection;
