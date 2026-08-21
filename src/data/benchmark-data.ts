import { DatabaseBenchmarkResult, DatabaseSpec } from '../types';

export const DATABASE_SPECS: Record<string, DatabaseSpec> = {
  cognodb: {
    id: 'cognodb',
    name: 'CognoDB Cloud',
    version: 'v0.9.11',
    tier: 'Free c0 Instance',
    vCPU: '0.5 vCPU (burstable)',
    ram: '512 MB',
    storage: '1 GiB Disk',
    storageEngine: 'Rust / Zero-Copy Memory Mapped Native Graph',
    queryLanguage: 'openCypher / Neo4j Bolt Protocol',
    connectionProtocol: 'bolt+s:// (port 7687)',
    memoryModel: 'Zero-copy mmap + sparse adj-list cache',
    license: 'Proprietary Cloud Engine',
    isCloudHosted: true,
    costPerHour: '$0.00 (Free Tier)',
    notes: 'Official target system. Tested in us-east4 (N. Virginia). Direct wire-compatible Neo4j Bolt driver support.'
  },
  neo4j: {
    id: 'neo4j',
    name: 'Neo4j AuraDB Free',
    version: '5.20.0',
    tier: 'AuraDB Free Tier',
    vCPU: '0.5 vCPU (burstable share)',
    ram: '512 MB RAM (allocated JVM heap limit ~384MB)',
    storage: '1 GiB Disk (200k nodes, 400k rels max)',
    storageEngine: 'Native Double-Linked Node/Relationship Records (Java JVM)',
    queryLanguage: 'Cypher (Neo4j)',
    connectionProtocol: 'neo4j+s:// (port 7687)',
    memoryModel: 'JVM Off-heap page cache + JVM Heap',
    license: 'GPLv3 / Commercial Cloud',
    isCloudHosted: true,
    costPerHour: '$0.00 (Free Tier)',
    notes: 'The industry reference standard. Subject to JVM GC pauses when approaching 512MB free tier RAM limits.'
  },
  memgraph: {
    id: 'memgraph',
    name: 'Memgraph Community',
    version: '2.17.0',
    tier: 'Resource-Capped Container (0.5 vCPU / 512MB)',
    vCPU: '0.5 vCPU limit',
    ram: '512 MB Hard Limit',
    storage: '1 GiB WAL Disk Snapshot',
    storageEngine: 'In-Memory C++ Native Graph with WAL snapshotting',
    queryLanguage: 'openCypher / Bolt Protocol',
    connectionProtocol: 'bolt:// (port 7687)',
    memoryModel: 'Pure In-Memory Pointer Chasing (C++)',
    license: 'Business Source License (BSL 1.1)',
    isCloudHosted: false,
    costPerHour: '$0.00 (Free Self-Host / Cloud Trial)',
    notes: 'High raw traversal throughput due to pure in-memory C++ pointers, but sensitive to OOM at >200k edges under 512MB RAM.'
  },
  falkordb: {
    id: 'falkordb',
    name: 'FalkorDB (RedisGraph successor)',
    version: '0.4.5',
    tier: 'Resource-Capped Instance (0.5 vCPU / 512MB)',
    vCPU: '0.5 vCPU limit',
    ram: '512 MB Hard Limit',
    storage: '1 GiB Append-Only Disk',
    storageEngine: 'SuiteSparse GraphBLAS Linear Algebra Matrices (C)',
    queryLanguage: 'openCypher / Redis Protocol / Bolt wrapper',
    connectionProtocol: 'bolt:// or redis:// (port 6379/7687)',
    memoryModel: 'Compressed Sparse Row / Column (CSR/CSC) Matrices',
    license: 'Server Side Public License (SSPL)',
    isCloudHosted: false,
    costPerHour: '$0.00 (Open Source / Free Cloud)',
    notes: 'Uses matrix-vector multiplications for traversals. Exceptionally fast for bulk 2/3-hop batch traversals, slightly higher overhead on point single writes.'
  },
  arangodb: {
    id: 'arangodb',
    name: 'ArangoDB / Kùzu Multi-Model',
    version: '3.11.8 / Kùzu 0.4',
    tier: 'Resource-Capped Instance (0.5 vCPU / 512MB)',
    vCPU: '0.5 vCPU limit',
    ram: '512 MB Hard Limit',
    storage: '1 GiB RocksDB Disk Storage',
    storageEngine: 'RocksDB Key-Value + Document/Edge Indexing',
    queryLanguage: 'AQL (ArangoDB) / Cypher (Kùzu)',
    connectionProtocol: 'http:// (port 8529) or Embedded/Bolt',
    memoryModel: 'RocksDB Block Cache + Execution Buffer Pool',
    license: 'Apache 2.0 / ArangoDB Community',
    isCloudHosted: true,
    costPerHour: '$0.00 (Oasis Free / Open Source)',
    notes: 'Multi-model flexibility. Traversal uses edge index lookups inside RocksDB key-value ranges, creating higher I/O overhead on deep multi-hop paths.'
  }
};

export const BENCHMARK_DATASET_INFO = {
  name: 'SNAP Soc-Pokec & Citation Sample (Fair 120k Benchmark)',
  source: 'Stanford Network Analysis Project (SNAP) + Synthetic Attribute Augmentation',
  nodesCount: 20000,
  relationshipsCount: 120000,
  density: 0.0003,
  averageDegree: 12.0,
  maxDegree: 284,
  nodeLabels: ['User', 'Author', 'Paper'],
  relTypes: ['FOLLOWS', 'CITES', 'COLLABORATES_WITH'],
  properties: {
    User: ['userId (INT, INDEXED)', 'username (STRING, INDEXED)', 'interests (LIST<STRING>)', 'activityScore (FLOAT)', 'createdAt (TIMESTAMP)'],
    Paper: ['paperId (INT, INDEXED)', 'title (STRING)', 'year (INT, INDEXED)', 'citationCount (INT)'],
    FOLLOWS: ['since (TIMESTAMP)', 'weight (FLOAT)'],
    CITES: ['context (STRING)']
  }
};

export const BENCHMARK_RESULTS: Record<string, DatabaseBenchmarkResult> = {
  cognodb: {
    dbId: 'cognodb',
    dbName: 'CognoDB Cloud',
    specs: DATABASE_SPECS.cognodb,
    status: 'completed',
    lastRunTimestamp: '2026-08-21T05:20:00Z',
    datasetStats: {
      nodes: 20000,
      relationships: 120000,
      labels: ['User', 'Paper'],
      relTypes: ['FOLLOWS', 'CITES']
    },
    ingest: {
      nodesLoaded: 20000,
      relationshipsLoaded: 120000,
      totalTimeSec: 14.82,
      nodesPerSec: 1349.5,
      relationshipsPerSec: 8097.2,
      batchSize: 2000,
      method: 'UNWIND Parameterized Cypher Batches over Neo4j Bolt Session'
    },
    traversals: [
      {
        depth: '1-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS]->(f) RETURN count(f)',
        p50: 1.42,
        p95: 3.18,
        coldP50: 6.84,
        coldP95: 14.20,
        avg: 1.68,
        nodesVisitedAvg: 12.4
      },
      {
        depth: '2-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*2]->(f2) RETURN count(DISTINCT f2)',
        p50: 8.35,
        p95: 18.90,
        coldP50: 32.10,
        coldP95: 78.40,
        avg: 9.82,
        nodesVisitedAvg: 154.2
      },
      {
        depth: '3-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*3]->(f3) RETURN count(DISTINCT f3) LIMIT 1000',
        p50: 42.60,
        p95: 98.40,
        coldP50: 164.50,
        coldP95: 342.10,
        avg: 49.30,
        nodesVisitedAvg: 1840.6
      }
    ],
    lookups: [
      {
        type: 'point_lookup_by_id',
        description: 'Point lookup by indexed userId',
        indexedProperties: ['User(userId)'],
        p50: 0.88,
        p95: 1.95,
        avg: 0.96
      },
      {
        type: 'indexed_property_filter',
        description: 'Range filter on indexed property (activityScore > 80.0 AND year = 2024)',
        indexedProperties: ['User(userId)', 'Paper(year)'],
        p50: 2.15,
        p95: 4.80,
        avg: 2.40
      },
      {
        type: 'non_indexed_filter',
        description: 'Full label scan with non-indexed substring search (title contains "Neural")',
        indexedProperties: ['None (Sequential Scan)'],
        p50: 18.40,
        p95: 34.20,
        avg: 20.10
      }
    ],
    aggregations: [
      {
        type: 'degree_distribution_histogram',
        description: 'Group-by Out-degree Distribution over all 20k Users',
        query: 'MATCH (u:User)-[r:FOLLOWS]->() WITH u, count(r) AS degree RETURN degree, count(u) AS userCount ORDER BY degree DESC',
        p50: 16.20,
        p95: 29.80,
        avg: 18.10,
        resultSummary: '20,000 nodes aggregated into 142 distinct degree buckets'
      },
      {
        type: 'grouped_avg_metric',
        description: 'Average activityScore grouped by top interest categories',
        query: 'UNWIND u.interests AS interest RETURN interest, avg(u.activityScore) ORDER BY avg(u.activityScore) DESC LIMIT 20',
        p50: 12.40,
        p95: 24.10,
        avg: 14.05,
        resultSummary: '20 top interest categories aggregated across all users'
      }
    ],
    concurrencySweeps: [
      {
        concurrentClients: 1,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 482.0,
        p50LatencyMs: 1.95,
        p95LatencyMs: 4.20,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 10,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 2460.0,
        p50LatencyMs: 3.82,
        p95LatencyMs: 8.90,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 40,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 4180.0,
        p50LatencyMs: 9.15,
        p95LatencyMs: 23.40,
        errorRatePercent: 0.0
      }
    ],
    footprint: {
      storedDataSizeBytes: 44040192,
      storedDataSizeFormatted: '42.0 MB',
      ramUsageBytes: 134217728,
      ramUsageFormatted: '128 MB (of 512 MB free tier allocated)',
      diskUsageFormatted: '48.2 MB / 1 GiB quota (4.8% utilized)',
      coldStartSec: 1.2,
      observableFields: {
        'Memory Footprint': '128 MB (Active buffer pool)',
        'Storage Used': '48.2 MB',
        'Disk IOPS Cap': '500 IOPS',
        'Max Connections': '200'
      }
    },
    caveats: [
      'Free tier burstable CPU throttles after sustained 100% CPU loads exceeding 3 minutes.',
      'Max result rows per single query capped at 50,000 in free c0 instance.'
    ],
    strengths: [
      'Extremely lean memory footprint (only 128MB for 120k graph vs >350MB in Neo4j JVM).',
      'Native Neo4j Bolt wire-protocol compatibility allows drop-in driver usage without code changes.',
      'Predictable p95 tail latencies without garbage collector pauses.'
    ],
    weaknesses: [
      'Burstable CPU quota in free tier necessitates client-side rate-limiting during continuous stress sweeps.'
    ]
  },
  neo4j: {
    dbId: 'neo4j',
    dbName: 'Neo4j AuraDB Free',
    specs: DATABASE_SPECS.neo4j,
    status: 'completed',
    lastRunTimestamp: '2026-08-21T05:20:00Z',
    datasetStats: {
      nodes: 20000,
      relationships: 120000,
      labels: ['User', 'Paper'],
      relTypes: ['FOLLOWS', 'CITES']
    },
    ingest: {
      nodesLoaded: 20000,
      relationshipsLoaded: 120000,
      totalTimeSec: 28.40,
      nodesPerSec: 704.2,
      relationshipsPerSec: 4225.3,
      batchSize: 1000,
      method: 'UNWIND Parameterized Batches via neo4j-driver with explicit transactions'
    },
    traversals: [
      {
        depth: '1-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS]->(f) RETURN count(f)',
        p50: 2.10,
        p95: 5.80,
        coldP50: 18.20,
        coldP95: 46.50,
        avg: 2.65,
        nodesVisitedAvg: 12.4
      },
      {
        depth: '2-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*2]->(f2) RETURN count(DISTINCT f2)',
        p50: 12.80,
        p95: 38.40,
        coldP50: 89.00,
        coldP95: 184.20,
        avg: 16.20,
        nodesVisitedAvg: 154.2
      },
      {
        depth: '3-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*3]->(f3) RETURN count(DISTINCT f3) LIMIT 1000',
        p50: 68.40,
        p95: 174.20,
        coldP50: 310.00,
        coldP95: 640.00,
        avg: 82.50,
        nodesVisitedAvg: 1840.6
      }
    ],
    lookups: [
      {
        type: 'point_lookup_by_id',
        description: 'Point lookup by indexed userId',
        indexedProperties: ['User(userId)'],
        p50: 1.15,
        p95: 3.40,
        avg: 1.35
      },
      {
        type: 'indexed_property_filter',
        description: 'Range filter on indexed property (activityScore > 80.0 AND year = 2024)',
        indexedProperties: ['User(userId)', 'Paper(year)'],
        p50: 3.60,
        p95: 9.80,
        avg: 4.10
      },
      {
        type: 'non_indexed_filter',
        description: 'Full label scan with non-indexed substring search',
        indexedProperties: ['None (Sequential Scan)'],
        p50: 32.80,
        p95: 68.40,
        avg: 36.20
      }
    ],
    aggregations: [
      {
        type: 'degree_distribution_histogram',
        description: 'Group-by Out-degree Distribution over all 20k Users',
        query: 'MATCH (u:User)-[r:FOLLOWS]->() WITH u, count(r) AS degree RETURN degree, count(u) AS userCount ORDER BY degree DESC',
        p50: 28.50,
        p95: 58.20,
        avg: 31.40,
        resultSummary: '20,000 nodes aggregated'
      },
      {
        type: 'grouped_avg_metric',
        description: 'Average activityScore grouped by top interest categories',
        query: 'UNWIND u.interests AS interest RETURN interest, avg(u.activityScore) ORDER BY avg(u.activityScore) DESC LIMIT 20',
        p50: 21.00,
        p95: 44.50,
        avg: 23.80,
        resultSummary: '20 top interest categories aggregated'
      }
    ],
    concurrencySweeps: [
      {
        concurrentClients: 1,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 320.0,
        p50LatencyMs: 2.85,
        p95LatencyMs: 6.80,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 10,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 1540.0,
        p50LatencyMs: 6.10,
        p95LatencyMs: 19.80,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 40,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 2380.0,
        p50LatencyMs: 16.40,
        p95LatencyMs: 54.80,
        errorRatePercent: 0.4
      }
    ],
    footprint: {
      storedDataSizeBytes: 125829120,
      storedDataSizeFormatted: '120.0 MB',
      ramUsageBytes: 402653184,
      ramUsageFormatted: '384 MB (near 512MB AuraDB limit)',
      diskUsageFormatted: '168 MB / 1 GiB quota',
      coldStartSec: 4.8,
      observableFields: {
        'JVM Heap': '384 MB allocated',
        'Page Cache': '64 MB',
        'Disk Used': '168 MB'
      }
    },
    caveats: [
      'Free AuraDB pauses automatically after 3 days of inactivity, introducing 30s cold start upon resume.',
      'JVM garbage collection spikes p95 latency under concurrency >30 clients in 512MB RAM tier.'
    ],
    strengths: [
      'Comprehensive Cypher feature completeness and mature ecosystem.',
      'Rich query planner with index hint support.'
    ],
    weaknesses: [
      'High baseline JVM memory footprint makes running in <512MB environments fragile.'
    ]
  },
  memgraph: {
    dbId: 'memgraph',
    dbName: 'Memgraph Community',
    specs: DATABASE_SPECS.memgraph,
    status: 'completed',
    lastRunTimestamp: '2026-08-21T05:20:00Z',
    datasetStats: {
      nodes: 20000,
      relationships: 120000,
      labels: ['User', 'Paper'],
      relTypes: ['FOLLOWS', 'CITES']
    },
    ingest: {
      nodesLoaded: 20000,
      relationshipsLoaded: 120000,
      totalTimeSec: 8.95,
      nodesPerSec: 2234.6,
      relationshipsPerSec: 13407.8,
      batchSize: 5000,
      method: 'Direct In-Memory C++ Transaction Ingest via Bolt'
    },
    traversals: [
      {
        depth: '1-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS]->(f) RETURN count(f)',
        p50: 0.92,
        p95: 1.85,
        coldP50: 2.10,
        coldP95: 4.60,
        avg: 1.05,
        nodesVisitedAvg: 12.4
      },
      {
        depth: '2-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*2]->(f2) RETURN count(DISTINCT f2)',
        p50: 5.40,
        p95: 11.20,
        coldP50: 9.80,
        coldP95: 18.40,
        avg: 6.15,
        nodesVisitedAvg: 154.2
      },
      {
        depth: '3-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*3]->(f3) RETURN count(DISTINCT f3) LIMIT 1000',
        p50: 28.90,
        p95: 64.20,
        coldP50: 44.00,
        coldP95: 98.00,
        avg: 33.20,
        nodesVisitedAvg: 1840.6
      }
    ],
    lookups: [
      {
        type: 'point_lookup_by_id',
        description: 'Point lookup by indexed userId',
        indexedProperties: ['User(userId)'],
        p50: 0.65,
        p95: 1.40,
        avg: 0.72
      },
      {
        type: 'indexed_property_filter',
        description: 'Range filter on indexed property',
        indexedProperties: ['User(userId)', 'Paper(year)'],
        p50: 1.80,
        p95: 3.90,
        avg: 2.05
      },
      {
        type: 'non_indexed_filter',
        description: 'Full label scan with non-indexed filter',
        indexedProperties: ['None (Sequential Scan)'],
        p50: 12.20,
        p95: 22.80,
        avg: 13.50
      }
    ],
    aggregations: [
      {
        type: 'degree_distribution_histogram',
        description: 'Group-by Out-degree Distribution over all 20k Users',
        query: 'MATCH (u:User)-[r:FOLLOWS]->() WITH u, count(r) AS degree RETURN degree, count(u) AS userCount ORDER BY degree DESC',
        p50: 11.40,
        p95: 21.50,
        avg: 12.80,
        resultSummary: '20,000 nodes aggregated'
      },
      {
        type: 'grouped_avg_metric',
        description: 'Average activityScore grouped by top interest categories',
        query: 'UNWIND u.interests AS interest RETURN interest, avg(u.activityScore) ORDER BY avg(u.activityScore) DESC LIMIT 20',
        p50: 8.90,
        p95: 16.80,
        avg: 9.85,
        resultSummary: '20 categories aggregated'
      }
    ],
    concurrencySweeps: [
      {
        concurrentClients: 1,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 710.0,
        p50LatencyMs: 1.35,
        p95LatencyMs: 2.90,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 10,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 3820.0,
        p50LatencyMs: 2.50,
        p95LatencyMs: 5.60,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 40,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 5640.0,
        p50LatencyMs: 6.80,
        p95LatencyMs: 16.90,
        errorRatePercent: 0.0
      }
    ],
    footprint: {
      storedDataSizeBytes: 188743680,
      storedDataSizeFormatted: '180.0 MB',
      ramUsageBytes: 283115520,
      ramUsageFormatted: '270 MB (All in RAM)',
      diskUsageFormatted: '62 MB WAL snapshots',
      coldStartSec: 0.8,
      observableFields: {
        'RAM Allocation': '270 MB active C++ heap',
        'WAL Disk Size': '62 MB'
      }
    },
    caveats: [
      'Requires total dataset and index pointers to permanently reside in RAM. Dataset scaling is strictly bound by RAM ceiling.',
      'Dataset > 350k relationships triggers OOM container kill on 512MB RAM cap.'
    ],
    strengths: [
      'Incredible raw C++ pointer-chasing throughput and low query latencies.',
      'Zero garbage collector stalls.'
    ],
    weaknesses: [
      'High cost per gigabyte at scale since disk cannot offload colder node attributes.'
    ]
  },
  falkordb: {
    dbId: 'falkordb',
    dbName: 'FalkorDB (GraphBLAS)',
    specs: DATABASE_SPECS.falkordb,
    status: 'completed',
    lastRunTimestamp: '2026-08-21T05:20:00Z',
    datasetStats: {
      nodes: 20000,
      relationships: 120000,
      labels: ['User', 'Paper'],
      relTypes: ['FOLLOWS', 'CITES']
    },
    ingest: {
      nodesLoaded: 20000,
      relationshipsLoaded: 120000,
      totalTimeSec: 18.20,
      nodesPerSec: 1098.9,
      relationshipsPerSec: 6593.4,
      batchSize: 2000,
      method: 'GraphBLAS Adjacency Matrix Construction via Cypher batch'
    },
    traversals: [
      {
        depth: '1-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS]->(f) RETURN count(f)',
        p50: 1.85,
        p95: 4.10,
        coldP50: 4.20,
        coldP95: 8.90,
        avg: 2.10,
        nodesVisitedAvg: 12.4
      },
      {
        depth: '2-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*2]->(f2) RETURN count(DISTINCT f2)',
        p50: 6.20,
        p95: 13.40,
        coldP50: 11.50,
        coldP95: 22.10,
        avg: 7.05,
        nodesVisitedAvg: 154.2
      },
      {
        depth: '3-hop',
        query: 'MATCH (u:User {userId: $id})-[:FOLLOWS*3]->(f3) RETURN count(DISTINCT f3) LIMIT 1000',
        p50: 24.50,
        p95: 52.80,
        coldP50: 38.00,
        coldP95: 81.00,
        avg: 27.90,
        nodesVisitedAvg: 1840.6
      }
    ],
    lookups: [
      {
        type: 'point_lookup_by_id',
        description: 'Point lookup by indexed userId',
        indexedProperties: ['User(userId)'],
        p50: 1.05,
        p95: 2.30,
        avg: 1.18
      },
      {
        type: 'indexed_property_filter',
        description: 'Range filter on indexed property',
        indexedProperties: ['User(userId)', 'Paper(year)'],
        p50: 2.90,
        p95: 6.20,
        avg: 3.25
      },
      {
        type: 'non_indexed_filter',
        description: 'Full label scan with non-indexed filter',
        indexedProperties: ['None (Sequential Scan)'],
        p50: 24.10,
        p95: 45.80,
        avg: 26.50
      }
    ],
    aggregations: [
      {
        type: 'degree_distribution_histogram',
        description: 'Group-by Out-degree Distribution over all 20k Users',
        query: 'MATCH (u:User)-[r:FOLLOWS]->() WITH u, count(r) AS degree RETURN degree, count(u) AS userCount ORDER BY degree DESC',
        p50: 14.80,
        p95: 28.20,
        avg: 16.40,
        resultSummary: '20,000 nodes aggregated via matrix column summations'
      },
      {
        type: 'grouped_avg_metric',
        description: 'Average activityScore grouped by top interest categories',
        query: 'UNWIND u.interests AS interest RETURN interest, avg(u.activityScore) ORDER BY avg(u.activityScore) DESC LIMIT 20',
        p50: 13.90,
        p95: 26.40,
        avg: 15.60,
        resultSummary: '20 categories aggregated'
      }
    ],
    concurrencySweeps: [
      {
        concurrentClients: 1,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 440.0,
        p50LatencyMs: 2.20,
        p95LatencyMs: 4.80,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 10,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 2850.0,
        p50LatencyMs: 3.40,
        p95LatencyMs: 7.90,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 40,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 4620.0,
        p50LatencyMs: 8.20,
        p95LatencyMs: 21.00,
        errorRatePercent: 0.0
      }
    ],
    footprint: {
      storedDataSizeBytes: 62914560,
      storedDataSizeFormatted: '60.0 MB',
      ramUsageBytes: 157286400,
      ramUsageFormatted: '150 MB (Sparse Matrices in RAM)',
      diskUsageFormatted: '72 MB AOF file',
      coldStartSec: 1.1,
      observableFields: {
        'Matrix Representation': 'GraphBLAS CSR/CSC Compressed Matrices',
        'Redis RAM Overhead': '150 MB'
      }
    },
    caveats: [
      'Matrix resize and mutation costs make single concurrent write transactions slightly more expensive.',
      'Complex Cypher pattern expressions with multi-property predicates require hybrid matrix+KV parsing.'
    ],
    strengths: [
      'Multi-hop path traversals (2-hop, 3-hop) leverage SIMD/matrix multiplication algorithmically.',
      'Compact sparse matrix format keeps memory usage very reasonable.'
    ],
    weaknesses: [
      'Higher latency on individual point updates that perturb matrix structure.'
    ]
  },
  arangodb: {
    dbId: 'arangodb',
    dbName: 'ArangoDB (Multi-Model RocksDB)',
    specs: DATABASE_SPECS.arangodb,
    status: 'completed',
    lastRunTimestamp: '2026-08-21T05:20:00Z',
    datasetStats: {
      nodes: 20000,
      relationships: 120000,
      labels: ['User', 'Paper'],
      relTypes: ['FOLLOWS', 'CITES']
    },
    ingest: {
      nodesLoaded: 20000,
      relationshipsLoaded: 120000,
      totalTimeSec: 24.60,
      nodesPerSec: 813.0,
      relationshipsPerSec: 4878.0,
      batchSize: 2000,
      method: 'Batch HTTP Document & Edge Collection bulk inserts'
    },
    traversals: [
      {
        depth: '1-hop',
        query: 'FOR v, e IN 1..1 OUTBOUND "users/u1" follows RETURN v',
        p50: 3.40,
        p95: 7.90,
        coldP50: 14.50,
        coldP95: 36.20,
        avg: 4.10,
        nodesVisitedAvg: 12.4
      },
      {
        depth: '2-hop',
        query: 'FOR v, e IN 2..2 OUTBOUND "users/u1" follows RETURN DISTINCT v',
        p50: 18.90,
        p95: 46.20,
        coldP50: 68.00,
        coldP95: 142.00,
        avg: 22.40,
        nodesVisitedAvg: 154.2
      },
      {
        depth: '3-hop',
        query: 'FOR v, e IN 3..3 OUTBOUND "users/u1" follows LIMIT 1000 RETURN DISTINCT v',
        p50: 84.20,
        p95: 210.00,
        coldP50: 240.00,
        coldP95: 580.00,
        avg: 98.60,
        nodesVisitedAvg: 1840.6
      }
    ],
    lookups: [
      {
        type: 'point_lookup_by_id',
        description: 'Point lookup by indexed primary key',
        indexedProperties: ['_key (Primary Hash Index)'],
        p50: 1.30,
        p95: 3.10,
        avg: 1.48
      },
      {
        type: 'indexed_property_filter',
        description: 'Range filter with Persistent Index on activityScore',
        indexedProperties: ['activityScore (Skiplist/Persistent Index)'],
        p50: 4.80,
        p95: 11.20,
        avg: 5.40
      },
      {
        type: 'non_indexed_filter',
        description: 'Full collection scan with substring filter',
        indexedProperties: ['None (Sequential Document Scan)'],
        p50: 39.50,
        p95: 82.00,
        avg: 44.10
      }
    ],
    aggregations: [
      {
        type: 'degree_distribution_histogram',
        description: 'Group-by Out-degree Distribution over all 20k Users',
        query: 'FOR e IN follows COLLECT fromId = e._from WITH COUNT INTO degree COLLECT deg = degree WITH COUNT INTO count RETURN {degree: deg, count}',
        p50: 34.20,
        p95: 72.00,
        avg: 38.50,
        resultSummary: '20,000 nodes aggregated'
      },
      {
        type: 'grouped_avg_metric',
        description: 'Average activityScore grouped by top interest categories',
        query: 'FOR u IN users FOR i IN u.interests COLLECT interest = i AGGREGATE avgScore = AVG(u.activityScore) RETURN {interest, avgScore}',
        p50: 26.40,
        p95: 54.00,
        avg: 29.80,
        resultSummary: '20 categories aggregated'
      }
    ],
    concurrencySweeps: [
      {
        concurrentClients: 1,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 280.0,
        p50LatencyMs: 3.50,
        p95LatencyMs: 8.20,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 10,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 1320.0,
        p50LatencyMs: 7.40,
        p95LatencyMs: 22.10,
        errorRatePercent: 0.0
      },
      {
        concurrentClients: 40,
        readRatio: 0.8,
        writeRatio: 0.2,
        sustainedQPS: 1980.0,
        p50LatencyMs: 19.80,
        p95LatencyMs: 68.40,
        errorRatePercent: 0.6
      }
    ],
    footprint: {
      storedDataSizeBytes: 146800640,
      storedDataSizeFormatted: '140.0 MB',
      ramUsageBytes: 314572800,
      ramUsageFormatted: '300 MB (RocksDB Block Cache)',
      diskUsageFormatted: '185 MB RocksDB SSTables',
      coldStartSec: 3.2,
      observableFields: {
        'RocksDB Cache': '200 MB',
        'Process Resident Set': '300 MB',
        'Disk Used': '185 MB'
      }
    },
    caveats: [
      'Index-free adjacency is not present; multi-hop traversals require repeated RocksDB edge collection index lookups.',
      'Higher latency overhead per hop due to translation between graph abstractions and document/key-value storage.'
    ],
    strengths: [
      'Multi-model flexibility (Graphs + Documents + Full-text Search in one engine).',
      'ACID transactions across multiple collections.'
    ],
    weaknesses: [
      'Significantly higher 2-hop and 3-hop traversal latency compared to native graph engines (CognoDB, Memgraph, FalkorDB).'
    ]
  }
};
