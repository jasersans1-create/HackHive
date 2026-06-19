import React from 'react';
import { motion } from 'framer-motion';
import Raycaster from './games/Raycaster';
import GravitySim from './games/GravitySim';

const GAMES = [
  {
    id: 'rd_001',
    title: 'Raycaster JS Demo',
    author: '@satvikhardat',
    description: 'Made for the sprig! its a really simple version of the raycast tech used by the original doom game, origianaly made with SprigJS but i ported to react and canvas for the website!',
    component: <Raycaster />
  },
  {
    id: 'rd_002',
    title: 'Kinetic Swarm',
    author: '@harmanvij',
    description: 'A particle swarm simulation where particles are attracted to the mouse cursor, creating mesmerizing patterns. Built with HTML5 Canvas and JavaScript, I learnt javascript along the way while making this!, also this got me my first 4hrs on stardance!.',
    component: <GravitySim />
  }
];

const GameBlock = ({ game, index }: { game: typeof GAMES[0], index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full border-t border-white/10 py-16 md:py-24"
    >
      <div className="flex flex-col md:flex-row items-center justify-center p-6 md:p-12 gap-12 md:gap-24 max-w-[1400px] mx-auto relative z-10">
        
        {/* Story Text */}
        <div className={`w-full md:w-5/12 flex flex-col ${!isEven ? 'md:order-2' : ''}`}>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase">/ PROJECT_ID: {game.id}</span>
          </div>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-sans font-light text-white mb-4 leading-none uppercase">{game.title}</h3>
          <p className="text-white font-mono mb-8 text-[10px] md:text-xs tracking-[0.2em]">{`DEV_ID: ${game.author}`}</p>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base font-mono">
            {game.description}
          </p>
        </div>

        {/* Game Canvas Container */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full md:w-7/12 h-[50vh] md:h-[60vh] flex items-center justify-center bg-[#000] border border-white/20 rounded-none overflow-hidden relative group hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] ${!isEven ? 'md:order-1' : ''}`}
        >
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative z-20 w-full h-full">
             {game.component}
           </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

const GamesSection = () => {
  return (
    <section id="arcade" className="relative z-10 w-full bg-[#000] border-t border-white/10 overflow-hidden">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '100px 100px', backgroundPosition: 'center center' }}></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#000] via-transparent to-[#000]"></div>

      <div className="w-full text-center pt-24 md:pt-40 pb-10 relative z-10">
        <h2 className="text-4xl md:text-6xl font-sans font-light uppercase leading-[0.9]">
          MEMBER<br/>
          PROJECTS
        </h2>
        <p className="text-gray-500 font-mono tracking-[0.3em] uppercase text-xs md:text-sm mt-6">
          // Scroll_to_view_showcase
        </p>
      </div>

      <div className="relative z-10">
        {GAMES.map((game, index) => (
          <GameBlock key={game.id} game={game} index={index} />
        ))}
      </div>
    </section>
  );
};

export default GamesSection;
