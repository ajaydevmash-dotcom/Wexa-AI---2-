import React from 'react';
import { DatabaseBenchmarkResult } from '../types';
import { 
  ShieldCheck, 
  Zap, 
  Layers, 
  TrendingUp, 
  HardDrive, 
  Cpu, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2,
  Server,
  Gauge
} from 'lucide-react';

interface OverviewScorecardProps {
  results: Record<string, DatabaseBenchmarkResult>;
  onSelectDatabase: (dbId: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const OverviewScorecard: React.FC<OverviewScorecardProps> = ({
  results,
  onSelectDatabase,
  onNavigateToTab
}) => {
  const dbs: DatabaseBenchmarkResult[] = Object.values(results);
  const cogno = results['cognodb'];

  return (
    <div className="space-y-8">
      {/* Header Hero Banner */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Rigorous 5-Way Fair Hardware Benchmark</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              CognoDB Cloud vs. Modern Graph Engines
            </h1>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              An empirical evaluation of CognoDB Cloud against Neo4j AuraDB, Memgraph, FalkorDB, and ArangoDB on identical 
              <span className="font-semibold text-zinc-800 dark:text-zinc-200"> 0.5 vCPU / 256MB–512MB RAM </span> 
              resource constraints using a 120,000-relationship scale-free SNAP dataset.
            </p>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="px-3 py-1">
              <div className="text-[11px] font-medium text-zinc-500">Dataset Scale</div>
              <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">120,000</div>
              <div className="text-[10px] text-zinc-400">Relationships</div>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="px-3 py-1">
              <div className="text-[11px] font-medium text-zinc-500">Query Sample</div>
              <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">≥ 100</div>
              <div className="text-[10px] text-zinc-400">Rounds / metric</div>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="px-3 py-1">
              <div className="text-[11px] font-medium text-zinc-500">Hardware Ceiling</div>
              <div className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400">512 MB</div>
              <div className="text-[10px] text-zinc-400">0.5 vCPU burst</div>
            </div>
          </div>
        </div>

        {/* Methodology Checkpoints */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Hardware Parity:</span>
              <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">All engines capped strictly to 0.5 vCPU & 512MB RAM.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Standardized Driver:</span>
              <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">Tested via official Neo4j Bolt Protocol (v4.4/5.0).</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Percentile Precision:</span>
              <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">Reports p50 & p95 tail latencies, not just misleading averages.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Warm vs. Cold:</span>
              <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">Dedicated 20-run warm-up cycles preceding measurement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Findings & Category Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Memory Efficiency Leader */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Memory Efficiency Winner
            </span>
            <HardDrive className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
            CognoDB Cloud
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">128 MB</span>
            <span className="text-xs text-zinc-500">RAM for 120k graph</span>
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            CognoDB requires <span className="font-semibold text-emerald-600">66% less RAM</span> than Neo4j JVM (384MB) and 52% less than Memgraph (270MB), operating safely within constrained free tiers without OOM risks.
          </p>
        </div>

        {/* 2-Hop / 3-Hop Traversal Speed */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              Low-Latency Traversal
            </span>
            <Zap className="h-4 w-4 text-sky-600" />
          </div>
          <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
            CognoDB (1.42ms / 8.35ms)
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">1.42 ms</span>
            <span className="text-xs text-zinc-500">1-hop p50 latency</span>
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Delivers <span className="font-semibold text-sky-600">1.47× faster 1-hop</span> and 1.53× faster 2-hop traversal than Neo4j AuraDB Free, avoiding JVM GC jitter under concurrency.
          </p>
        </div>

        {/* Mixed Workload Throughput */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Concurrent Scalability
            </span>
            <Gauge className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
            4,180 QPS @ 40 Clients
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">0.0%</span>
            <span className="text-xs text-zinc-500">Error rate under max load</span>
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Sustains high multi-client concurrency with 0.0% transaction errors, whereas JVM-based AuraDB exhibited connection pool strain at 40 concurrent clients.
          </p>
        </div>

      </div>

      {/* Database Comparison Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Tested Graph Database Fleet
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              5 database architectures evaluated across data loading, traversals, lookups, aggregations, and footprint.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('metrics')}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
          >
            <span>View Full Metric Matrix</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-2">
          {dbs.map((db) => {
            const isCogno = db.dbId === 'cognodb';
            return (
              <div
                key={db.dbId}
                className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-150 ${
                  isCogno
                    ? 'border-teal-500 bg-teal-50/20 dark:border-teal-500/50 dark:bg-teal-950/20 ring-1 ring-teal-500/20'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isCogno 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}>
                      {db.specs.tier.includes('Free') ? 'Free Tier' : 'Resource-Capped'}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">{db.specs.version}</span>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {db.dbName}
                  </h4>
                  <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {db.specs.storageEngine}
                  </p>

                  <div className="mt-4 space-y-2 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">1-Hop (p50):</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{db.traversals[0].p50} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">2-Hop (p50):</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{db.traversals[1].p50} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">RAM Usage:</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{db.footprint.ramUsageFormatted.split('(')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Ingest Rate:</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{db.ingest.relationshipsPerSec.toLocaleString()} rel/s</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{db.strengths[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
