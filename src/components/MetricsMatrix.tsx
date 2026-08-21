import React, { useState } from 'react';
import { DatabaseBenchmarkResult } from '../types';
import { 
  BarChart3, 
  Download, 
  ArrowUpDown, 
  Check, 
  Layers, 
  Flame, 
  Snowflake,
  Info,
  ExternalLink
} from 'lucide-react';

interface MetricsMatrixProps {
  results: Record<string, DatabaseBenchmarkResult>;
}

export const MetricsMatrix: React.FC<MetricsMatrixProps> = ({ results }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showColdNumbers, setShowColdNumbers] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const dbs: DatabaseBenchmarkResult[] = Object.values(results);

  const categories = [
    { id: 'all', label: 'All 6 Metric Categories' },
    { id: 'ingest', label: '1. Data Loading' },
    { id: 'traversals', label: '2. Traversals (1/2/3-Hop)' },
    { id: 'lookups', label: '3. Point & Filter Lookups' },
    { id: 'aggregations', label: '4. Aggregations & Group-By' },
    { id: 'concurrency', label: '5. Mixed Concurrency (1/10/40)' },
    { id: 'footprint', label: '6. Memory & Footprint' }
  ];

  const handleCopyMarkdownTable = () => {
    let md = '# Full Graph Database Cloud Benchmark Results Matrix\n\n';
    md += 'Resource Ceiling: 0.5 vCPU / 512MB RAM | Dataset: SNAP Pokec & Citation (120,000 Relationships)\n\n';

    // Ingest table
    md += '## 1. Data Loading (Ingest Throughput)\n\n';
    md += '| Database | Wall-Clock Time (s) | Nodes / sec | Relationships / sec | Ingest Method |\n';
    md += '| :--- | :--- | :--- | :--- | :--- |\n';
    dbs.forEach(d => {
      md += `| ${d.dbName} | ${d.ingest.totalTimeSec}s | ${d.ingest.nodesPerSec.toLocaleString()} | ${d.ingest.relationshipsPerSec.toLocaleString()} | ${d.ingest.method} |\n`;
    });

    // Traversals table
    md += '\n## 2. Graph Traversals Latency (Warm vs Cold)\n\n';
    md += '| Database | 1-Hop p50 (ms) | 1-Hop p95 (ms) | 2-Hop p50 (ms) | 2-Hop p95 (ms) | 3-Hop p50 (ms) | 3-Hop p95 (ms) |\n';
    md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
    dbs.forEach(d => {
      md += `| ${d.dbName} | ${d.traversals[0].p50} | ${d.traversals[0].p95} | ${d.traversals[1].p50} | ${d.traversals[1].p95} | ${d.traversals[2].p50} | ${d.traversals[2].p95} |\n`;
    });

    // Concurrency table
    md += '\n## 3. Mixed Workload Concurrency Sweeps (80% Read / 20% Write)\n\n';
    md += '| Database | 1 Client QPS (p95 ms) | 10 Clients QPS (p95 ms) | 40 Clients QPS (p95 ms) | Error Rate |\n';
    md += '| :--- | :--- | :--- | :--- | :--- |\n';
    dbs.forEach(d => {
      const c1 = d.concurrencySweeps[0];
      const c10 = d.concurrencySweeps[1];
      const c40 = d.concurrencySweeps[2];
      md += `| ${d.dbName} | ${c1.sustainedQPS} (${c1.p95LatencyMs}ms) | ${c10.sustainedQPS} (${c10.p95LatencyMs}ms) | ${c40.sustainedQPS} (${c40.p95LatencyMs}ms) | ${c40.errorRatePercent}% |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedSection('markdown');
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === c.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setShowColdNumbers(!showColdNumbers)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors ${
              showColdNumbers
                ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {showColdNumbers ? (
              <>
                <Snowflake className="h-3.5 w-3.5 text-sky-600" />
                <span>Showing Cold Starts</span>
              </>
            ) : (
              <>
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>Showing Warm Cache</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyMarkdownTable}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-500 transition-colors shadow-xs"
          >
            {copiedSection === 'markdown' ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
            <span>{copiedSection === 'markdown' ? 'Copied Markdown' : 'Copy Table'}</span>
          </button>
        </div>

      </div>

      {/* 1. DATA LOADING TABLE */}
      {(activeCategory === 'all' || activeCategory === 'ingest') && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/75 px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-mono font-bold text-white">1</span>
                <span>Data Loading & Ingestion Throughput</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Bulk ingestion of 20,000 nodes and 120,000 relationships via parameterized batch UNWIND operations.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Batch Size: 1,000-5,000</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-100/50 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Database Platform</th>
                  <th className="py-3 px-4">Ingest Method</th>
                  <th className="py-3 px-4 text-right">Total Wall-Clock</th>
                  <th className="py-3 px-4 text-right">Nodes / sec</th>
                  <th className="py-3 px-4 text-right">Relationships / sec</th>
                  <th className="py-3 px-4 text-center">Batch Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {dbs.map((d) => {
                  const isCogno = d.dbId === 'cognodb';
                  return (
                    <tr key={d.dbId} className={isCogno ? 'bg-teal-50/30 dark:bg-teal-950/20 font-semibold' : ''}>
                      <td className="py-3 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {d.dbName}
                        {isCogno && <span className="rounded bg-teal-600 px-1.5 py-0.2 text-[9px] text-white">Target</span>}
                      </td>
                      <td className="py-3 px-4 font-sans text-zinc-600 dark:text-zinc-400 max-w-xs truncate">{d.ingest.method}</td>
                      <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100">{d.ingest.totalTimeSec}s</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{d.ingest.nodesPerSec.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-teal-600 dark:text-teal-400 font-bold">{d.ingest.relationshipsPerSec.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-zinc-500">{d.ingest.batchSize.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TRAVERSALS TABLE */}
      {(activeCategory === 'all' || activeCategory === 'traversals') && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/75 px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-mono font-bold text-white">2</span>
                <span>Graph Traversals (1-Hop, 2-Hop, 3-Hop Query Latency)</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Evaluated from randomly chosen starting nodes over ≥ 100 iterations. Showing {showColdNumbers ? 'Cold-Start' : 'Warm-Cache'} Percentiles.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Values in Milliseconds (ms)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-100/50 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Database Platform</th>
                  <th className="py-3 px-4 text-right">1-Hop p50</th>
                  <th className="py-3 px-4 text-right">1-Hop p95</th>
                  <th className="py-3 px-4 text-right">2-Hop p50</th>
                  <th className="py-3 px-4 text-right">2-Hop p95</th>
                  <th className="py-3 px-4 text-right">3-Hop p50</th>
                  <th className="py-3 px-4 text-right">3-Hop p95</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {dbs.map((d) => {
                  const isCogno = d.dbId === 'cognodb';
                  const t1 = d.traversals[0];
                  const t2 = d.traversals[1];
                  const t3 = d.traversals[2];

                  const val = (warm: number, cold?: number) => (showColdNumbers && cold ? `${cold.toFixed(2)}` : `${warm.toFixed(2)}`);

                  return (
                    <tr key={d.dbId} className={isCogno ? 'bg-teal-50/30 dark:bg-teal-950/20 font-semibold' : ''}>
                      <td className="py-3 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {d.dbName}
                        {isCogno && <span className="rounded bg-teal-600 px-1.5 py-0.2 text-[9px] text-white">Target</span>}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{val(t1.p50, t1.coldP50)} ms</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{val(t1.p95, t1.coldP95)} ms</td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{val(t2.p50, t2.coldP50)} ms</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{val(t2.p95, t2.coldP95)} ms</td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{val(t3.p50, t3.coldP50)} ms</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{val(t3.p95, t3.coldP95)} ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LOOKUPS TABLE */}
      {(activeCategory === 'all' || activeCategory === 'lookups') && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/75 px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-mono font-bold text-white">3</span>
                <span>Point Lookups & Indexed / Filtered Queries</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Testing primary node lookups by indexed property versus multi-property range filtering and non-indexed full scans.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Indexed Properties Documented</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-100/50 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Database Platform</th>
                  <th className="py-3 px-4">Configured Indexes</th>
                  <th className="py-3 px-4 text-right">Point ID Lookup (p50 / p95)</th>
                  <th className="py-3 px-4 text-right">Indexed Range Filter (p50 / p95)</th>
                  <th className="py-3 px-4 text-right">Non-Indexed Scan (p50 / p95)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {dbs.map((d) => {
                  const isCogno = d.dbId === 'cognodb';
                  const l1 = d.lookups[0];
                  const l2 = d.lookups[1];
                  const l3 = d.lookups[2];
                  return (
                    <tr key={d.dbId} className={isCogno ? 'bg-teal-50/30 dark:bg-teal-950/20 font-semibold' : ''}>
                      <td className="py-3 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">{d.dbName}</td>
                      <td className="py-3 px-4 font-sans text-zinc-600 dark:text-zinc-400 text-[11px]">{l1.indexedProperties.join(', ')}</td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{l1.p50} / {l1.p95} ms</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{l2.p50} / {l2.p95} ms</td>
                      <td className="py-3 px-4 text-right text-zinc-500">{l3.p50} / {l3.p95} ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. AGGREGATIONS & GROUP-BY TABLE */}
      {(activeCategory === 'all' || activeCategory === 'aggregations') && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/75 px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-mono font-bold text-white">4</span>
                <span>Aggregations & Group-By Workloads</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Computing whole-graph degree distribution histograms and grouped averages over multi-valued property lists.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Whole Graph Scan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-100/50 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Database Platform</th>
                  <th className="py-3 px-4">Degree Histogram Query</th>
                  <th className="py-3 px-4 text-right">Degree Dist (p50 / p95)</th>
                  <th className="py-3 px-4 text-right">Grouped Metric Avg (p50 / p95)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {dbs.map((d) => {
                  const isCogno = d.dbId === 'cognodb';
                  const a1 = d.aggregations[0];
                  const a2 = d.aggregations[1];
                  return (
                    <tr key={d.dbId} className={isCogno ? 'bg-teal-50/30 dark:bg-teal-950/20 font-semibold' : ''}>
                      <td className="py-3 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">{d.dbName}</td>
                      <td className="py-3 px-4 font-sans text-zinc-500 text-[11px] max-w-sm truncate">{a1.query}</td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{a1.p50} / {a1.p95} ms</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{a2.p50} / {a2.p95} ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MIXED WORKLOAD CONCURRENCY SWEEPS TABLE */}
      {(activeCategory === 'all' || activeCategory === 'concurrency') && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/75 px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-mono font-bold text-white">5</span>
                <span>Mixed Workload Concurrency Sweeps (1, 10, 40 Clients)</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                80% Read (2-hop traversals & lookups) / 20% Write (edge updates) sustained queries per second.
              </p>
            </div>
            <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">Concurrency Sweeps</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-100/50 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Database Platform</th>
                  <th className="py-3 px-4 text-right">1 Client (QPS / p95)</th>
                  <th className="py-3 px-4 text-right">10 Clients (QPS / p95)</th>
                  <th className="py-3 px-4 text-right">40 Clients (QPS / p95)</th>
                  <th className="py-3 px-4 text-center">40-Client Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {dbs.map((d) => {
                  const isCogno = d.dbId === 'cognodb';
                  const c1 = d.concurrencySweeps[0];
                  const c10 = d.concurrencySweeps[1];
                  const c40 = d.concurrencySweeps[2];
                  return (
                    <tr key={d.dbId} className={isCogno ? 'bg-teal-50/30 dark:bg-teal-950/20 font-semibold' : ''}>
                      <td className="py-3 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">{d.dbName}</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{c1.sustainedQPS.toLocaleString()} QPS <span className="text-zinc-400 text-[10px]">({c1.p95LatencyMs}ms)</span></td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">{c10.sustainedQPS.toLocaleString()} QPS <span className="text-zinc-400 text-[10px]">({c10.p95LatencyMs}ms)</span></td>
                      <td className="py-3 px-4 text-right text-teal-600 dark:text-teal-400 font-bold">{c40.sustainedQPS.toLocaleString()} QPS <span className="text-zinc-400 text-[10px]">({c40.p95LatencyMs}ms)</span></td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-semibold">{c40.errorRatePercent.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. RESOURCE FOOTPRINT TABLE */}
      {(activeCategory === 'all' || activeCategory === 'footprint') && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/75 px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-mono font-bold text-white">6</span>
                <span>Resource Usage & Footprint Where Observable</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Active RAM working set, stored graph size on disk, and cold start penalty in 512MB container environment.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Hard Cap: 512 MB</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-100/50 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Database Platform</th>
                  <th className="py-3 px-4">RAM Working Set</th>
                  <th className="py-3 px-4">Stored Disk Data</th>
                  <th className="py-3 px-4 text-right">Cold Start Penalty</th>
                  <th className="py-3 px-4">Observable Platform Fields</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {dbs.map((d) => {
                  const isCogno = d.dbId === 'cognodb';
                  const fp = d.footprint;
                  return (
                    <tr key={d.dbId} className={isCogno ? 'bg-teal-50/30 dark:bg-teal-950/20 font-semibold' : ''}>
                      <td className="py-3 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">{d.dbName}</td>
                      <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{fp.ramUsageFormatted}</td>
                      <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">{fp.diskUsageFormatted}</td>
                      <td className="py-3 px-4 text-right text-zinc-900 dark:text-zinc-100">{fp.coldStartSec}s</td>
                      <td className="py-3 px-4 font-sans text-zinc-500 text-[11px]">
                        {Object.entries(fp.observableFields).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
