export interface DatabaseSpec {
  id: string;
  name: string;
  version: string;
  tier: string;
  vCPU: string;
  ram: string;
  storage: string;
  storageEngine: string;
  queryLanguage: string;
  connectionProtocol: string;
  memoryModel: string;
  license: string;
  isCloudHosted: boolean;
  costPerHour: string;
  notes: string;
}

export interface MetricPercentiles {
  min: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  max: number;
  avg: number;
  stdDev: number;
}

export interface TraversalMetric {
  depth: '1-hop' | '2-hop' | '3-hop';
  query: string;
  p50: number;
  p95: number;
  coldP50?: number;
  coldP95?: number;
  avg: number;
  nodesVisitedAvg: number;
}

export interface LookupMetric {
  type: 'point_lookup_by_id' | 'indexed_property_filter' | 'non_indexed_filter';
  description: string;
  indexedProperties: string[];
  p50: number;
  p95: number;
  avg: number;
}

export interface AggregationMetric {
  type: string;
  description: string;
  query: string;
  p50: number;
  p95: number;
  avg: number;
  resultSummary: string;
}

export interface IngestMetric {
  nodesLoaded: number;
  relationshipsLoaded: number;
  totalTimeSec: number;
  nodesPerSec: number;
  relationshipsPerSec: number;
  batchSize: number;
  method: string;
}

export interface ConcurrencyMetric {
  concurrentClients: number; // 1, 10, 40
  readRatio: number; // e.g. 0.8
  writeRatio: number; // e.g. 0.2
  sustainedQPS: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  errorRatePercent: number;
}

export interface FootprintMetric {
  storedDataSizeBytes: number;
  storedDataSizeFormatted: string;
  ramUsageBytes: number;
  ramUsageFormatted: string;
  diskUsageFormatted: string;
  coldStartSec: number;
  observableFields: { [key: string]: string };
}

export interface DatabaseBenchmarkResult {
  dbId: string;
  dbName: string;
  specs: DatabaseSpec;
  status: 'completed' | 'running' | 'failed' | 'cached';
  lastRunTimestamp: string;
  datasetStats: {
    nodes: number;
    relationships: number;
    labels: string[];
    relTypes: string[];
  };
  ingest: IngestMetric;
  traversals: TraversalMetric[];
  lookups: LookupMetric[];
  aggregations: AggregationMetric[];
  concurrencySweeps: ConcurrencyMetric[];
  footprint: FootprintMetric;
  caveats: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface BenchmarkSuiteRunConfig {
  databaseUri: string;
  username: string;
  password?: string;
  databaseName?: string;
  iterationsPerQuery: number;
  warmupIterations: number;
  concurrencyLevels: number[];
  datasetSize: 'small_25k' | 'medium_120k' | 'large_300k';
}

export interface BenchmarkLiveLog {
  id: string;
  timestamp: string;
  phase: 'init' | 'connect' | 'ingest' | 'warmup' | 'traversal' | 'lookup' | 'aggregation' | 'concurrency' | 'completed' | 'error';
  message: string;
  details?: Record<string, unknown>;
  progressPercent?: number;
}
