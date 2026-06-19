import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "WHAT IS HACKHIVE?",
    answer: "HackHive is an official Delhi-based node of Hack Club. We're a community of teenagers who code, build hardware, and create together. It's an IRL space to find co-founders, work on real projects, and level up your skills."
  },
  {
    question: "HOW DO I EARN A MACBOOK?",
    answer: "Through Hackatime, every hour you spend writing real code is tracked across your IDE. You can redeem these hours for API credits, custom stickers, mechanical keyboards, and eventually, a Macbook. The system verifies your keystrokes and commits to keep things fair."
  },
  {
    question: "IS AI CODE GENERATION ALLOWED?",
    answer: "Yes, but it's capped at 30%. The core philosophy here is to learn by doing. Generating all your code with AI tools like Copilot, Cursor, or ChatGPT will get flagged by the Hackatime system. Write real code, understand what you build, and use AI just as an assistant."
  },
  {
    question: "DO I NEED TO BE AN EXPERT?",
    answer: "Absolutely not. Whether you're writing your first HTML tag or compiling a custom Linux kernel, you belong here. Setup just takes a willingness to learn and twenty minutes a day to start tracking your progress."
  },
  {
    question: "HOW MUCH DOES IT COST?",
    answer: "Nothing. Everything at HackHive and Hack Club is 100% free for teenagers. Period."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 py-24 md:py-48 bg-[#000] border-t border-white/10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-16 md:mb-24">
          <div className="h-px w-12 bg-white/30" />
          <span className="font-mono text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase">SYSTEM.LOG_04 // QUERY_DATABASE</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-sans font-light tracking-widest uppercase mb-16 md:mb-24 text-white">
          FREQUENTLY_<br />ASKED_QUESTIONS
        </h2>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-6 md:px-8 md:py-8 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  data-hover="true"
                >
                  <span className="font-mono text-sm md:text-base tracking-widest text-white/90">
                    [ {String(index + 1).padStart(2, '0')} ] {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/50"
                  >
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 pt-2 font-sans font-light text-gray-400 text-sm md:text-base leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
