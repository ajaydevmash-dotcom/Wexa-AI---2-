import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Layers, 
  HardDrive, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Code2,
  GitBranch
} from 'lucide-react';

export const ArchitecturalDeepDive: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState<string>('cognodb');

  const architectures = [
    {
      id: 'cognodb',
      name: 'CognoDB Cloud',
      archetype: 'Zero-Copy Memory-Mapped Graph',
      language: 'Rust / C++ Core',
      memoryModel: 'Sparse Adjacency Chunks + OS mmap',
      pointerChasing: 'Native Offset Pointer Dereferencing',
      writeModel: 'Append-Only Log + Zero-Lock Page Swapping',
      summary: 'Optimized specifically for cloud-native density and low-memory environments (256MB–1GB). Avoids JVM garbage collection entirely while paging cold attributes to disk seamlessly.',
      whyFaster: [
        'Direct memory layout prevents JVM heap overhead and GC jitter under concurrency sweeps.',
        'Zero-copy deserialization over Neo4j Bolt protocol allows immediate execution of Cypher ASTs.',
        'Extremely compact node/relationship index table occupies only 128MB for 120,000 edges.'
      ],
      whySlowerInSpecificCases: [
        'Burstable CPU sharing in cloud free tier means long continuous 100% CPU loads (>3 min) experience slight throttling.'
      ]
    },
    {
      id: 'neo4j',
      name: 'Neo4j AuraDB Free',
      archetype: 'Classic Native Graph on JVM',
      language: 'Java / JVM',
      memoryModel: 'JVM Heap + Off-Heap Page Cache',
      pointerChasing: 'Double-Linked Record IDs (15-byte fixed size records)',
      writeModel: 'Write-Ahead Log (WAL) + Checkpointing',
      summary: 'The reference standard for property graphs. Uses fixed-size records on disk to achieve index-free adjacency, but carries significant memory overhead in small-tier cloud instances.',
      whyFaster: [
        'Highly mature, cost-based Cypher query planner with multi-index intersection optimization.',
        'Established parallel runtime on high-vCPU nodes.'
      ],
      whySlowerInSpecificCases: [
        'JVM object header overhead and garbage collector mark-and-sweep pauses spike p95 latencies under 40-client concurrency in 512MB RAM.',
        'Allocates ~384MB of the 512MB RAM quota just for baseline runtime, leaving small headroom for query buffers.'
      ]
    },
    {
      id: 'memgraph',
      name: 'Memgraph Community',
      archetype: 'Pure In-Memory Native C++',
      language: 'C++17 / C++20',
      memoryModel: 'Direct Virtual Memory Allocator (jemalloc)',
      pointerChasing: 'Direct Raw 64-bit Memory Pointers',
      writeModel: 'In-Memory Delta + Periodic Snapshotting',
      summary: 'Engineered for extreme single-node low latency by guaranteeing that all nodes, relationships, and indices reside permanently in RAM without page-fault overhead.',
      whyFaster: [
        'Raw C++ pointer chasing eliminates page translation and disk I/O completely.',
        'Lock-free data structures deliver highest raw 1-hop and 2-hop traversal throughput.'
      ],
      whySlowerInSpecificCases: [
        'Strict RAM capacity limit: In a 512MB free tier, graphs exceeding ~350k edges cause instantaneous OOM container kills.',
        'No automatic cold storage offloading for stale node properties.'
      ]
    },
    {
      id: 'falkordb',
      name: 'FalkorDB (RedisGraph Successor)',
      archetype: 'GraphBLAS Linear Algebra Sparse Matrices',
      language: 'C (SuiteSparse)',
      memoryModel: 'Compressed Sparse Row / Column (CSR/CSC)',
      pointerChasing: 'Matrix-Vector Multiplications (SIMD/BLAS)',
      writeModel: 'Redis Append-Only File (AOF)',
      summary: 'Treats graph traversals as sparse linear algebra operations. A 2-hop traversal is computed via sparse matrix multiplication (A × A), making bulk multi-hop batch traversal exceptionally fast.',
      whyFaster: [
        '2-hop and 3-hop breadth-first searches leverage optimized BLAS vectorization across CPU SIMD lanes.',
        'Compact CSR matrices consume very little memory for edge topologies.'
      ],
      whySlowerInSpecificCases: [
        'Single incremental edge mutations require rebuilding or modifying sparse matrix chunks, creating higher write latency.',
        'Complex non-uniform node filters require hybrid fallback out of BLAS.'
      ]
    },
    {
      id: 'arangodb',
      name: 'ArangoDB / Kùzu Multi-Model',
      archetype: 'Multi-Model Document + Edge Index on RocksDB',
      language: 'C++',
      memoryModel: 'RocksDB Block Cache + Buffer Pool',
      pointerChasing: 'Secondary Edge Index Lookup in Key-Value Range',
      writeModel: 'LSM-Tree Write Ahead Log',
      summary: 'Stores nodes as JSON-like documents and edges as documents with _from and _to attributes indexed in RocksDB. Offers versatile multi-model queries but lacks true index-free adjacency.',
      whyFaster: [
        'Flexible document schemas with full-text search, geo-indexing, and graph querying in a unified API.',
        'Resilient LSM-Tree storage scales easily past memory limits to large disk sizes.'
      ],
      whySlowerInSpecificCases: [
        'Each traversal hop requires binary search lookups inside RocksDB edge index SSTables rather than following direct memory pointers.',
        '3-hop traversals suffer a 2× to 3× latency penalty relative to native graph engines.'
      ]
    }
  ];

  const current = architectures.find(a => a.id === selectedEngine) || architectures[0];

  return (
    <div className="space-y-8">
      
      {/* Title & Architectural Overview */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          Architectural Root-Cause Analysis
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-4xl leading-relaxed">
          Why do these 5 graph engines perform differently under the same 0.5 vCPU and 512MB RAM resource ceiling? 
          Understanding the fundamental trade-offs between <span className="font-semibold text-zinc-800 dark:text-zinc-200">Index-Free Adjacency (Pointer Chasing)</span>, 
          <span className="font-semibold text-zinc-800 dark:text-zinc-200"> Linear Algebra (GraphBLAS)</span>, 
          <span className="font-semibold text-zinc-800 dark:text-zinc-200"> Zero-Copy Memory Mapping</span>, and 
          <span className="font-semibold text-zinc-800 dark:text-zinc-200"> LSM Key-Value Multi-Model Storage</span>.
        </p>

        {/* Engine Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800 pb-3">
          {architectures.map((arch) => (
            <button
              key={arch.id}
              onClick={() => setSelectedEngine(arch.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                selectedEngine === arch.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>{arch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Engine Deep Dive Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{current.name}</h3>
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-mono font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                {current.archetype}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{current.summary}</p>
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-[11px] font-medium text-zinc-500">Core Runtime Language</div>
            <div className="mt-1 text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">{current.language}</div>
          </div>
          <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-[11px] font-medium text-zinc-500">Memory & Cache Model</div>
            <div className="mt-1 text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">{current.memoryModel}</div>
          </div>
          <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-[11px] font-medium text-zinc-500">Traversal Mechanism</div>
            <div className="mt-1 text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">{current.pointerChasing}</div>
          </div>
          <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="text-[11px] font-medium text-zinc-500">Durability & Write Model</div>
            <div className="mt-1 text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">{current.writeModel}</div>
          </div>
        </div>

        {/* Why it Excels vs Bottlenecks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Strengths */}
          <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="h-4 w-4" />
              <span>Architectural Advantages Under Constrained Hardware</span>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              {current.whyFaster.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade-offs / Bottlenecks */}
          <div className="rounded-lg border border-amber-200/60 bg-amber-50/30 p-4 dark:border-amber-950 dark:bg-amber-950/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="h-4 w-4" />
              <span>Observed Caveats & Trade-Off Boundaries</span>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              {current.whySlowerInSpecificCases.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Comparison Matrix of Graph Paradigms */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
          <GitBranch className="h-4 w-4 text-teal-600" />
          <span>Core Graph Paradigm Comparison</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
              <tr>
                <th className="py-2.5 px-3">Storage Paradigm</th>
                <th className="py-2.5 px-3">Representative Engines</th>
                <th className="py-2.5 px-3">Traversal Complexity</th>
                <th className="py-2.5 px-3">Memory Footprint</th>
                <th className="py-2.5 px-3">Cloud 512MB Suitability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">Zero-Copy Mmap Native</td>
                <td className="py-2.5 px-3">CognoDB Cloud</td>
                <td className="py-2.5 px-3 font-mono">O(k) Direct Offset Pointers</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600">Very Low (~128MB)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-semibold">Optimal (Built for density)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">JVM Double-Linked Records</td>
                <td className="py-2.5 px-3">Neo4j AuraDB</td>
                <td className="py-2.5 px-3 font-mono">O(k) Double Linked List Chasing</td>
                <td className="py-2.5 px-3 text-amber-600">High (~384MB+ JVM heap)</td>
                <td className="py-2.5 px-3 text-amber-600">Fragile (GC pauses under load)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">Pure In-Memory C++</td>
                <td className="py-2.5 px-3">Memgraph</td>
                <td className="py-2.5 px-3 font-mono">O(k) Raw Memory Address</td>
                <td className="py-2.5 px-3 text-amber-600">Medium-High (100% in RAM)</td>
                <td className="py-2.5 px-3 text-amber-600">Risk of OOM at scale</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">GraphBLAS Sparse Matrix</td>
                <td className="py-2.5 px-3">FalkorDB</td>
                <td className="py-2.5 px-3 font-mono">O(nnz) Matrix Multiplications</td>
                <td className="py-2.5 px-3 text-emerald-600">Low (~150MB CSR)</td>
                <td className="py-2.5 px-3 text-emerald-600">Good for batch traversals</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">LSM-Tree Multi-Model</td>
                <td className="py-2.5 px-3">ArangoDB (RocksDB)</td>
                <td className="py-2.5 px-3 font-mono">O(k · log N) B-Tree/Index Lookup</td>
                <td className="py-2.5 px-3">Medium (~300MB Block Cache)</td>
                <td className="py-2.5 px-3 text-zinc-500">Acceptable, higher latency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
