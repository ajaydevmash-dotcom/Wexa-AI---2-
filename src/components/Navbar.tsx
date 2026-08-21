import React from 'react';
import { 
  BarChart3, 
  Layers, 
  Play, 
  Cpu, 
  Terminal, 
  BookOpen, 
  Download, 
  Database,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExportModal: () => void;
  onOpenLiveRunner: () => void;
  isConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
  onOpenLiveRunner,
  isConnected
}) => {
  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Layers },
    { id: 'metrics', label: 'Metrics Matrix', icon: BarChart3 },
    { id: 'charts', label: 'Visual Benchmarks', icon: Cpu },
    { id: 'deep-dive', label: 'Architectural Analysis', icon: Database },
    { id: 'terminal', label: 'Cypher Terminal', icon: Terminal },
    { id: 'article', label: 'Evangelism Article', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Target Instance */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 font-mono text-lg font-bold text-white shadow-sm shadow-teal-500/20">
            <span className="tracking-tighter">C⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                CognoDB Cloud
              </span>
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                Wexa AI Benchmark
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-mono text-[11px]">db-5ab0a156</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                0.5 vCPU / 512MB
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right CTA Group */}
        <div className="flex items-center gap-2">
          <button
            id="btn-live-runner"
            onClick={onOpenLiveRunner}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Live Benchmark</span>
          </button>

          <button
            id="btn-export-repo"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Export Submission</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Nav */}
      <div className="flex lg:hidden overflow-x-auto border-t border-zinc-200 px-4 py-2 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 gap-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
