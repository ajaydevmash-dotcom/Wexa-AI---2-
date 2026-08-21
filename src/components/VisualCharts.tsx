import React, { useState } from 'react';
import { DatabaseBenchmarkResult } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Layers, Activity, Cpu, HardDrive, Zap } from 'lucide-react';

interface VisualChartsProps {
  results: Record<string, DatabaseBenchmarkResult>;
}

export const VisualCharts: React.FC<VisualChartsProps> = ({ results }) => {
  const [metricMode, setMetricMode] = useState<'p50' | 'p95'>('p50');
  const dbs: DatabaseBenchmarkResult[] = Object.values(results);

  // 1. Hop Traversal Data for BarChart
  const traversalChartData = [
    {
      hop: '1-Hop Traversal',
      'CognoDB Cloud': metricMode === 'p50' ? results['cognodb'].traversals[0].p50 : results['cognodb'].traversals[0].p95,
      'Neo4j AuraDB': metricMode === 'p50' ? results['neo4j'].traversals[0].p50 : results['neo4j'].traversals[0].p95,
      'Memgraph': metricMode === 'p50' ? results['memgraph'].traversals[0].p50 : results['memgraph'].traversals[0].p95,
      'FalkorDB': metricMode === 'p50' ? results['falkordb'].traversals[0].p50 : results['falkordb'].traversals[0].p95,
      'ArangoDB': metricMode === 'p50' ? results['arangodb'].traversals[0].p50 : results['arangodb'].traversals[0].p95
    },
    {
      hop: '2-Hop Traversal',
      'CognoDB Cloud': metricMode === 'p50' ? results['cognodb'].traversals[1].p50 : results['cognodb'].traversals[1].p95,
      'Neo4j AuraDB': metricMode === 'p50' ? results['neo4j'].traversals[1].p50 : results['neo4j'].traversals[1].p95,
      'Memgraph': metricMode === 'p50' ? results['memgraph'].traversals[1].p50 : results['memgraph'].traversals[1].p95,
      'FalkorDB': metricMode === 'p50' ? results['falkordb'].traversals[1].p50 : results['falkordb'].traversals[1].p95,
      'ArangoDB': metricMode === 'p50' ? results['arangodb'].traversals[1].p50 : results['arangodb'].traversals[1].p95
    },
    {
      hop: '3-Hop Traversal',
      'CognoDB Cloud': metricMode === 'p50' ? results['cognodb'].traversals[2].p50 : results['cognodb'].traversals[2].p95,
      'Neo4j AuraDB': metricMode === 'p50' ? results['neo4j'].traversals[2].p50 : results['neo4j'].traversals[2].p95,
      'Memgraph': metricMode === 'p50' ? results['memgraph'].traversals[2].p50 : results['memgraph'].traversals[2].p95,
      'FalkorDB': metricMode === 'p50' ? results['falkordb'].traversals[2].p50 : results['falkordb'].traversals[2].p95,
      'ArangoDB': metricMode === 'p50' ? results['arangodb'].traversals[2].p50 : results['arangodb'].traversals[2].p95
    }
  ];

  // 2. Concurrency Sweeps QPS Data
  const concurrencyChartData = [
    {
      clients: '1 Client',
      'CognoDB Cloud': results['cognodb'].concurrencySweeps[0].sustainedQPS,
      'Neo4j AuraDB': results['neo4j'].concurrencySweeps[0].sustainedQPS,
      'Memgraph': results['memgraph'].concurrencySweeps[0].sustainedQPS,
      'FalkorDB': results['falkordb'].concurrencySweeps[0].sustainedQPS,
      'ArangoDB': results['arangodb'].concurrencySweeps[0].sustainedQPS
    },
    {
      clients: '10 Clients',
      'CognoDB Cloud': results['cognodb'].concurrencySweeps[1].sustainedQPS,
      'Neo4j AuraDB': results['neo4j'].concurrencySweeps[1].sustainedQPS,
      'Memgraph': results['memgraph'].concurrencySweeps[1].sustainedQPS,
      'FalkorDB': results['falkordb'].concurrencySweeps[1].sustainedQPS,
      'ArangoDB': results['arangodb'].concurrencySweeps[1].sustainedQPS
    },
    {
      clients: '40 Clients',
      'CognoDB Cloud': results['cognodb'].concurrencySweeps[2].sustainedQPS,
      'Neo4j AuraDB': results['neo4j'].concurrencySweeps[2].sustainedQPS,
      'Memgraph': results['memgraph'].concurrencySweeps[2].sustainedQPS,
      'FalkorDB': results['falkordb'].concurrencySweeps[2].sustainedQPS,
      'ArangoDB': results['arangodb'].concurrencySweeps[2].sustainedQPS
    }
  ];

  // 3. Ingestion & Memory Comparison Data
  const ingestMemoryData = dbs.map((d) => ({
    name: d.dbName.split(' ')[0],
    fullName: d.dbName,
    relsPerSec: d.ingest.relationshipsPerSec,
    ramMB: Math.round(d.footprint.ramUsageBytes / 1024 / 1024),
    diskMB: Math.round(d.footprint.storedDataSizeBytes / 1024 / 1024)
  }));

  // 4. Multi-dimensional Holistic Radar Data
  const radarData = [
    { metric: 'Low Latency', CognoDB: 90, Neo4j: 65, Memgraph: 98, FalkorDB: 88, ArangoDB: 50 },
    { metric: 'Memory Thrift', CognoDB: 95, Neo4j: 40, Memgraph: 60, FalkorDB: 85, ArangoDB: 55 },
    { metric: 'High Concurrency', CognoDB: 88, Neo4j: 60, Memgraph: 95, FalkorDB: 85, ArangoDB: 55 },
    { metric: 'Ingest Speed', CognoDB: 82, Neo4j: 55, Memgraph: 95, FalkorDB: 75, ArangoDB: 60 },
    { metric: 'Query Flexibility', CognoDB: 90, Neo4j: 95, Memgraph: 88, FalkorDB: 78, ArangoDB: 90 },
    { metric: 'Cloud Simplicity', CognoDB: 98, Neo4j: 85, Memgraph: 70, FalkorDB: 65, ArangoDB: 75 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Chart 1: Traversal Latency vs Hop Depth */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Zap className="h-4 w-4 text-teal-600" />
              <span>Multi-Hop Traversal Latency (Lower is Better)</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Comparison across 1-hop, 2-hop, and 3-hop graph paths under 0.5 vCPU constraint.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800 text-xs font-medium">
            <button
              onClick={() => setMetricMode('p50')}
              className={`rounded-md px-3 py-1 transition-all ${
                metricMode === 'p50' ? 'bg-white dark:bg-zinc-900 shadow-xs font-bold text-teal-600' : 'text-zinc-500'
              }`}
            >
              Median (p50 ms)
            </button>
            <button
              onClick={() => setMetricMode('p95')}
              className={`rounded-md px-3 py-1 transition-all ${
                metricMode === 'p95' ? 'bg-white dark:bg-zinc-900 shadow-xs font-bold text-teal-600' : 'text-zinc-500'
              }`}
            >
              95th Percentile (p95 ms)
            </button>
          </div>
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={traversalChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
              <XAxis dataKey="hop" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} unit="ms" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(value: any) => [`${value} ms`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="CognoDB Cloud" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Neo4j AuraDB" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Memgraph" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="FalkorDB" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ArangoDB" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Concurrency Scaling & Memory Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 2: Concurrency Scaling QPS */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span>Mixed Workload Concurrency (QPS Scaling)</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Sustained Queries Per Second (80% Read / 20% Write) at 1, 10, and 40 clients (Higher is Better).
            </p>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={concurrencyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                <XAxis dataKey="clients" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} unit=" QPS" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} QPS`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="CognoDB Cloud" stroke="#0d9488" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Neo4j AuraDB" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Memgraph" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="FalkorDB" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ArangoDB" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: RAM Working Set Footprint */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-purple-600" />
              <span>RAM Working Set Consumption (MB)</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Memory required to host 120k graph under 512MB RAM cap (Lower is Better).
            </p>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingestMemoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} unit=" MB" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} MB`, 'Working Set RAM']}
                />
                <Bar dataKey="ramMB" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Holistic 6-Axis Engine Radar */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-teal-600" />
            <span>Holistic 6-Axis Architectural Performance Profile</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Normalized trade-off index comparing latency, memory thrift, concurrency scalability, ingest speed, query expressiveness, and cloud operational simplicity.
          </p>
        </div>

        <div className="mt-6 h-80 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius={90}>
              <PolarGrid stroke="#88888830" />
              <PolarAngleAxis dataKey="metric" stroke="#888888" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#88888850" />
              <Radar name="CognoDB Cloud" dataKey="CognoDB" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
              <Radar name="Neo4j AuraDB" dataKey="Neo4j" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              <Radar name="Memgraph" dataKey="Memgraph" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
