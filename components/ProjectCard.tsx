import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.article
      className="group relative min-h-[520px] overflow-hidden bg-black"
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0">
        {/* Local asset paths can be missing during development; the card still reads well without them. */}
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-45 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-65"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.96),rgba(0,0,0,0.45),rgba(0,0,0,0.1))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_34%)]" />
      </div>

      <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-6 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
          <ArrowUpRight className="h-5 w-5 text-white/40 transition group-hover:text-white" />
        </div>

        <div className="max-w-2xl">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
            BUILD: {project.id}
          </p>
          <h3 className="mb-5 text-3xl font-light uppercase tracking-widest text-white md:text-5xl">
            {project.title}
          </h3>
          <p className="max-w-xl font-mono text-sm leading-relaxed text-gray-400">
            {project.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
