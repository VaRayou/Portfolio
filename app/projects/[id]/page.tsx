import Image from "next/image";
import { ExternalLink, Code, Layers, Sparkles } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import BackButton from "./BackButton";
import ProjectImageViewer from "@/components/ProjectImageViewer";
import portfolioData from "@/data/portfolio.json";
import { notFound } from "next/navigation";

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = portfolioData.projects.find((p) => p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

  // Use project's keyFeatures if available, otherwise fallback to defaults
  const keyFeatures = project.keyFeatures && project.keyFeatures.length > 0
    ? project.keyFeatures
    : [
        "Website full animasi",
        "Keren dan elegant",
        "Fitur lengkap",
        "Fully responsive design"
      ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 md:pt-24 pb-20 md:pb-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Back Button */}
        <BackButton projectId={project.id} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20">
          
          {/* Left Column (Info) */}
          <div className="lg:col-span-5 flex flex-col space-y-8 md:space-y-12">
            
            {/* Title & Description */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 md:mb-6 pb-4 md:pb-6 border-b border-white/10">
                {project.title}
              </h1>
              <p className="text-white/50 leading-relaxed text-sm md:text-base">
                {project.description}
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                <div className="p-3 bg-white/5 rounded-xl"><Code className="w-5 h-5 text-white/40" /></div>
                <div>
                  <div className="text-lg font-heading font-bold">{project.technologies.length}</div>
                  <div className="text-xs text-white/40">Technologies Used</div>
                </div>
              </div>
              <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                <div className="p-3 bg-white/5 rounded-xl"><Layers className="w-5 h-5 text-white/40" /></div>
                <div>
                  <div className="text-lg font-heading font-bold">{keyFeatures.length}</div>
                  <div className="text-xs text-white/40">Key Features</div>
                </div>
              </div>
            </div>
            
            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {project.liveDemo ? (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all text-xs shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              ) : (
                <button disabled className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-white/10 bg-[#0f0f0f] text-white/30 text-xs font-mono cursor-not-allowed">
                  <ExternalLink className="w-4 h-4" />
                  <span>No Demo Link</span>
                </button>
              )}

              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-white/10 bg-[#0f0f0f] hover:bg-white/10 text-white/80 hover:text-white transition-all text-xs font-mono"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              ) : (
                <button disabled className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-white/10 bg-[#0f0f0f] text-white/30 text-xs font-mono cursor-not-allowed">
                  <GithubIcon className="w-4 h-4" />
                  <span>No Code Link</span>
                </button>
              )}
            </div>
            
            {/* Tech Stack */}
            <div>
              <h3 className="flex items-center space-x-2 text-sm font-bold text-white mb-4">
                <Code className="w-4 h-4" />
                <span>Technologies Used</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tag, i) => (
                  <div key={i} className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0f0f0f] border border-white/5">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
                    <span className="text-xs font-mono text-white/60">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
          
          {/* Right Column (Visuals) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Large Preview Viewer (Uncropped, Full original artwork) */}
            <ProjectImageViewer src={project.image} title={project.title} />
            
            {/* Key Features List */}
            
            {/* Key Features List */}
            <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8">
              <h3 className="flex items-center space-x-2 text-lg font-bold text-white mb-6">
                <Sparkles className="w-5 h-5 text-white/60" />
                <span>Key Features</span>
              </h3>
              <ul className="space-y-4">
                {keyFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3 text-white/50 text-sm">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full mt-1.5 shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
