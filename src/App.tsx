import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewScorecard } from './components/OverviewScorecard';
import { MetricsMatrix } from './components/MetricsMatrix';
import { VisualCharts } from './components/VisualCharts';
import { LiveBenchmarkSuite } from './components/LiveBenchmarkSuite';
import { ArchitecturalDeepDive } from './components/ArchitecturalDeepDive';
import { CypherTerminal } from './components/CypherTerminal';
import { TechnicalArticle } from './components/TechnicalArticle';
import { ExportModal } from './components/ExportModal';
import { BENCHMARK_RESULTS } from './data/benchmark-data';
import { DatabaseBenchmarkResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [results, setResults] = useState<Record<string, DatabaseBenchmarkResult>>(BENCHMARK_RESULTS);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isLiveRunnerModalOpen, setIsLiveRunnerModalOpen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // Fetch latest benchmark results if backend is alive
  useEffect(() => {
    fetch('/api/benchmark/results')
      .then(res => res.json())
      .then(data => {
        if (data && data.results) {
          setResults(data.results);
        }
      })
      .catch(() => {
        // Fallback to bundled data
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenLiveRunner={() => setActiveTab('live-runner')}
        isConnected={isConnected}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <OverviewScorecard
            results={results}
            onSelectDatabase={() => setActiveTab('deep-dive')}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsMatrix results={results} />
        )}

        {activeTab === 'charts' && (
          <VisualCharts results={results} />
        )}

        {activeTab === 'live-runner' && (
          <LiveBenchmarkSuite onSuiteComplete={() => {}} />
        )}

        {activeTab === 'deep-dive' && (
          <ArchitecturalDeepDive />
        )}

        {activeTab === 'terminal' && (
          <CypherTerminal />
        )}

        {activeTab === 'article' && (
          <TechnicalArticle />
        )}

      </main>

      {/* Export Submission Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 text-xs text-zinc-500 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Wexa AI Take-Home Deliverable</span>
            <span>•</span>
            <span>CognoDB Cloud Benchmarking</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-teal-600 hover:underline dark:text-teal-400"
            >
              Export Submission Package
            </button>
            <span>•</span>
            <span className="font-mono text-[11px]">Hardware Cap: 0.5 vCPU / 512MB RAM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
