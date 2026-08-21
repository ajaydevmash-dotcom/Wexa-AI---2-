# Empirical Graph Database Benchmark Report: CognoDB Cloud Evaluation

**Author**: Ajay Dev  
**Evaluation Target**: CognoDB Cloud (v0.9.11) vs. Neo4j AuraDB Free, Memgraph Community, FalkorDB, and ArangoDB  
**Hardware Budget**: Strictly capped at 0.5 vCPU and 512 MB RAM  
**Dataset**: 20,000 Nodes, 120,000 Relationships (Scale-Free SNAP Pokec / Citation Sample)  
**Date**: August 2026  

---

## 1. Methodology & Environmental Controls

### 1.1 Hardware and Platform Specifications

| Metric | CognoDB Cloud | Neo4j AuraDB | Memgraph | FalkorDB | ArangoDB |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Instance Type** | Free c0 Standalone | AuraDB Free | Docker Container | Docker Container | Oasis Free |
| **vCPU Limit** | 0.5 vCPU (burstable) | 0.5 vCPU share | 0.5 vCPU (cgroups) | 0.5 vCPU (cgroups) | 0.5 vCPU |
| **RAM Allocation** | 512 MB | 512 MB | 512 MB hard cap | 512 MB hard cap | 512 MB |
| **Storage Cap** | 1 GiB | 1 GiB | 1 GiB | 1 GiB | 1 GiB |
| **Cloud Region** | `us-east4` (N. Virginia) | `us-east-1` (N. Virginia) | `us-east4` | `us-east4` | `us-east4` |
| **Driver Protocol** | Neo4j Bolt v4.4+ | Neo4j Bolt v5.0 | Neo4j Bolt v4.4 | Neo4j Bolt / Redis | HTTP REST / AQL |

### 1.2 Measurement Rigor
- **Warm-Up Protocol**: 20 rounds of random traversal and indexed lookup operations were executed prior to metric capture to populate buffer caches.
- **Sample Size**: $\ge 100$ iterations for read queries, 50 iterations for multi-hop 3-hop traversals, and 40 iterations for whole-graph aggregations.
- **Statistical Metrics**: $p50$ (median), $p90$, $p95$, $p99$, $\text{mean}$, and standard deviation ($\sigma$).

---

## 2. In-Depth Metric Analysis

### 2.1 Ingestion Throughput & Loading Phase

```
Ingestion Throughput (Relationships / second):
Memgraph (In-Memory C++):      ██████████████████████ 13,407 rel/s
CognoDB Cloud (Zero-Copy mmap):█████████████ 8,097 rel/s
FalkorDB (GraphBLAS Matrices): ███████████ 6,593 rel/s
ArangoDB (RocksDB Documents):  ████████ 4,878 rel/s
Neo4j AuraDB (JVM Records):    ███████ 4,225 rel/s
```

- **Analysis**: Memgraph achieved the highest ingest rate due to direct C++ memory allocation without immediate disk commit. CognoDB Cloud achieved **8,097 rel/s**, outperforming Neo4j AuraDB by **1.91×** by utilizing zero-copy batch ingestion and avoiding JVM garbage collection during bulk transaction commits.

---

### 2.2 Traversal Latency Percentiles (Milliseconds)

| Engine | 1-Hop p50 | 1-Hop p95 | 2-Hop p50 | 2-Hop p95 | 3-Hop p50 | 3-Hop p95 | $\sigma$ (2-Hop) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CognoDB Cloud** | **1.42** | **3.18** | **8.35** | **18.90** | **42.60** | **98.40** | **$\pm 2.4\text{ms}$** |
| Neo4j AuraDB | 2.10 | 5.80 | 12.80 | 38.40 | 68.40 | 174.20 | $\pm 8.6\text{ms}$ |
| Memgraph | 0.92 | 1.85 | 5.40 | 11.20 | 28.90 | 64.20 | $\pm 1.2\text{ms}$ |
| FalkorDB | 1.85 | 4.10 | 6.20 | 13.40 | 24.50 | 52.80 | $\pm 1.8\text{ms}$ |
| ArangoDB | 3.40 | 7.90 | 18.90 | 46.20 | 84.20 | 210.00 | $\pm 9.4\text{ms}$ |

#### Architectural Cause of Traversal Differences:
1. **Neo4j AuraDB's High p95 Variance**: Under 512MB RAM, the JVM heap is restricted to ~384MB. Frequent minor garbage collections induce intermittent latency spikes (spiking 2-hop $p95$ to $38.4\text{ ms}$).
2. **CognoDB's Tight Percentile Distribution**: Zero-copy offset dereferencing yields a narrow standard deviation of only $\pm 2.4\text{ ms}$.
3. **FalkorDB's 3-Hop Advantage**: At depth 3, matrix multiplication $A^3$ benefits from SIMD parallelism, beating standard pointer chasing.

---

### 2.3 Mixed Workload Concurrency Sweeps (80% Read / 20% Write)

| Concurrency Level | **CognoDB Cloud** | Neo4j AuraDB | Memgraph | FalkorDB | ArangoDB |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1 Client QPS** | **482 QPS** | 320 QPS | 710 QPS | 440 QPS | 280 QPS |
| **10 Clients QPS** | **2,460 QPS** | 1,540 QPS | 3,820 QPS | 2,850 QPS | 1,320 QPS |
| **40 Clients QPS** | **4,180 QPS** | 2,380 QPS | 5,640 QPS | 4,620 QPS | 1,980 QPS |
| **40-Client Error Rate** | **0.0%** | 0.4% (Connection pool) | 0.0% | 0.0% | 0.6% |

---

### 2.4 Memory & Resource Footprint

| Database | Active RAM for 120k Graph | Disk Storage Overhead | Cold Start Latency |
| :--- | :--- | :--- | :--- |
| **CognoDB Cloud** | **128 MB** | **48.2 MB** | **1.2 s** |
| Neo4j AuraDB | 384 MB | 168.0 MB | 4.8 s (30s if paused) |
| Memgraph | 270 MB | 62.0 MB | 0.8 s |
| FalkorDB | 150 MB | 72.0 MB | 1.1 s |
| ArangoDB | 300 MB | 185.0 MB | 3.2 s |

---

## 3. Key Takeaways & Recommendations

1. **Best for Constrained Micro-Instances**: **CognoDB Cloud** offers the best balance of memory efficiency (128 MB) and query throughput without requiring memory over-provisioning.
2. **Best for Complex Analytical Batch Traversal**: **FalkorDB** due to GraphBLAS matrix vectorization.
3. **Best for Pure Single-Node Raw Speed**: **Memgraph**, provided RAM budget is unconstrained.
4. **Ecosystem Compatibility**: CognoDB Cloud's drop-in Neo4j Bolt driver support enables seamless migration from Neo4j without application refactoring.
