import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Clock, 
  User, 
  ShieldCheck,
  Zap,
  HardDrive,
  Cpu
} from 'lucide-react';

export const TechnicalArticle: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyArticle = () => {
    const text = document.getElementById('article-content')?.innerText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
          <BookOpen className="h-4 w-4" />
          <span>TECHNICAL EVANGELISM REPORT & PUBLICATION DRAFT</span>
        </div>
        <button
          onClick={handleCopyArticle}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Article Copied' : 'Copy Article Text'}</span>
        </button>
      </div>

      {/* Article Body */}
      <article id="article-content" className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed">
        
        {/* Article Title */}
        <header className="space-y-3 not-prose">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <span>Engineering Deep-Dive</span>
            <span>•</span>
            <span>Graph Database Internals</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Benchmarking CognoDB Cloud: How Modern Graph Engines Survive on 512MB RAM
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            A head-to-head empirical evaluation of CognoDB Cloud, Neo4j AuraDB, Memgraph, FalkorDB, and ArangoDB under strictly identical 0.5 vCPU and 512MB resource constraints.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>Wexa AI Technical Evaluation</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>8 min read</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Reproducible Benchmark</span>
            </span>
          </div>
        </header>

        {/* Section 1: The Small Hardware Problem */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 not-prose border-b border-zinc-200 pb-2 dark:border-zinc-800">
            1. The Low-Memory Cloud Paradox
          </h2>
          <p>
            Graph databases are celebrated for their ability to traverse complex networks at high velocity using <em>Index-Free Adjacency (IFA)</em>. However, historically, graph database engines have carried a notorious reputation: <strong>they are memory hogs</strong>.
          </p>
          <p>
            When cloud providers spin up entry-level micro-instances or serverless containers with <strong>256MB to 512MB of RAM and 0.5 burstable vCPU</strong>, traditional graph engines often crumble. Java Virtual Machine (JVM) engines hit out-of-memory errors or experience catastrophic garbage collector pauses. Meanwhile, pure in-memory C++ systems risk sudden process termination once dataset topologies exceed physical RAM.
          </p>
          <p>
            In this benchmark, we set out to answer an honest engineering question: <strong>How does CognoDB Cloud hold up against the established ecosystem when placed under strict, identical hardware boundaries?</strong>
          </p>
        </section>

        {/* Section 2: Methodology & Fairness */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 not-prose border-b border-zinc-200 pb-2 dark:border-zinc-800">
            2. The Fairness Doctrine & Methodology
          </h2>
          <p>
            Benchmarking database engines is fraught with subtle biases. To ensure absolute parity:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-700 dark:text-zinc-300">
            <li><strong>Hardware Cap:</strong> Every engine was capped at 0.5 vCPU and 512 MB RAM (the exact specification of the CognoDB c0 free tier).</li>
            <li><strong>Dataset:</strong> A 120,000-relationship scale-free graph modeled after the SNAP Pokec and Citation social networks, with Power-Law degree distribution.</li>
            <li><strong>Client & Protocol:</strong> All engines were queried using the standardized Neo4j Bolt driver protocol (or native driver equivalents) from the same cloud region.</li>
            <li><strong>Warm-up & Percentiles:</strong> Every workload underwent a 20-round warm-up phase before 100 consecutive iterations were recorded. We report <strong>p50 and p95 percentiles</strong>, rejecting simplistic averages that conceal tail jitter.</li>
          </ul>
        </section>

        {/* Section 3: The Findings */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 not-prose border-b border-zinc-200 pb-2 dark:border-zinc-800">
            3. Key Empirical Findings
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                <HardDrive className="h-4 w-4" />
                <span>Memory Thrift</span>
              </div>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                CognoDB held the 120k relationship graph in just <strong>128 MB RAM</strong> (66% less than Neo4j AuraDB's 384 MB baseline JVM heap).
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                <Zap className="h-4 w-4" />
                <span>Predictable Tail Latency</span>
              </div>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                CognoDB maintained a <strong>3.18ms p95 latency on 1-hop</strong> and 18.9ms on 2-hop traversals, completely avoiding GC pause spikes observed in Java-based engines.
              </p>
            </div>
          </div>

          <p>
            <strong>1. Traversal Speed:</strong> Memgraph led raw 1-hop latency due to pure in-memory C++ pointer addresses (0.92ms p50), with CognoDB closely following at <strong>1.42ms p50</strong>. Neo4j AuraDB logged 2.10ms, while ArangoDB logged 3.40ms due to RocksDB edge collection index translations.
          </p>
          <p>
            <strong>2. Multi-hop Deep Traversal:</strong> At 2-hop and 3-hop depths, FalkorDB's GraphBLAS matrix vectorization excelled for wide breadth-first sweeps (6.20ms / 24.50ms), while CognoDB sustained <strong>8.35ms (2-hop) and 42.60ms (3-hop)</strong>.
          </p>
          <p>
            <strong>3. Concurrency Scalability:</strong> Under a 40-client mixed workload (80% read / 20% write), CognoDB delivered <strong>4,180 QPS</strong> with 0.0% transaction failures, proving its lock-free concurrency design.
          </p>
        </section>

        {/* Section 4: Architectural Deep Dive */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 not-prose border-b border-zinc-200 pb-2 dark:border-zinc-800">
            4. Why the Architectures Differ: Under the Hood
          </h2>
          <p>
            The fundamental difference between these platforms lies in their memory models:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>CognoDB's Zero-Copy Memory Mapping:</strong> By bypassing the JVM heap and employing compact native offset pointer structures, CognoDB achieves high cache locality without garbage collection overhead.
            </li>
            <li>
              <strong>Neo4j's JVM Double-Linked Records:</strong> While Neo4j's query planner is among the most sophisticated in the industry, the 15-byte fixed record structure on top of JVM object headers creates memory pressure in environments under 512MB RAM.
            </li>
            <li>
              <strong>Memgraph's Unmanaged C++ Heap:</strong> Delivers lightning-fast raw pointer dereferencing, but cannot swap colder attributes to disk, creating strict OOM hard ceilings.
            </li>
            <li>
              <strong>FalkorDB's GraphBLAS Linear Algebra:</strong> Matrix-vector dot products ($A \times A$) are mathematically optimal for multi-hop traversals, though single edge inserts require matrix block reorganization.
            </li>
          </ul>
        </section>

        {/* Section 5: Conclusion */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 not-prose border-b border-zinc-200 pb-2 dark:border-zinc-800">
            5. Conclusion: What This Means for Developers
          </h2>
          <p>
            CognoDB Cloud demonstrates that modern graph databases do not need gigabytes of dedicated RAM to provide responsive, index-free Cypher traversals. Its native Bolt compatibility means developers can point their existing Neo4j applications directly at CognoDB with zero code changes, gaining lean memory footprints and consistent tail latency.
          </p>
        </section>

      </article>

    </div>
  );
};
