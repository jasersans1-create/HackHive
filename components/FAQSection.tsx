import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "WHAT IS HACKHIVE?",
    answer: "HackHive is a local Hack Club group for students who want to make things with other people around. Code, hardware, games, design, random prototypes, all of it counts. The point is to stop waiting until you feel ready and just start building."
  },
  {
    question: "HOW DOES HACKATIME WORK?",
    answer: "Hackatime tracks real coding time from your editor. It is basically proof that you showed up and worked on your project. Those hours can help you get API credits, stickers, parts, keyboards, and bigger grants when you keep going."
  },
  {
    question: "IS AI CODE GENERATION ALLOWED?",
    answer: "Yes, use it when it helps. Just do not let it write the whole thing while you sit there. A good rule: you should still understand the code, fix the bugs, and be able to explain what changed."
  },
  {
    question: "DO I NEED TO BE AN EXPERT?",
    answer: "No. Please do not wait for that. You can show up with your first HTML file, a broken Arduino sketch, or a project folder named final-final-v3. We will meet you there."
  },
  {
    question: "HOW MUCH DOES IT COST?",
    answer: "Nothing. HackHive and Hack Club are free for teenagers. Bring curiosity, not money."
  }
];

const FAQSection = () => {
  // Keep the first answer open so the section does not feel empty on arrival.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 py-24 md:py-48 bg-[#000] border-t border-white/10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-16 md:mb-24">
          <div className="h-px w-12 bg-white/30" />
          <span className="font-mono text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase">NOTES // THINGS PEOPLE ASK</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-sans font-light tracking-widest uppercase mb-16 md:mb-24 text-white">
          QUESTIONS_<br />WE_GET
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
